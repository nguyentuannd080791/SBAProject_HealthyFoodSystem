import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/provider/useAuth";
import { productApi } from "../../menu/api/productApi";
import { mapCartItem } from "../../menu/utils/mapProduct";
import { cartApi } from "../api/cartApi";
import { CartContext } from "./CartContext";
import { CART_STORAGE_KEY, addCartItem, getCartTotals, parseStoredCart,
  updateCartQuantity } from "../utils/cartState";

function readGuestCart() {
  try {
    return { items: parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)), error: "" };
  } catch {
    return { items: [], error: "Không thể đọc giỏ hàng đã lưu trên trình duyệt." };
  }
}

function guestCartItem(item) {
  return { ...item, cartItemId: `guest:${item.id}`, pendingGuest: true };
}

function stockError(product, quantity) {
  if (product.status !== "AVAILABLE") return `Sản phẩm ${product.name} hiện không có bán.`;
  const availableQuantity = product.availableQuantity ?? 0;
  if (availableQuantity != null && quantity > availableQuantity) {
    return `Sản phẩm ${product.name} chỉ còn ${availableQuantity} trong kho.`;
  }
  return "";
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [initialGuestCart] = useState(readGuestCart);
  const [guestCart, setGuestCart] = useState(initialGuestCart.items);
  const guestCartRef = useRef(initialGuestCart.items);
  const [storageError, setStorageError] = useState(initialGuestCart.error);
  const [serverCart, setServerCart] = useState({ email: null, items: [] });
  const [cartError, setCartError] = useState("");
  const [isCartSyncing, setIsCartSyncing] = useState(false);
  const [syncRequestId, setSyncRequestId] = useState(0);
  const mutationQueue = useRef(Promise.resolve());
  const email = user?.email;
  const serverItems = email === serverCart.email ? serverCart.items : [];
  const items = email ? [...serverItems, ...guestCart.map(guestCartItem)]
    : guestCart.map(guestCartItem);
  const isCartLoading = Boolean(email && (email !== serverCart.email || isCartSyncing));

  function saveGuestCart(nextItems) {
    guestCartRef.current = nextItems;
    setGuestCart(nextItems);
    try {
      if (nextItems.length) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
      else window.localStorage.removeItem(CART_STORAGE_KEY);
      setStorageError("");
    } catch {
      setStorageError("Không thể lưu giỏ hàng trên trình duyệt. Hãy kiểm tra bộ nhớ trình duyệt.");
    }
  }

  useEffect(() => {
    if (!email) {
      setServerCart({ email: null, items: [] });
      setCartError("");
      return undefined;
    }
    let cancelled = false;
    setIsCartSyncing(true);
    const task = mutationQueue.current.then(async () => {
      if (cancelled) return;
      const currentCart = await cartApi.get();
      if (cancelled) return;
      if (currentCart.error) {
        setServerCart({ email, items: [] });
        setCartError(currentCart.error);
        return;
      }
      setServerCart({ email, items: currentCart.data.items.map(mapCartItem) });
      const failures = [];
      for (const item of [...guestCartRef.current]) {
        if (cancelled) return;
        const result = await cartApi.add(item.id, item.quantity);
        if (result.error) {
          failures.push(`${item.name}: ${result.error}`);
          continue;
        }
        setServerCart({ email, items: result.data.items.map(mapCartItem) });
        saveGuestCart(guestCartRef.current.filter((guest) => guest.id !== item.id));
      }
      if (!cancelled) setCartError(failures.length
        ? `Một số món chưa được chuyển vào tài khoản. ${failures.join(" ")} Hãy chỉnh số lượng rồi thử lại.`
        : "");
    }).finally(() => { if (!cancelled) setIsCartSyncing(false); });
    mutationQueue.current = task.then(() => undefined, () => undefined);
    return () => { cancelled = true; };
  }, [email, syncRequestId]);

  function mutate(request) {
    if (!email) return Promise.resolve({ error: "Vui lòng đăng nhập để cập nhật giỏ hàng." });
    const task = mutationQueue.current.then(async () => {
      const result = await request();
      if (result.error) {
        setCartError(result.error);
        const refreshed = await cartApi.get();
        if (!refreshed.error) {
          setServerCart({ email, items: refreshed.data.items.map(mapCartItem) });
        }
        return result;
      }
      setServerCart({ email, items: result.data.items.map(mapCartItem) });
      setCartError("");
      return result;
    });
    mutationQueue.current = task.then(() => undefined, () => undefined);
    return task;
  }

  async function loadAvailableProduct(productId) {
    const result = await productApi.get(productId);
    if (result.error) return result;
    const error = stockError(result.data, 1);
    return error ? { error } : result;
  }

  async function addToCart(product, quantity = 1) {
    if (!Number.isSafeInteger(product?.id) || product.id < 1 ||
        !Number.isSafeInteger(quantity) || quantity < 1) {
      return { error: "Sản phẩm hoặc số lượng không hợp lệ." };
    }
    if (email) return mutate(() => cartApi.add(product.id, quantity));
    const result = await loadAvailableProduct(product.id);
    if (result.error) return { error: result.error };
    const current = guestCartRef.current.find((item) => item.id === product.id);
    const totalQuantity = (current?.quantity ?? 0) + quantity;
    if (!Number.isSafeInteger(totalQuantity)) return { error: "Số lượng sản phẩm quá lớn." };
    const error = stockError(result.data, totalQuantity);
    if (error) return { error };
    saveGuestCart(addCartItem(guestCartRef.current, result.data, quantity));
    setCartError("");
    return { data: { items: guestCartRef.current } };
  }

  async function updateQuantity(itemId, quantity) {
    if (!String(itemId).startsWith("guest:")) {
      return mutate(() => cartApi.update(itemId, quantity));
    }
    const productId = Number(String(itemId).slice(6));
    const current = guestCartRef.current.find((item) => item.id === productId);
    if (!current || !Number.isSafeInteger(quantity) || quantity < 1) {
      return { error: "Số lượng sản phẩm không hợp lệ." };
    }
    if (quantity > current.quantity) {
      const result = await loadAvailableProduct(productId);
      if (result.error) {
        setCartError(result.error);
        return { error: result.error };
      }
      const error = stockError(result.data, quantity);
      if (error) {
        setCartError(error);
        return { error };
      }
    }
    saveGuestCart(updateCartQuantity(guestCartRef.current, productId, quantity));
    setCartError("");
    return { data: { items: guestCartRef.current } };
  }

  function removeFromCart(itemId) {
    if (!String(itemId).startsWith("guest:")) return mutate(() => cartApi.remove(itemId));
    const productId = Number(String(itemId).slice(6));
    saveGuestCart(guestCartRef.current.filter((item) => item.id !== productId));
    setCartError("");
    return Promise.resolve({ data: { items: guestCartRef.current } });
  }

  async function clearCart() {
    if (email) {
      const result = await mutate(() => cartApi.clear());
      if (result.error) return result;
    }
    saveGuestCart([]);
    setCartError("");
    return { data: { items: [] } };
  }

  return (
    <CartContext.Provider value={{
      items, addToCart,
      refreshCart: () => email ? mutate(() => cartApi.get())
        : Promise.resolve({ data: { items: guestCartRef.current } }),
      updateQuantity, removeFromCart, clearCart,
      retryGuestCart: () => setSyncRequestId((value) => value + 1),
      pendingGuestItems: email ? guestCart.length : 0,
      isCartLoading, ...getCartTotals(items), storageError, cartError,
    }}>
      {children}
    </CartContext.Provider>
  );
}
