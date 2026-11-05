import { useState } from "react";
import { Alert, Badge, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

export function ProductCard({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);
  const [addError, setAddError] = useState("");

  async function handleAddToCart() {
    if (pending) return;
    if (!user) {
      navigate("/login", { state: { from: "/menu", notice: "Vui lòng đăng nhập để thêm món vào giỏ." } });
      return;
    }
    setPending(true);
    setAddError("");
    const result = await addToCart(product, 1);
    setPending(false);
    if (result.error) return setAddError(result.error);
    setAdded(true);
  }

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden">
      <Link to={`/products/${product.id}`} tabIndex={-1} aria-hidden="true">
        <Card.Img variant="top" src={product.image} alt="" loading="lazy"
          style={{ aspectRatio: "8 / 5", objectFit: "cover" }} />
      </Link>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Badge bg="success">{product.categoryName}</Badge>
          <Badge bg="light" text="dark">🔥 {product.nutrition.calories} kcal</Badge>
        </div>
        <Card.Title as="h2" className="h5">{product.name}</Card.Title>
        <Card.Text className="text-muted small">{product.description}</Card.Text>
        <div className="mt-auto">
          <p className="fs-5 fw-bold text-success">{formatCurrency(product.price)}</p>
          <div className="d-flex flex-wrap gap-2">
            <Button as={Link} to={`/products/${product.id}`} variant="outline-primary" size="sm">Xem chi tiết</Button>
            <Button size="sm" onClick={handleAddToCart} disabled={pending || product.status !== "AVAILABLE"}>
              {product.status === "AVAILABLE" ? "Thêm vào giỏ" : "Hết hàng"}
            </Button>
          </div>
          {addError && <Alert variant="danger" className="small mt-3 mb-0">{addError}</Alert>}
          {added && <Alert variant="success" className="small mt-3 mb-0" dismissible
            onClose={() => setAdded(false)}>
            Đã thêm 1 phần {product.name} vào giỏ.
          </Alert>}
        </div>
      </Card.Body>
    </Card>
  );
}
