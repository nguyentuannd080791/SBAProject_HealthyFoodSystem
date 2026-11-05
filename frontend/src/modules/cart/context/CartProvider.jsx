import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../app/provider/useAuth";
import { mapCartItem } from "../../menu/utils/mapProduct";
import { cartApi } from "../api/cartApi";
import { CartContext } from "./CartContext";
import { getCartTotals } from "../utils/cartState";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [serverCart, setServerCart] = useState({ email: null, items: [] });
  const [cartError, setCartError] = useState("");
  const mutationQueue = useRef(Promise.resolve());
  const cartVersion = useRef(0);
  const items = user?.email === serverCart.email ? serverCart.items : [];

  useEffect(() => {
    if (!user?.email) return;
    let active = true;
    const version = cartVersion.current;
    cartApi.get().then((result) => {
      if (!active || cartVersion.current !== version) return;
      if (result.error) setCartError(result.error);
      else {
        setServerCart({ email: user.email, items: result.data.items.map(mapCartItem) });
        setCartError("");
      }
    });
    return () => { active = false; };
  }, [user?.email]);

  function mutate(request) {
    const email = user?.email;
    if (!email) return Promise.resolve({ error: "Vui lòng đăng nhập để cập nhật giỏ hàng." });
    cartVersion.current += 1;
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

  async function addToCart(product, quantity = 1) {
    if (!user?.email) return { error: "Vui lòng đăng nhập để thêm món vào giỏ." };
    if (!Number.isSafeInteger(product?.id) || product.id < 1 ||
        !Number.isSafeInteger(quantity) || quantity < 1) {
      return { error: "Sản phẩm hoặc số lượng không hợp lệ." };
    }
    return mutate(() => cartApi.add(product.id, quantity));
  }

  function updateQuantity(itemId, quantity) {
    return mutate(() => cartApi.update(itemId, quantity));
  }

  function removeFromCart(itemId) {
    return mutate(() => cartApi.remove(itemId));
  }

  return (
    <CartContext.Provider value={{
      items, addToCart,
      updateQuantity, removeFromCart, clearCart: () => {},
      ...getCartTotals(items), storageError: "", cartError, isServerCart: true,
    }}>
      {children}
    </CartContext.Provider>
  );
}
