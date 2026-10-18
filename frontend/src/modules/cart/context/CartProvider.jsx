import { useEffect, useState } from "react";
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
  const [items, setItems] = useState(loadCart);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      setStorageError("");
    } catch {
      setStorageError("Trình duyệt không thể lưu giỏ hàng. Các thay đổi có thể mất khi tải lại trang.");
    }
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((current) => addCartItem(current, product, quantity));
  }

  function updateQuantity(productId, quantity) {
    setItems((current) => updateCartQuantity(current, productId, quantity));
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => String(item.id) !== String(productId)));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{
      items, addToCart, updateQuantity, removeFromCart, clearCart,
      ...getCartTotals(items), storageError,
    }}>
      {children}
    </CartContext.Provider>
  );
}
