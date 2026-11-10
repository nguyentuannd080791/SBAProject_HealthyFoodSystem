import { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router";
import { staffOrderApi } from "../api/staffOrderApi";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatOrderAddress, formatOrderDate } from "../../orders/utils/orderFormatting";
import "../styles/invoice.css";

export function StaffInvoicePage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const activeOrder = useRef(null);
  useEffect(() => {
    let active = true;
    activeOrder.current = orderId;
    setLoading(true);
    setOrder(null);
    staffOrderApi.invoice(orderId).then((result) => {
      if (!active) return;
      setOrder(result.data ?? null);
      setError(result.error ?? "");
      setLoading(false);
    });
    return () => { active = false; activeOrder.current = null; };
  }, [orderId]);
  async function print() {
    if (busy || order?.paymentStatus !== "paid") return;
    setBusy(true);
    const result = await staffOrderApi.invoice(orderId);
    if (activeOrder.current !== orderId) return;
    setBusy(false);
    if (result.error || result.data?.paymentStatus !== "paid") {
      setOrder(null); setError(result.error || "Đơn chưa thanh toán."); return;
    }
    window.print();
  }
  return <div className="staff-invoice-page">
    <div className="staff-invoice-actions d-flex justify-content-between gap-3 mb-4">
      <Button as={Link} to="/staff" variant="outline-secondary" disabled={busy}>← Quay lại xử lý đơn</Button>
      {order?.paymentStatus === "paid" && <Button disabled={busy || loading} onClick={print}>{busy ? "Đang kiểm tra..." : "In / lưu PDF"}</Button>}
    </div>
    {error && <Alert variant="danger">{error}</Alert>}
    {loading ? <Spinner animation="border" role="status" /> : order?.paymentStatus === "paid" && <Card body className="staff-invoice-sheet p-4 p-md-5">
      <header className="border-bottom pb-3 mb-4"><strong className="text-success">HEALTHY FOOD</strong>
        <h1 className="h3 mt-3">Hóa đơn thanh toán</h1><p className="small mb-0">Mã đơn: {order.id}</p></header>
      <p>Khách hàng: <strong>{order.customerName}</strong><br />Ngày đặt: {formatOrderDate(order.createdAt)}</p>
      {order.delivery && <p>Người nhận: {order.delivery.recipientName} · {order.delivery.recipientPhone}<br />{formatOrderAddress(order.delivery)}</p>}
      <Table responsive><thead><tr><th>Món ăn</th><th className="text-end">Đơn giá</th><th className="text-end">SL</th><th className="text-end">Thành tiền</th></tr></thead>
        <tbody>{order.items.map((item, i) => <tr key={i}><td>{item.name}</td><td className="text-end">{formatCurrency(item.price)}</td>
          <td className="text-end">{item.quantity}</td><td className="text-end">{formatCurrency(item.quantity * item.price)}</td></tr>)}</tbody></Table>
      <dl className="staff-invoice-totals"><dt>Tạm tính</dt><dd>{formatCurrency(order.subtotal)}</dd>
        <dt>Giảm giá</dt><dd>−{formatCurrency(order.discount)}</dd><dt>Phí giao hàng</dt><dd>{formatCurrency(order.deliveryFee)}</dd>
        <dt>Tổng thanh toán</dt><dd><strong>{formatCurrency(order.total)}</strong></dd></dl>
      <p className="small text-secondary border-top pt-3">Phương thức: Chuyển khoản · Mã thanh toán: {order.paymentCode}</p>
      <p className="text-center mt-4 mb-0">Cảm ơn bạn đã chọn Healthy Food!</p>
    </Card>}
  </div>;
}
