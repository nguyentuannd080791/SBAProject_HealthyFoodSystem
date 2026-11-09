import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatOrderAddress, formatOrderDate, orderStatuses } from "../../orders/utils/orderFormatting";
import { managerOrderApi } from "../api/managerOrderApi";

export function ManagerOrderDetailPage() {
  const { orderId } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let active = true;
    setLoading(true);
    setDetails(null);
    managerOrderApi.get(orderId).then((result) => {
      if (!active) return;
      setDetails(result.data ?? null);
      setError(result.error ?? "");
      setLoading(false);
    });
    return () => { active = false; };
  }, [orderId]);


  const order = details?.order;
  return <div className="manager-orders-page">
    <div className="manager-order-actions d-flex flex-wrap justify-content-between gap-2 mb-3">
      <Button as={Link} to="/manager/orders" variant="outline-secondary">← Danh sách đơn hàng</Button>

    </div>
    {error && <Alert variant="danger">{error}</Alert>}
    {loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải đơn hàng...</span></Spinner>
      : order && <Card body className="manager-order-sheet p-4 p-md-5 manager-unpaid-order">
        <p className="manager-unpaid-print-notice">Hóa đơn chỉ được in bởi nhân viên cửa hàng.</p>
        <div className="d-flex flex-wrap justify-content-between gap-3 border-bottom pb-3 mb-4">
          <div><div className="text-success fw-bold mb-2">HEALTHY FOOD</div><h2 className="h3">Chi tiết đơn hàng</h2>
            <div className="manager-order-code text-secondary">Đơn #{order.id}</div>
            <Badge bg={orderStatuses[order.status]?.variant ?? "secondary"}>{orderStatuses[order.status]?.label ?? order.status}</Badge></div>
          <div><Badge bg={order.paymentStatus === "paid" ? "success" : "secondary"} className="mb-2">
            {{pending: "Chờ chuyển khoản", unpaid: "Chưa thu tiền mặt", paid: "Đã thanh toán", cancelled: "Đã hủy"}[order.paymentStatus] ?? order.paymentStatus}
          </Badge>
            <div className="small">Ngày thanh toán: {details.paidAt ? formatOrderDate(details.paidAt) : "Chưa ghi nhận"}</div>
            <div className="small">Phương thức: {order.paymentMethod === "sepay" ? "Chuyển khoản SePay" : "Tiền mặt"}</div>
            <div className="small">Mã thanh toán: {order.paymentCode}</div></div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-6"><h3 className="h6">Khách hàng</h3><p className="mb-1 fw-semibold">{order.customerName}</p>
            <p className="mb-0">Ngày đặt: {formatOrderDate(order.createdAt)}</p></div>
          <div className="col-md-6"><h3 className="h6">Thông tin nhận hàng</h3>
            {order.delivery && <><p className="mb-1">{order.delivery.recipientName} · {order.delivery.recipientPhone}</p>
              <p className="mb-0">{formatOrderAddress(order.delivery)}</p></>}</div>
        </div>
        <Table responsive className="align-middle manager-order-lines">
          <thead><tr><th>Món ăn</th><th className="text-end">Đơn giá</th><th className="text-end">Số lượng</th><th className="text-end">Thành tiền</th></tr></thead>
          <tbody>{order.items.map((item, index) => <tr key={`${item.id}-${index}`}>
            <td><strong>{item.name}</strong>{item.note && <small className="d-block text-secondary">{item.note}</small>}</td>
            <td className="text-end text-nowrap">{formatCurrency(item.price)}</td><td className="text-end">{item.quantity}</td>
            <td className="text-end text-nowrap">{formatCurrency(item.price * item.quantity)}</td>
          </tr>)}</tbody>
        </Table>
        <dl className="manager-order-totals ms-auto mt-3">
          <dt>Tạm tính</dt><dd>{formatCurrency(order.subtotal)}</dd>
          <dt>Giảm giá {order.promoCode && `(${order.promoCode})`}</dt><dd>−{formatCurrency(order.discount)}</dd>
          <dt>Phí giao hàng</dt><dd>{formatCurrency(order.deliveryFee)}</dd>
          <dt className="border-top pt-3 text-success">Tổng thanh toán</dt>
          <dd className="border-top pt-3 text-success fw-bold">{formatCurrency(order.total)}</dd>
        </dl>
        <p className="small text-secondary border-top pt-3 mt-4 mb-0">Cảm ơn bạn đã đặt hàng tại Healthy Food.</p>
      </Card>}
  </div>;
}
