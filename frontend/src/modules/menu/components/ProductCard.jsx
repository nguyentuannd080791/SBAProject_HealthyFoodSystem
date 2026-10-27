import { useState } from "react";
import { Alert, Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useCart } from "../../cart/hooks/useCart";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { AddToCartDialog } from "./AddToCartDialog";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(null);

  function confirmAddToCart(selectedProduct, quantity) {
    addToCart(selectedProduct, quantity);
    setAddedQuantity(quantity);
    setShowAddDialog(false);
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
            <Button size="sm" onClick={() => setShowAddDialog(true)}>Thêm vào giỏ</Button>
          </div>
          {addedQuantity !== null && <Alert variant="success" className="small mt-3 mb-0" dismissible
            onClose={() => setAddedQuantity(null)}>
            Đã thêm {addedQuantity} phần {product.name} vào giỏ.
          </Alert>}
        </div>
      </Card.Body>
      <AddToCartDialog product={product} show={showAddDialog}
        onHide={() => setShowAddDialog(false)} onConfirm={confirmAddToCart} />
    </Card>
  );
}
