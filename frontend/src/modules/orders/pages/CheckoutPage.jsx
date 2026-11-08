import { useMemo, useRef, useState } from "react";
import { Alert, Badge, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { DeliveryForm } from "../components/DeliveryForm";
import { OrderPageHeader } from "../components/OrderPageHeader";
import { orderStore } from "../api/orderStore";
import { rememberPendingPayment } from "../utils/paymentNotifications";
import "../styles/orders.css";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalItems, totalPrice, refreshCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestId = useRef(null);
  const submitting = useRef(false);

  const discount = promoApplied ? Math.round(totalPrice * 0.1) : 0;
  const deliveryFee = totalPrice >= 200000 ? 0 : 1000;
  const grandTotal = totalPrice - discount + deliveryFee;
  const initialDelivery = useMemo(() => ({
    recipientName: user?.fullName ?? "",
    recipientPhone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  }), [user]);

  function applyPromo() {
    const valid = promoCode.trim().toUpperCase() === "HEALTHY10";
    setPromoApplied(valid);
    setError(valid ? "" : "Mã ưu đãi không hợp lệ. Bạn có thể thử HEALTHY10.");
  }

  async function placeOrder(delivery) {
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    setIsSubmitting(true);
    requestId.current ??= crypto.randomUUID();
    const order = {
      requestId: requestId.current,
      expectedSubtotal: totalPrice,
      expectedCart: Object.fromEntries(items.map((item) => [item.cartItemId, item.quantity])),
      delivery,
      paymentMethod,
      promoCode: promoApplied ? "HEALTHY10" : "",
    };
    const result = await orderStore.create(order);
    submitting.current = false;
    setIsSubmitting(false);
    if (result.error) return setError(result.error);
    rememberPendingPayment(user?.id, result.data);
    await refreshCart();
    navigate(`/orders/${encodeURIComponent(result.data.id)}`, { replace: true });
  }

  if (!items.length) {
    return <Card body className="order-empty text-center">
      <span>🛒</span><h1 className="h4 mt-3">Giỏ hàng đang trống</h1>
      <p className="text-muted">Thêm món trước khi thanh toán nhé.</p>
      <Button as={Link} to="/menu" className="align-self-center">Khám phá thực đơn</Button>
    </Card>;
  }

  return (
    <div className="orders-page">
      <Link to="/cart" className="order-back">← Quay lại giỏ hàng</Link>
      <OrderPageHeader eyebrow="SẮP HOÀN TẤT" title="Thanh toán đơn hàng"
        description="Chỉ còn một bước nữa để bữa ăn được giao đến bạn." />
      <ol className="checkout-progress" aria-label="Các bước đặt hàng">
        <li className="is-done"><span>✓</span> Chọn món</li><li className="is-current" aria-current="step"><span>2</span> Thông tin & thanh toán</li><li><span>3</span> Theo dõi đơn</li>
      </ol>
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      <div className="row g-4 align-items-start">
        <div className="col-lg-7">
          <Card body className="order-panel mb-3">
            <h2 className="h5 mb-1">Địa chỉ nhận hàng</h2>
            <p className="small text-secondary mb-4">Cho chúng mình biết bữa ăn sẽ được giao đến đâu.</p>
            <DeliveryForm initialValues={initialDelivery} onSubmit={placeOrder} isSubmitting={isSubmitting} />
          </Card>
          <Card body className="order-panel">
            <h2 className="h5 mb-3">Phương thức thanh toán</h2>
            <Form.Check className={`payment-choice${paymentMethod === "cash" ? " is-selected" : ""}`} type="radio" name="paymentMethod" id="pay-cash"
              label={<><strong>Tiền mặt khi nhận hàng</strong><small className="d-block text-secondary">Thanh toán trực tiếp cho nhân viên giao hàng.</small></>}
              checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
            <Form.Check className={`payment-choice mt-3${paymentMethod === "sepay" ? " is-selected" : ""}`} type="radio" name="paymentMethod" id="pay-sepay"
              label={<><strong>Chuyển khoản qua SePay</strong><small className="d-block text-secondary">Đơn sẽ ở trạng thái chờ thanh toán.</small></>}
              checked={paymentMethod === "sepay"} onChange={() => setPaymentMethod("sepay")} />
            {paymentMethod === "sepay" && <Alert variant="info" className="mt-3 mb-0 small">Sau khi đặt đơn, quét QR ở trang chi tiết. Trạng thái tự cập nhật khi ngân hàng xác nhận.</Alert>}
          </Card>
        </div>

        <div className="col-lg-5">
          <Card body className="order-panel order-summary-card">
            <div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">Tóm tắt đơn</h2><Badge bg="success">{totalItems} món</Badge></div>
            <div className="checkout-items">{items.map((item) => <div className="checkout-item" key={item.id}>
              <img src={item.image} alt="" /><div className="flex-grow-1"><strong>{item.name}</strong><small className="d-block text-secondary">{item.quantity} × {formatCurrency(item.price)}</small></div>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>)}</div>
            <Form.Group className="mt-3"><Form.Label className="small fw-semibold">Mã giảm giá</Form.Label>
              <div className="d-flex gap-2"><Form.Control value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setPromoApplied(false); }} placeholder="Nhập HEALTHY10" />
                <Button variant="outline-primary" onClick={applyPromo}>Áp dụng</Button></div>
            </Form.Group>
            <div className="cart-totals mt-3"><div><span>Tạm tính</span><span>{formatCurrency(totalPrice)}</span></div>
              {discount > 0 && <div className="text-success"><span>Giảm giá</span><span>−{formatCurrency(discount)}</span></div>}
              <div><span>Phí giao hàng</span><span>{deliveryFee ? formatCurrency(deliveryFee) : "Miễn phí"}</span></div>
              <div className="cart-total"><strong>Tổng thanh toán</strong><strong>{formatCurrency(grandTotal)}</strong></div></div>
            <p className="small text-secondary mt-3 mb-0">Phí giao hàng miễn phí với đơn từ 200.000₫.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
