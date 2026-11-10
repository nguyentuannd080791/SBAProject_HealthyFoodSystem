import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Alert, Badge, Button, Card, Modal, Spinner, Table } from "react-bootstrap";
import { staffOrderApi } from "../api/staffOrderApi";
import { orderStatuses, formatOrderAddress, formatOrderDate } from "../../orders/utils/orderFormatting";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { OrderPageHeader } from "../../orders/components/OrderPageHeader";
import "../../orders/styles/orders.css";

const steps = {
  processing: { next: "shipping", action: "Xác nhận đang giao hàng" },
};
const statusLabel = (status) => status === "shipping"
  ? "Đơn hàng đang được giao đến cho khách" : orderStatuses[status]?.label;

export function StaffOrdersPage() {
  const [status, setStatus] = useState("processing");
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let timer;
    setLoading(true);
    setData(null);
    async function load() {
      const result = await staffOrderApi.list(status, page);
      if (!active) return;
      setError(result.error ?? "");
      if (!result.error) setData(result.data);
      setLoading(false);
      timer = setTimeout(load, 15000);
    }
    load();
    return () => { active = false; clearTimeout(timer); };
  }, [status, page, refresh]);

  async function view(id) {
    setBusy(true);
    const result = await staffOrderApi.get(id);
    setBusy(false);
    if (result.error) setError(result.error);
    else { setError(""); setOrder(result.data); }
  }

  async function advance() {
    const step = steps[order?.status];
    if (!step || busy) return;
    if (!window.confirm(`${step.action} cho đơn #${order.id.slice(-8)}?`)) return;
    setBusy(true);
    const result = await staffOrderApi.update(order.id, order.status, step.next);
    setBusy(false);
    setRefresh((value) => value + 1);
    if (result.error) {
      setOrder(null);
      setError(result.error);
    } else {
      setOrder(null);
      setError("");
      setNotice(`Đơn #${result.data.id.slice(-8)}: ${statusLabel(result.data.status)}.`);
    }
  }

  return <div className="orders-page">
    <OrderPageHeader eyebrow="KHU VỰC NHÂN VIÊN" title="Xử lý đơn hàng"
      description="Tiếp nhận đơn đã thanh toán và cập nhật khi đơn bắt đầu được giao cho khách.">
      <Button variant="outline-primary" disabled={loading || busy} onClick={() => setRefresh((value) => value + 1)}>Làm mới</Button>
    </OrderPageHeader>
    {error && <Alert variant="danger">{error}</Alert>}
    {notice && <Alert variant="success" dismissible onClose={() => setNotice("")}>{notice}</Alert>}
    <nav aria-label="Lọc trạng thái đơn" className="d-flex flex-wrap gap-2 mb-4">
      {["processing", "shipping"].map((key) => <Button key={key}
        variant={status === key ? "primary" : "outline-secondary"} onClick={() => { setStatus(key); setPage(0); }}>
        {statusLabel(key)}
      </Button>)}
    </nav>
    <Card body>
      {loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Đang tải đơn...</span></Spinner>
        : <><p className="small text-secondary">{data?.totalElements ?? 0} đơn · Chỉ hiển thị đơn đã thanh toán</p>
          {!data?.content.length ? <p className="text-center py-4">Chưa có đơn hàng ở bước này.</p> : <Table responsive className="align-middle">
            <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Thao tác</th></tr></thead>
            <tbody>{data.content.map((item) => <tr key={item.orderId}>
              <td>#{item.orderId.slice(-8)}</td><td>{item.customerName}</td><td>{formatOrderDate(item.createdAt)}</td>
              <td>{formatCurrency(item.total)}</td><td><Button size="sm" disabled={busy} onClick={() => view(item.orderId)}>Xem & xử lý</Button></td>
            </tr>)}</tbody>
          </Table>}
          {data?.totalPages > 1 && <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
            <span>Trang {page + 1}/{data.totalPages}</span>
            <Button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Sau</Button>
          </div>}
        </>}
    </Card>
    <Modal show={!!order} onHide={() => { if (!busy) setOrder(null); }} size="lg" centered backdrop={busy ? "static" : true} keyboard={!busy}>
      <Modal.Header closeButton={!busy}><Modal.Title>Đơn #{order?.id.slice(-8)}</Modal.Title></Modal.Header>
      <Modal.Body>{order && <>
        <Badge bg={orderStatuses[order.status]?.variant}>{statusLabel(order.status)}</Badge>
        <Badge bg="success" className="ms-2">Đã thanh toán</Badge>
        <h3 className="h6 mt-4">Món cần chuẩn bị</h3>
        {order.items.map((item, index) => <div key={index} className="border-bottom py-2">
          <strong>{item.quantity} × {item.name}</strong>{item.note && <p className="small mb-0 text-secondary">Ghi chú: {item.note}</p>}
        </div>)}
        <h3 className="h6 mt-4">Thông tin giao hàng</h3>
        <p>{order.delivery.recipientName} · {order.delivery.recipientPhone}<br />{formatOrderAddress(order.delivery)}</p>
        <small className="text-secondary">Chỉ cập nhật đang giao khi đơn thực sự bắt đầu được giao cho khách. Đây là bước cuối trong luồng hiện tại.</small>
      </>}</Modal.Body>
      <Modal.Footer><Button disabled={busy} variant="outline-secondary" onClick={() => setOrder(null)}>Đóng</Button>
        {order && <Button as={Link} to={`/staff/orders/${encodeURIComponent(order.id)}/invoice`} variant="outline-primary" disabled={busy}>Xem / in hóa đơn</Button>}
        {steps[order?.status] && <Button disabled={busy} onClick={advance}>{busy ? "Đang cập nhật..." : steps[order.status].action}</Button>}
      </Modal.Footer>
    </Modal>
  </div>;
}
