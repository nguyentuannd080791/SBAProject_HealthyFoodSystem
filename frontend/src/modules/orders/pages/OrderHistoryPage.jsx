import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { orderStore } from "../api/orderStore";
import { OrderPageHeader } from "../components/OrderPageHeader";
import { formatOrderDate, orderStatuses } from "../utils/orderFormatting";
import "../styles/orders.css";

export function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    orderStore.list().then((result) => {
      if (!active) return;
      if (result.error) setError(result.error);
      else setOrders(result.data);
    });
    return () => { active = false; };
  }, [user.id]);

  const visibleOrders = (orders ?? []).filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <div className="orders-page">
      <OrderPageHeader eyebrow="NHỮNG BỮA ĂN CỦA BẠN" title="Đơn hàng của tôi"
        description="Mọi bữa ăn, mọi hành trình giao hàng — ở cùng một nơi.">
        <Button as={Link} to="/menu">+ Đặt món mới</Button>
      </OrderPageHeader>
      {orders && <div className="order-stats">
        <div><span>Tất cả đơn hàng</span><strong>{orders.length}</strong></div>
        <div><span>Đã tiếp nhận</span><strong>{orders.filter((item) => item.status === "processing").length}</strong></div>
        <div><span>Đang giao đến bạn</span><strong>{orders.filter((item) => item.status === "shipping").length}</strong></div>
      </div>}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <span className="text-secondary small">{orders?.length ?? 0} đơn hàng</span>
        <Form.Select aria-label="Lọc đơn hàng" value={filter} onChange={(event) => setFilter(event.target.value)} className="history-filter">
          <option value="all">Tất cả đơn</option><option value="pending_payment">Chờ thanh toán</option>
          <option value="processing">Đã tiếp nhận</option><option value="shipping">Đang giao đến bạn</option>
          {orders?.some((item) => item.status === "delivered") && <option value="delivered">Đã giao (đơn cũ)</option>}
          <option value="cancelled">Đã hủy / hết hạn</option>
        </Form.Select>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!orders && !error && <div className="text-center py-5"><Spinner animation="border" /><span className="visually-hidden">Đang tải đơn hàng...</span></div>}
      {orders?.length === 0 && <Card body className="order-empty text-center"><span>🍱</span><h2 className="h5 mt-3">Bạn chưa có đơn hàng nào</h2>
        <p className="text-secondary">Đơn đã đặt sẽ xuất hiện tại đây.</p><Button as={Link} to="/menu">Xem thực đơn</Button></Card>}
      {orders?.length > 0 && visibleOrders.length === 0 && <Card body className="text-center text-secondary">Không có đơn hàng ở trạng thái này.</Card>}
      {visibleOrders.length > 0 && <div className="d-grid gap-3">{visibleOrders.map((order) => {
        const status = order.cancelReason === "PAYMENT_EXPIRED" ? { label: "Hết hạn thanh toán", variant: "secondary" }
          : orderStatuses[order.status] ?? orderStatuses.processing;
        return <Card className="history-card" key={order.id}><Card.Body>
          <div className="d-flex flex-wrap justify-content-between gap-3"><div>
            <div className="d-flex align-items-center flex-wrap gap-2"><h2 className="h6 mb-0">Đơn #{String(order.id).slice(-8)}</h2><Badge bg={status.variant}>{status.label}</Badge></div>
            <div className="small text-secondary mt-2">{formatOrderDate(order.createdAt)} · {order.totalItems} món</div></div>
            <div className="text-end"><strong>{formatCurrency(order.total)}</strong><div className="small text-secondary">{order.paymentMethod === "sepay" ? "SePay" : "Tiền mặt khi nhận"}</div></div></div>
          <div className="history-products mt-3">{order.items.map((item) => <div className="history-product" key={item.id}>
            <img src={item.image} alt="" loading="lazy" /><div><strong>{item.name}</strong><small>Số lượng: {item.quantity}</small></div>
          </div>)}</div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-top mt-3 pt-3">
            <span className="small text-secondary">📍 {order.delivery.city}, {order.delivery.district}</span>
            <Button as={Link} to={`/orders/${encodeURIComponent(order.id)}`} size="sm" variant="outline-primary">Chi tiết đơn hàng →</Button>
          </div>
        </Card.Body></Card>;
      })}</div>}
    </div>
  );
}
