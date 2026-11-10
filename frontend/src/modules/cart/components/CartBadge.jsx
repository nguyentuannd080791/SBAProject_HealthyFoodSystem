import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router";
import { CartIcon } from "../../../shared/components/Icons";
import { useCart } from "../hooks/useCart";

export function CartBadge() {
  const { totalItems } = useCart();
  return (
    <Button as={Link} to="/cart" variant="outline-success" className="text-nowrap d-inline-flex align-items-center gap-1"
      aria-label={`Giỏ hàng: ${totalItems} món`}>
      <CartIcon size={18} />{" "}
      <Badge bg="danger" pill aria-live="polite">{totalItems}</Badge>
    </Button>
  );
}
