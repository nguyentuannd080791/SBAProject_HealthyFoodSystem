import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card } from "react-bootstrap";
import { Link, useParams } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { orderStore } from "../api/orderStore";
import { canCancelOrder, formatOrderAddress, formatOrderDate, orderStatuses } from "../utils/orderFormatting";
import "../styles/orders.css";

const stages = ["processing", "preparing", "shipping", "delivered"];

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const result = orderStore.get(user.id, orderId);
    setOrder(result.data ?? null);
    setLoadError(result.error ?? "");
  }, [user.id, orderId]);

  function cancelOrder() {
    if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) return;
    const result = orderStore.cancel(user.id, order.id);
    if (result.error) setLoadError(result.error);
    else setOrder(result.data);
  }

  if (!order) return <Card body className="orders-page"><p className="mb-3">Không tìm thấy đơn hàng trong tài khoản này.</p><Button as={Link} to="/orders" variant="outline-primary">Quay lại lịch sử đơn</Button></Card>;
  const status = orderStatuses[order.status] ?? orderStatuses.processing;
  const currentStage = stages.indexOf(order.status);

  return (
    <div className="orders-page">
      <Link to="/orders" className="order-back">← Lịch sử đơn hàng</Link>
      {loadError && <Alert className="mt-3" variant="danger">{loadError}</Alert>}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mt-3 mb-4">
        <div><div className="order-eyebrow">CHI TIẾT ĐƠN</div><h1 className="h2 mb-1">Đơn #{String(order.id).slice(-8)}</h1>
          <p className="text-secondary mb-0">Đặt lúc {formatOrderDate(order.createdAt)}</p></div><Badge bg={status.variant} className="fs-6">{status.label}</Badge>
      </div>

      {order.status === "pending_payment" && <Alert variant="warning">Đơn đang chờ thanh toán. SePay hiện ở chế độ thử nghiệm, chưa kết nối giao dịch thật.</Alert>}
      {order.status === "cancelled" ? <Alert variant="secondary">Đơn hàng đã được hủy.</Alert> : <Card body className="tracking-card mb-3">
        <h2 className="h5">Theo dõi đơn hàng</h2><div className="tracking-steps">{stages.map((stage, index) => <div className={`tracking-step ${currentStage >= index && order.status !== "pending_payment" ? "is-complete" : ""}`} key={stage}>
          <span className="tracking-dot">{currentStage >= index && order.status !== "pending_payment" ? "✓" : index + 1}</span>
          <div><strong>{orderStatuses[stage].label}</strong><p>{["Cửa hàng đã nhận đơn.", "Đầu bếp đang chuẩn bị món.", "Đơn hàng đang trên đường giao.", "Đơn hàng đã được giao."][index]}</p></div>
        </div>)}</div>
      </Card>}

      <div className="row g-3 align-items-start">
        <div className="col-lg-7"><Card body className="mb-3"><div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Món đã đặt</h2><Button variant="outline-primary" size="sm" onClick={() => window.print()}>In hóa đơn</Button></div>
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
            <span>Trạng thái</span><Badge bg={order.paymentStatus === "pending" ? "warning" : "light"} text="dark">{order.paymentStatus === "pending" ? "Chờ thanh toán" : "Thanh toán khi nhận hàng"}</Badge></div>
        </Card>
          <Card body><h2 className="h5">Hóa đơn</h2><div className="invoice-mini"><span>Mã hóa đơn</span><strong>HF-{String(order.id).slice(-8)}</strong>
            <span>Thời gian</span><strong>{formatOrderDate(order.createdAt)}</strong><span>Số lượng</span><strong>{order.totalItems} món</strong>
            <span>Tổng cộng</span><strong className="text-success">{formatCurrency(order.total)}</strong></div>
            <Button className="w-100 mt-3" variant="outline-primary" onClick={() => window.print()}>Xem / in hóa đơn</Button></Card>
          {canCancelOrder(order) && <Button className="w-100 mt-3" variant="outline-danger" onClick={cancelOrder}>Hủy đơn hàng</Button>}
        </div>
      </div>
    </div>
  );
}
