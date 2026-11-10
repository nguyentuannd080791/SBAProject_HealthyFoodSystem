import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { orderStore } from "../api/orderStore";
import { rememberPendingPayment } from "../utils/paymentNotifications";
import { canCancelOrder, formatOrderAddress, formatOrderDate, orderStatuses } from "../utils/orderFormatting";
import "../styles/orders.css";

import { PaymentCountdown } from "../components/PaymentCountdown";

const stages = ["processing", "preparing", "shipping", "delivered"];

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [failedQrUrl, setFailedQrUrl] = useState(null);
  const [qrAttempt, setQrAttempt] = useState(0);
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let timer;
    async function reload() {
      const result = await orderStore.get(orderId);
      if (!active) return;
      setLoadError(result.error ?? "");
      setLoading(false);
      if (result.error) {
        timer = setTimeout(reload, 10000);
        return;
      }
      setOrder(result.data);
      rememberPendingPayment(user?.id, result.data);
      if (result.data?.paymentStatus === "pending") {
        const info = await orderStore.payment(orderId);
        if (!active) return;
        setPayment(info.data ?? null);
        if (info.error) setLoadError(info.error);
        timer = setTimeout(reload, 10000);
      } else {
        setPayment(null);
        if (result.data?.paymentStatus === "expired" || ["processing", "preparing", "shipping"].includes(result.data?.status)) {
          timer = setTimeout(reload, 10000);
        }
      }
    }
    reload();
    return () => { active = false; clearTimeout(timer); };
  }, [user?.id, orderId]);

  async function cancelOrder() {
    if (busy) return;
    if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) return;
    setBusy(true);
    const result = await orderStore.cancel(order.id);
    setBusy(false);
    if (result.error) setLoadError(result.error);
    else setOrder(result.data);
  }

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải đơn...</span></Spinner>;
  if (!order) return <Card body className="orders-page"><p className="mb-3">{loadError || "Không tìm thấy đơn hàng trong tài khoản này."}</p><Button as={Link} to="/orders" variant="outline-primary">Quay lại lịch sử đơn</Button></Card>;
  const status = order.cancelReason === "PAYMENT_EXPIRED" ? { label: "Hết hạn thanh toán", variant: "secondary" }
    : orderStatuses[order.status] ?? orderStatuses.processing;
  const currentStage = stages.indexOf(order.status);


  return (
    <div className="orders-page order-payment-required">
      <p className="unpaid-print-notice">Hóa đơn chỉ được in bởi nhân viên cửa hàng.</p>
      <Link to="/orders" className="order-back">← Lịch sử đơn hàng</Link>
      {loadError && <Alert className="mt-3" variant="danger">{loadError}</Alert>}
      <div className="order-detail-header d-flex flex-wrap justify-content-between align-items-start gap-3 mt-3 mb-4">
        <div><div className="order-eyebrow">CHI TIẾT ĐƠN</div><h1 className="h2 mb-1">Đơn #{String(order.id).slice(-8)}</h1>
          <p className="text-secondary mb-0">Đặt lúc {formatOrderDate(order.createdAt)}</p></div><Badge bg={status.variant} className="fs-6">{status.label}</Badge>
      </div>

      {order.paymentStatus === "pending" && <PaymentCountdown expiresAt={order.paymentExpiresAt} />}
      {order.paymentStatus === "expired" && <Alert variant="secondary">Đơn đã hết hạn thanh toán và đã hoàn kho. Nếu bạn đã chuyển tiền, hãy liên hệ cửa hàng để đối soát; không chuyển thêm.</Alert>}
      {order.status === "pending_payment" && <Alert variant="warning">Đơn đang chờ chuyển khoản và đã giữ số lượng trong kho. Giữ nguyên số tiền và nội dung khi chuyển khoản. Nếu không tiếp tục mua, hãy hủy đơn để hoàn lại số lượng.</Alert>}
      {order.paymentStatus === "paid" && <Alert variant="success" role="status">
        <strong>Thanh toán thành công!</strong> Cửa hàng đã nhận thanh toán cho đơn hàng của bạn.
      </Alert>}
      {order.paymentMethod === "sepay" && order.paymentStatus === "pending" && !payment &&
        <Alert variant="info">Đang tải thông tin chuyển khoản. Nếu chưa thấy mã QR, hãy tải lại trang.</Alert>}
      {payment && (!order.paymentExpiresAt || now < new Date(order.paymentExpiresAt).getTime()) && <Card body className="qr-payment-panel text-center mb-4">
        <div className="order-eyebrow mb-2">CHUYỂN KHOẢN NGÂN HÀNG</div>
        <h2 className="h4">Quét mã, thanh toán nhanh</h2>
        <p className="small text-secondary">Mở ứng dụng ngân hàng và quét mã QR bên dưới.</p>
        {failedQrUrl === payment.qrUrl ? <Alert variant="warning">
          <p>Chưa tải được mã QR. Bạn có thể chuyển khoản theo thông tin bên dưới, giữ đúng số tiền và nội dung.</p>
          <Button variant="outline-primary" size="sm" onClick={() => {
            setFailedQrUrl(null);
            setQrAttempt((value) => value + 1);
          }}>Tải lại mã QR</Button>
        </Alert> : <img key={`${payment.qrUrl}-${qrAttempt}`} src={payment.qrUrl}
          onError={() => setFailedQrUrl(payment.qrUrl)}
          alt="QR thanh toán đơn hàng" width="240" height="240" className="qr-payment-image mx-auto" />}
        <p>{payment.bank} · {payment.accountNumber} · {payment.accountName}</p>
        <p>Số tiền: <strong>{formatCurrency(payment.amount)}</strong></p>
        <p className="qr-payment-reference mb-0">Nội dung: <strong>{payment.content}</strong></p>
        <small className="d-block text-secondary mt-3">Trạng thái tự cập nhật sau khi hệ thống nhận được thanh toán.</small>
      </Card>}
      {order.status === "cancelled" ? <Alert variant="secondary">Đơn hàng đã được hủy.</Alert> : <Card body className="tracking-card mb-3">
        <h2 className="h5">Theo dõi đơn hàng</h2><div className="tracking-steps">{stages.map((stage, index) => <div className={`tracking-step ${currentStage >= index && order.status !== "pending_payment" ? "is-complete" : ""}`} key={stage}>
          <span className="tracking-dot">{currentStage >= index && order.status !== "pending_payment" ? "✓" : index + 1}</span>
          <div><strong>{orderStatuses[stage].label}</strong><p>{["Cửa hàng đã nhận đơn.", "Đầu bếp đang chuẩn bị món.", "Đơn hàng đang trên đường giao.", "Đơn hàng đã được giao."][index]}</p></div>
        </div>)}</div>
      </Card>}

      <div className="row g-3 align-items-start">
        <div className="col-lg-7"><Card body className="mb-3"><div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Món đã đặt</h2></div>
          {order.items.map((item) => <div className="detail-line" key={item.id}><img src={item.image} alt="" />
            <div className="flex-grow-1"><strong>{item.name}</strong><small className="d-block text-secondary">{item.quantity} × {formatCurrency(item.price)}</small></div>
            <strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}
          <div className="cart-totals mt-3"><div><span>Tạm tính</span><span>{formatCurrency(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="text-success"><span>Mã {order.promoCode}</span><span>−{formatCurrency(order.discount)}</span></div>}
            <div><span>Phí giao hàng</span><span>{order.deliveryFee ? formatCurrency(order.deliveryFee) : "Miễn phí"}</span></div>
            <div className="cart-total"><strong>Tổng thanh toán</strong><strong>{formatCurrency(order.total)}</strong></div></div>
        </Card>
          <Card body><h2 className="h5">Địa chỉ giao hàng</h2><div className="delivery-summary"><strong>{order.delivery.recipientName}</strong>
            <span>{order.delivery.recipientPhone}</span><span>{formatOrderAddress(order.delivery)}</span></div></Card>
        </div>
        <div className="col-lg-5"><Card body className="mb-3"><h2 className="h5">Thanh toán</h2>
          <div className="payment-summary"><span>Phương thức</span><strong>{order.paymentMethod === "sepay" ? "Chuyển khoản SePay" : "Tiền mặt khi nhận"}</strong>
            <span>Trạng thái</span><Badge bg={order.paymentStatus === "paid" ? "success" : "light"} text={order.paymentStatus === "paid" ? "light" : "dark"}>{{ pending: "Chờ thanh toán", paid: "Đã thanh toán", cancelled: "Đã hủy", expired: "Hết hạn thanh toán", unpaid: "Thanh toán khi nhận hàng" }[order.paymentStatus]}</Badge></div>
        </Card>
          {canCancelOrder(order) && <Button disabled={busy} className="w-100 mt-3" variant="outline-danger" onClick={cancelOrder}>Hủy đơn hàng</Button>}
        </div>
      </div>
    </div>
  );
}
