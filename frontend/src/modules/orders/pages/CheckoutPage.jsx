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
  const { items, totalItems, totalPrice, refreshCart, isCartLoading,
    pendingGuestItems, cartError } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoQuote, setPromoQuote] = useState(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const promoVersion = useRef(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestId = useRef(null);
  const submitting = useRef(false);

  const cartKey = JSON.stringify(items.map((item) => [item.cartItemId, item.quantity, item.price]));
  const promoApplied = promoQuote?.cartKey === cartKey && promoQuote?.code === promoCode.trim().toUpperCase();
  const discount = promoApplied ? Number(promoQuote.discount) : 0;
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

  async function applyPromo() {
    const version = ++promoVersion.current;
    const code = promoCode.trim().toUpperCase();
    setPromoQuote(null);
    setApplyingPromo(true);
    const result = await orderStore.previewPromotion(code);
    if (version !== promoVersion.current) return;
    setApplyingPromo(false);
    if (result.error) return setError(result.error);
    if (Number(result.data.subtotal) !== totalPrice) {
      await refreshCart();
      return setError("Giỏ hàng đã thay đổi. Vui lòng kiểm tra và áp dụng lại mã.");
    }
    setPromoQuote({ ...result.data, cartKey });
    setError("");
  }

  async function placeOrder(delivery) {
    if (submitting.current || applyingPromo) return;
    submitting.current = true;
    setError("");
    setIsSubmitting(true);
    requestId.current ??= crypto.randomUUID();
    const order = {
      requestId: requestId.current,
      expectedSubtotal: totalPrice,
      expectedCart: Object.fromEntries(items.map((item) => [item.cartItemId, item.quantity])),
      delivery,
      paymentMethod: "sepay",
      promoCode: promoApplied ? promoQuote.code : "",
      expectedDiscount: discount,
    };
    const result = await orderStore.create(order);
    submitting.current = false;
    setIsSubmitting(false);
    if (result.error) return setError(result.error);
    rememberPendingPayment(user?.id, result.data);
    await refreshCart();
    navigate(`/orders/${encodeURIComponent(result.data.id)}`, { replace: true });
  }

  if (isCartLoading) {
    return <p role="status">Đang chuẩn bị giỏ hàng để thanh toán…</p>;
  }

  if (pendingGuestItems > 0) {
    return <Card body className="order-empty text-center">
      <h1 className="h4 mt-3">Giỏ hàng cần được cập nhật</h1>
      <p>{cartError || "Một số món trong giỏ tạm chưa được chuyển vào tài khoản."}</p>
      <Button as={Link} to="/cart" className="align-self-center">Quay lại giỏ hàng</Button>
    </Card>;
  }

  if (!items.length) {
    return <Card body className="order-empty text-center">
      <span>🛒</span><h1 className="h4 mt-3">Giỏ hàng đang trống</h1>
      <p className="text-muted">{cartError || "Thêm món trước khi thanh toán nhé."}</p>
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
            <DeliveryForm initialValues={initialDelivery} onSubmit={placeOrder} isSubmitting={isSubmitting || applyingPromo} />
          </Card>
          <Card body className="order-panel">
            <h2 className="h5 mb-3">Phương thức thanh toán</h2>
            <div className="payment-choice is-selected"><strong>Chuyển khoản qua SePay</strong>
              <small className="d-block text-secondary">Thanh toán trước bằng QR ngân hàng. Đơn được chuẩn bị sau khi thanh toán thành công.</small></div>
            <Alert variant="info" className="mt-3 mb-0 small">Sau khi đặt đơn, quét QR ở trang chi tiết. Hệ thống tự xác nhận khi nhận được giao dịch.</Alert>
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
              <div className="d-flex gap-2"><Form.Control maxLength={30} value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setPromoQuote(null); promoVersion.current += 1; setApplyingPromo(false); }} placeholder="Nhập mã ưu đãi" disabled={isSubmitting} />
                <Button variant="outline-primary" disabled={applyingPromo || isSubmitting || !promoCode.trim()} onClick={applyPromo}>{applyingPromo ? "Đang kiểm tra..." : "Áp dụng"}</Button></div>
            </Form.Group>
            {promoApplied && <Alert variant="success" className="small mt-3 mb-0">Đã áp dụng {promoQuote.code} · {promoQuote.name}. Giảm cho {promoQuote.eligibleItems} món thuộc chương trình.</Alert>}
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
