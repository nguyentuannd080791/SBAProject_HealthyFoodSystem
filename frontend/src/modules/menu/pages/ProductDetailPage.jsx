import { useState } from "react";
import { Alert, Badge, Button, Col, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../../cart/hooks/useCart";
import { AddToCartDialog } from "../components/AddToCartDialog";
import { NutritionFacts } from "../components/NutritionFacts";
import { useProductDetail } from "../hooks/useProductDetail";

export function ProductDetailPage() {
  const { product, loading, error } = useProductDetail();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(null);
  const [addError, setAddError] = useState("");
  const [pending, setPending] = useState(false);

  async function confirmAddToCart(selectedProduct, quantity) {
    if (!user) {
      navigate("/login", { state: { from: `/products/${product.id}`, notice: "Vui lòng đăng nhập để thêm món vào giỏ." } });
      return;
    }
    setPending(true);
    setAddError("");
    const result = await addToCart(selectedProduct, quantity);
    setPending(false);
    if (result.error) return setAddError(result.error);
    setAddedQuantity(quantity);
    setShowAddDialog(false);
  }

  if (loading) return <p role="status">Đang tải món ăn…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return (
    <Alert variant="warning">
      <h1 className="h4">Không tìm thấy món ăn</h1>
      <p>Món ăn này không có trong thực đơn hiện tại.</p>
      <Button as={Link} to="/menu">Quay lại thực đơn</Button>
    </Alert>
  );

  return (
    <>
      <Button as={Link} to="/menu" variant="link" className="px-0 mb-3">← Quay lại thực đơn</Button>
      <Row className="g-4 g-lg-5">
        <Col md={6}>
          {product.image ? <Image src={product.image} alt={product.name} fluid rounded className="w-100 shadow-sm"
            style={{ aspectRatio: "8 / 5", objectFit: "cover" }} /> : <div className="bg-light text-muted p-5 text-center">Chưa có ảnh</div>}
        </Col>
        <Col md={6}>
          <Badge bg="success" className="mb-2">{product.categoryName}</Badge>
          <h1 className="h2">{product.name}</h1>
          <p className="fs-3 fw-bold text-success">{formatCurrency(product.price)}</p>
          <p>{product.description}</p>
          <div className="d-flex flex-wrap gap-2 mb-3">{product.tags.map((tag) => (
            <Badge key={tag} bg="light" text="dark" className="border">{tag}</Badge>
          ))}</div>
          <h2 className="h5">Thành phần nguyên liệu</h2>
          <ul className="mb-4">{product.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
          <NutritionFacts nutrition={product.nutrition} />
          <Button onClick={() => setShowAddDialog(true)} disabled={product.status !== "AVAILABLE"}>
            {product.status === "AVAILABLE" ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </Button>
          {addedQuantity !== null && <Alert variant="success" className="mt-3" dismissible
            onClose={() => setAddedQuantity(null)}>
            Đã thêm {addedQuantity} phần {product.name} vào giỏ hàng.{" "}<Link to="/cart">Xem giỏ hàng</Link>
          </Alert>}
        </Col>
      </Row>
      <AddToCartDialog product={product} show={showAddDialog}
        onHide={() => setShowAddDialog(false)} onConfirm={confirmAddToCart}
        pending={pending} error={addError} />
    </>
  );
}
