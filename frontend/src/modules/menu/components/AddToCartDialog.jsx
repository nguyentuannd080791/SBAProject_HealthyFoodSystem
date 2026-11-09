import { Alert, Badge, Button, Modal } from "react-bootstrap";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

export function AddToCartDialog({ product, show, onHide, onConfirm, pending = false, error = "" }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={pending ? undefined : onHide}
      centered dialogClassName="add-to-cart-modal">
      <Modal.Header closeButton>
        <div>
          <Modal.Title as="h2" className="h5 mb-1">Thêm vào giỏ hàng</Modal.Title>
          <p className="small text-muted mb-0">Kiểm tra món ăn trước khi xác nhận.</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="add-to-cart-product d-flex align-items-center gap-3 p-3 rounded-3 mb-4">
          <img src={product.image} alt={product.name} className="add-to-cart-product-image rounded-3" />
          <div className="add-to-cart-product-info">
            {product.categoryName && <Badge bg="success" className="mb-2">{product.categoryName}</Badge>}
            <h3 className="h6 mb-1">{product.name}</h3>
            <p className="text-success fw-bold mb-0">{formatCurrency(product.price)} <span className="small fw-normal text-muted">/ phần</span></p>
          </div>
        </div>
        <p className="small text-muted mb-0">Mỗi lần thêm 1 phần. Bạn có thể chỉnh số lượng trong giỏ hàng.</p>
        <div className="add-to-cart-total d-flex align-items-center justify-content-between gap-3 rounded-3 p-3 mt-3">
          <div>
            <p className="fw-bold mb-1">Tạm tính</p>
            <p className="small text-muted mb-0">{formatCurrency(product.price)} × 1 phần</p>
          </div>
          <output className="fs-5 fw-bold text-success text-nowrap">
            {formatCurrency(product.price)}
          </output>
        </div>
      </Modal.Body>
      <Modal.Footer className="add-to-cart-footer">
        <Button variant="outline-secondary" onClick={onHide} disabled={pending}>Tiếp tục xem món</Button>
        <Button onClick={() => onConfirm(product, 1)} disabled={pending}>
          {pending ? "Đang thêm…" : "Xác nhận thêm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
