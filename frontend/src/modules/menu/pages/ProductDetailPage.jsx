import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../../cart/hooks/useCart";
import { screeningApi } from "../../screening/api/screeningApi";
import { ProductHealthAlert } from "../../screening/components/ProductHealthAlert";
import { AddToCartDialog } from "../components/AddToCartDialog";
import { NutritionFacts } from "../components/NutritionFacts";
import { useProductDetail } from "../hooks/useProductDetail";

export function ProductDetailPage() {
  const { product, loading, error } = useProductDetail();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(null);
  const [addError, setAddError] = useState("");
  const [pending, setPending] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);

  useEffect(() => {
    if (!user || !product?.id) {
      setScreeningResult(null);
      return;
    }
    screeningApi.evaluateProduct(product.id)
      .then(setScreeningResult)
      .catch(() => {});
  }, [user, product?.id]);

  async function confirmAddToCart(selectedProduct, quantity) {
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

  const availableQuantity = product.availableQuantity ?? 0;
  const soldOut = product.status !== "AVAILABLE" || availableQuantity === 0;

  return (
    <div className="pb-5">
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
          <p className={soldOut ? "text-secondary" : availableQuantity <= 5 ? "text-warning" : "text-success"}>
            {product.status !== 'AVAILABLE' ? 'Ngừng bán' : soldOut ? "Tạm hết hàng" : `Còn ${availableQuantity} combo`}
          </p>
          <p>{product.description}</p>
          <div className="d-flex flex-wrap gap-2 mb-3">{product.tags.map((tag) => (
            <Badge key={tag} bg="light" text="dark" className="border">{tag}</Badge>
          ))}</div>
          <h2 className="h5">Thành phần nguyên liệu</h2>
          <ul className="mb-4">{product.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
          <NutritionFacts nutrition={product.nutrition} />
          <ProductHealthAlert screeningResult={screeningResult} />
          <Button onClick={() => setShowAddDialog(true)} disabled={soldOut}>
            {product.status !== 'AVAILABLE' ? 'Ngừng bán' : soldOut ? "Hết hàng" : "Thêm vào giỏ hàng"}
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
    </div>
  );
}
