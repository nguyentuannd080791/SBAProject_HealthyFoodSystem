import { useEffect, useState } from "react";
import { useAuth } from "../../../app/provider/useAuth";
import { cartApi } from "../api/cartApi";
import { CartContext } from "./CartContext";
import {
  addCartItem, CART_STORAGE_KEY, getCartTotals, parseStoredCart, updateCartQuantity,
} from "../utils/cartState";

function loadCart() {
  try {
    return parseStoredCart(localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [guestItems, setGuestItems] = useState(loadCart);
  const [serverCart, setServerCart] = useState({ email: null, items: [] });
  const [cartError, setCartError] = useState("");
  const [storageError, setStorageError] = useState("");
  const isServerCart = Boolean(user);
  const items = isServerCart && serverCart.email === user.email ? serverCart.items :
    isServerCart ? [] : guestItems;

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(guestItems));
      setStorageError("");
    } catch {
      setStorageError("Trình duyệt không thể lưu giỏ hàng. Các thay đổi có thể mất khi tải lại trang.");
    }
  }, [guestItems]);

  useEffect(() => {
    if (!user?.email) return;
    let active = true;
    cartApi.get().then((result) => {
      if (!active) return;
      if (result.error) setCartError(result.error);
      else {
        setServerCart({ email: user.email, items: result.data.items });
        setCartError("");
      }
    });
    return () => { active = false; };
  }, [user?.email]);

  async function addToCart(product, quantity = 1) {
    if (isServerCart) {
      const result = await cartApi.add(product.id, quantity);
      if (!result.error) {
        setServerCart({ email: user.email, items: result.data.items });
        setCartError("");
      }
      return result;
    }
    setGuestItems((current) => addCartItem(current, product, quantity));
    return { data: true };
  }

  function updateQuantity(productId, quantity) {
    if (!isServerCart) setGuestItems((current) => updateCartQuantity(current, productId, quantity));
  }

  function removeFromCart(productId) {
    if (!isServerCart) setGuestItems((current) => current.filter((item) => String(item.id) !== String(productId)));
  }

  function clearCart() {
    if (!isServerCart) setGuestItems([]);
  }

  return (
    <CartContext.Provider value={{
      items, addToCart, updateQuantity, removeFromCart, clearCart,
      ...getCartTotals(items), storageError, cartError, isServerCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}
