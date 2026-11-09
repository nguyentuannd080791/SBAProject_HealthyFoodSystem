import { Link } from "react-router";
import { CartIcon } from "../../../shared/components/Icons";
import { useCart } from "../hooks/useCart";
import "./floatingCartLink.css";

export function FloatingCartLink() {
  const { totalItems } = useCart();

  if (totalItems < 1) return null;

  return (
    <Link to="/cart" className="floating-cart-link"
      aria-label={`Xem giỏ hàng, ${totalItems} món`}>
      <span className="floating-cart-icon">
        <CartIcon size={30} />
        <span className="floating-cart-count" aria-live="polite">{totalItems}</span>
      </span>
      <span>Giỏ hàng ({totalItems})</span>
      <span className="floating-cart-arrow" aria-hidden="true">›</span>
    </Link>
  );
}
