import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { orderStore } from "../api/orderStore";
import { formatOrderDate, orderStatuses } from "../utils/orderFormatting";
import "../styles/orders.css";

export function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const result = orderStore.list(user.id);
    if (result.error) setError(result.error);
    else setOrders(result.data);
  }, [user.id]);

  const visibleOrders = (orders ?? []).filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") return !["delivered", "cancelled"].includes(order.status);
    return order.status === filter;
  });

  return (
    <div className="orders-page">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div><div className="order-eyebrow">TÀI KHOẢN CỦA BẠN</div><h1 className="h2 mb-1">Lịch sử đơn hàng</h1>
          <p className="text-secondary mb-0">Xem lại các món đã đặt và trạng thái đơn.</p></div>
        <Button as={Link} to="/menu">Đặt món mới</Button>
      </div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <span className="text-secondary small">{orders?.length ?? 0} đơn hàng</span>
        <Form.Select aria-label="Lọc đơn hàng" value={filter} onChange={(event) => setFilter(event.target.value)} className="history-filter">
          <option value="all">Tất cả đơn</option><option value="active">Đang xử lý</option>
          <option value="delivered">Đã giao</option><option value="cancelled">Đã hủy</option>
        </Form.Select>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!orders && !error && <div className="text-center py-5"><Spinner animation="border" /><span className="visually-hidden">Đang tải đơn hàng...</span></div>}
      {orders?.length === 0 && <Card body className="order-empty text-center"><span>🍱</span><h2 className="h5 mt-3">Bạn chưa có đơn hàng nào</h2>
        <p className="text-secondary">Đơn đã đặt sẽ xuất hiện tại đây.</p><Button as={Link} to="/menu">Xem thực đơn</Button></Card>}
      {orders?.length > 0 && visibleOrders.length === 0 && <Card body className="text-center text-secondary">Không có đơn hàng ở trạng thái này.</Card>}
      {visibleOrders.length > 0 && <div className="d-grid gap-3">{visibleOrders.map((order) => {
        const status = orderStatuses[order.status] ?? orderStatuses.processing;
        return <Card className="history-card" key={order.id}><Card.Body>
          <div className="d-flex flex-wrap justify-content-between gap-3"><div>
            <div className="d-flex align-items-center flex-wrap gap-2"><h2 className="h6 mb-0">Đơn #{String(order.id).slice(-8)}</h2><Badge bg={status.variant}>{status.label}</Badge></div>
            <div className="small text-secondary mt-2">{formatOrderDate(order.createdAt)} · {order.totalItems} món</div></div>
            <div className="text-end"><strong>{formatCurrency(order.total)}</strong><div className="small text-secondary">{order.paymentMethod === "sepay" ? "SePay" : "Tiền mặt khi nhận"}</div></div></div>
          <div className="history-products mt-3">{order.items.map((item) => <span key={item.id}>{item.name} × {item.quantity}</span>)}</div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-top mt-3 pt-3">
            <span className="small text-secondary">📍 {order.delivery.city}, {order.delivery.district}</span>
            <Button as={Link} to={`/orders/${encodeURIComponent(order.id)}`} size="sm" variant="outline-primary">Chi tiết đơn hàng →</Button>
          </div>
        </Card.Body></Card>;
      })}</div>}
    </div>
  );
}
