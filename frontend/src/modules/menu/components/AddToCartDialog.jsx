import { useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { QuantityControl } from "../../../shared/components/QuantityControl";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

export function AddToCartDialog({ product, show, onHide, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} onShow={() => setQuantity(1)}
      centered dialogClassName="add-to-cart-modal">
      <Modal.Header closeButton>
        <div>
          <Modal.Title as="h2" className="h5 mb-1">Thêm vào giỏ hàng</Modal.Title>
          <p className="small text-muted mb-0">Kiểm tra món ăn và số lượng trước khi xác nhận.</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="add-to-cart-product d-flex align-items-center gap-3 p-3 rounded-3 mb-4">
          <img src={product.image} alt={product.name} className="add-to-cart-product-image rounded-3" />
          <div className="add-to-cart-product-info">
            {product.categoryName && <Badge bg="success" className="mb-2">{product.categoryName}</Badge>}
            <h3 className="h6 mb-1">{product.name}</h3>
            <p className="text-success fw-bold mb-0">{formatCurrency(product.price)} <span className="small fw-normal text-muted">/ phần</span></p>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 py-2">
          <div>
            <p className="fw-semibold mb-1">Số lượng</p>
            <p className="small text-muted mb-0">Chọn số phần bạn muốn đặt</p>
          </div>
          <QuantityControl quantity={quantity} onChange={setQuantity} name={product.name} />
        </div>
        <div className="add-to-cart-total d-flex align-items-center justify-content-between gap-3 rounded-3 p-3 mt-3">
          <div>
            <p className="fw-bold mb-1">Tạm tính</p>
            <p className="small text-muted mb-0" aria-live="polite">
              {formatCurrency(product.price)} × {quantity} phần
            </p>
          </div>
          <output className="fs-5 fw-bold text-success text-nowrap" aria-live="polite">
            {formatCurrency(product.price * quantity)}
          </output>
        </div>
      </Modal.Body>
      <Modal.Footer className="add-to-cart-footer">
        <Button variant="outline-secondary" onClick={onHide}>Tiếp tục xem món</Button>
        <Button onClick={() => onConfirm(product, quantity)}>Xác nhận thêm</Button>
      </Modal.Footer>
    </Modal>
  );
}
