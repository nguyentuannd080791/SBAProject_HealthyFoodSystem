import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router";
import { useCart } from "../hooks/useCart";

export function CartBadge() {
  const { totalItems } = useCart();
  return (
    <Button as={Link} to="/cart" variant="outline-success" className="text-nowrap"
      aria-label={`Giỏ hàng: ${totalItems} món`}>
      <span aria-hidden="true">🛒</span>{" "}
      <Badge bg="danger" pill aria-live="polite">{totalItems}</Badge>
    </Button>
  );
}
