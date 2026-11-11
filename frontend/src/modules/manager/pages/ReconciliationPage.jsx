import { useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from "react-bootstrap";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatOrderAddress, formatOrderDate, orderStatuses } from "../../orders/utils/orderFormatting";
import { reconciliationApi } from "../api/reconciliationApi";

const labels = { MATCHED: "Đã khớp tự động", LATE_PAYMENT: "Nhận tiền khi đơn đã hết hạn", UNMATCHED: "Không khớp đơn", AMOUNT_MISMATCH: "Sai số tiền", REQUIRES_REVIEW: "Cần kiểm tra" };
const date = (value) => value ? formatOrderDate(value) : "—";
const emptyFilters = { filter: "ALL", search: "", status: "", fromDate: "", toDate: "" };

function Resolution({ item }) {
  if (item.resolutionStatus === "ACCEPTED_FOR_ORDER") return <Badge bg="success">Đã tiếp tục đơn</Badge>;
  if (item.resolutionStatus && item.resolutionStatus !== "PENDING") return <Badge bg="secondary">{item.resolutionStatus}</Badge>;
  return item.reconciliationStatus === "MATCHED"
    ? <Badge bg="success">Đã xác nhận</Badge> : <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
}

export function ReconciliationPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState(emptyFilters);
  const [draft, setDraft] = useState(emptyFilters);
  const [filterError, setFilterError] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    reconciliationApi.list(page, filters).then((result) => {
      if (!active) return;
      setData(result.data ?? null); setError(result.error ?? ""); setLoading(false);
    });
    return () => { active = false; };
  }, [page, filters, refresh]);

  function applyFilters(event) {
    event.preventDefault();
    if (draft.fromDate && draft.toDate && draft.fromDate > draft.toDate) {
      setFilterError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }
    setFilterError("");
    setFilters({ ...draft, search: draft.search.trim() });
    setPage(0);
  }

  function resetFilters() {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
    setFilterError("");
    setPage(0);
  }

  function changeFilter(name, value) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  useEffect(() => {
    if (selectedId === null) return;
    let active = true;
    setDetailLoading(true);
    setDetail(null);
    setDetailError("");
    setConfirmed(false);
    setNote("");
    reconciliationApi.detail(selectedId).then((result) => {
      if (!active) return;
      setDetail(result.data ?? null);
      setDetailError(result.error ?? "");
      setDetailLoading(false);
    });
    return () => { active = false; };
  }, [selectedId]);

  async function resumeOrder(event) {
    event.preventDefault();
    if (submitting.current || !detail?.resumable || !confirmed || !note.trim()) return;
    submitting.current = true;
    setBusy(true);
    setDetailError("");
    const result = await reconciliationApi.resume(selectedId, { fulfillmentConfirmed: confirmed, note: note.trim() });
    if (result.error) setDetailError(result.error);
    else {
      setDetail(result.data);
      setSuccess(`Đã tiếp tục đơn #${String(result.data.order.id).slice(-8)}. Đơn đã chuyển cho staff chuẩn bị hàng.`);
    }
    setRefresh((value) => value + 1);
    setBusy(false);
    submitting.current = false;
  }

  const receipt = detail?.transaction;
  const order = detail?.order;

  return <div className="manager-orders-page">
    <div className="d-flex flex-wrap justify-content-between gap-3 mb-3"><div><h2 className="h4">Đối soát thanh toán</h2>
      <p className="text-secondary">Lịch sử giao dịch tiền vào đã nhận từ webhook SePay và kết quả xử lý.</p></div>
      <Button variant="outline-primary" disabled={loading || busy} onClick={() => setRefresh((value) => value + 1)}>Làm mới</Button></div>
    <Alert variant="info">Với khoản chuyển đến muộn, hãy kiểm tra giao dịch và liên hệ khách trước khi tiếp tục đơn. Hệ thống sẽ giữ lại hàng theo giá ban đầu. Không yêu cầu khách chuyển tiền lần nữa.</Alert>
    {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
    {error && <Alert variant="danger">{error}</Alert>}
    <Card body className="mb-3"><Form onSubmit={applyFilters}>
      <div className="row g-3">
      <Form.Group className="col-12" controlId="reconciliation-search">
        <Form.Label>Tìm giao dịch</Form.Label>
        <Form.Control type="search" maxLength={200} value={draft.search} disabled={busy}
          onChange={(event) => changeFilter("search", event.target.value)}
          placeholder="ID giao dịch, mã thanh toán, nội dung hoặc tài khoản nhận" />
        <Form.Text>ID giao dịch được tìm chính xác; mã, nội dung và tài khoản có thể nhập một phần.</Form.Text>
      </Form.Group>
    <Form.Group className="col-md-6 col-xl-3" controlId="reconciliation-filter">
      <Form.Label>Hiển thị giao dịch</Form.Label>
      <Form.Select value={draft.filter} disabled={busy} onChange={(event) => changeFilter("filter", event.target.value)}>
        <option value="ALL">Tất cả giao dịch đã ghi nhận</option>
        <option value="PENDING">Cần đối soát</option>
        <option value="ACCEPTED_FOR_ORDER">Đã tiếp tục đơn</option>
      </Form.Select>
    </Form.Group>
    <Form.Group className="col-md-6 col-xl-3" controlId="reconciliation-status">
      <Form.Label>Kết quả ban đầu</Form.Label>
      <Form.Select value={draft.status} disabled={busy} onChange={(event) => changeFilter("status", event.target.value)}>
        <option value="">Tất cả kết quả</option>
        {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </Form.Select>
    </Form.Group>
    <Form.Group className="col-md-6 col-xl-3" controlId="reconciliation-from">
      <Form.Label>Nhận webhook từ ngày</Form.Label>
      <Form.Control type="date" value={draft.fromDate} max={draft.toDate || "9998-12-31"} disabled={busy} onChange={(event) => changeFilter("fromDate", event.target.value)} />
    </Form.Group>
    <Form.Group className="col-md-6 col-xl-3" controlId="reconciliation-to">
      <Form.Label>Đến hết ngày</Form.Label>
      <Form.Control type="date" value={draft.toDate} min={draft.fromDate || undefined} max="9998-12-31" disabled={busy} onChange={(event) => changeFilter("toDate", event.target.value)} />
    </Form.Group>
    </div>
    <p className="small text-secondary mt-2 mb-3">Khoảng ngày tính theo thời gian nhận webhook, múi giờ Việt Nam.</p>
    {filterError && <Alert variant="danger">{filterError}</Alert>}
    <div className="d-flex gap-2"><Button type="submit" disabled={busy || loading}>Tìm kiếm / Lọc</Button>
      <Button variant="outline-secondary" disabled={busy} onClick={resetFilters}>Xóa bộ lọc</Button></div>
    </Form></Card>
    <Card body>{loading ? <Spinner animation="border" role="status" /> : data && <>
      <p>{data.totalElements} giao dịch</p>
      <Table responsive hover className="align-middle"><thead><tr><th>ID / mã</th><th>Số tiền</th><th>Kết quả ban đầu</th><th>Xử lý</th><th>Thời gian ngân hàng / nhận webhook</th><th></th></tr></thead>
        <tbody>{data.content.map((item) => <tr key={item.id}><td>{item.id}<small className="d-block">{item.code || "Không có mã"}</small></td>
          <td className="text-nowrap">{formatCurrency(item.amount)}</td><td>{labels[item.reconciliationStatus] ?? item.reconciliationStatus}</td>
          <td><Resolution item={item} /></td><td>{item.bankTransactionDate || "Không có thời gian ngân hàng"}<small className="d-block text-secondary">Nhận: {date(item.receivedAt)}</small></td>
          <td><Button size="sm" variant="outline-primary" onClick={() => setSelectedId(item.id)}>Chi tiết</Button></td></tr>)}</tbody></Table>
      {!data.content.length && <p className="text-center text-secondary">Chưa có giao dịch trong bộ lọc này.</p>}
      <div className="d-flex gap-3 justify-content-end align-items-center"><Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
        <span>Trang {page + 1}/{Math.max(1, data.totalPages)}</span><Button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Sau</Button></div>
    </>}</Card>

    <Modal show={selectedId !== null} onHide={() => { if (!busy) setSelectedId(null); }} size="lg" backdrop={busy ? "static" : true} keyboard={!busy}>
      <Modal.Header closeButton={!busy}><Modal.Title>Đối soát giao dịch #{selectedId}</Modal.Title></Modal.Header>
      <Form onSubmit={resumeOrder}>
        <Modal.Body>
          {detailError && <Alert variant="danger">{detailError}</Alert>}
          {detailLoading ? <Spinner animation="border" role="status" /> : receipt && <>
            <div className="d-flex flex-wrap justify-content-between gap-2 mb-3"><strong className="fs-4">{formatCurrency(receipt.amount)}</strong><Resolution item={receipt} /></div>
            <dl className="row small">
              <dt className="col-sm-4">Kết quả webhook ban đầu</dt><dd className="col-sm-8">{labels[receipt.reconciliationStatus] ?? receipt.reconciliationStatus}</dd>
              <dt className="col-sm-4">Tài khoản nhận</dt><dd className="col-sm-8">{receipt.accountNumber}</dd>
              <dt className="col-sm-4">Mã chuyển khoản</dt><dd className="col-sm-8">{receipt.code || "—"}</dd>
              <dt className="col-sm-4">Ngân hàng ghi nhận</dt><dd className="col-sm-8">{receipt.bankTransactionDate || "—"}</dd>
              <dt className="col-sm-4">Nhận webhook</dt><dd className="col-sm-8">{date(receipt.receivedAt)}</dd>
              <dt className="col-sm-4">Nội dung</dt><dd className="col-sm-8 text-break">{receipt.content || "—"}</dd>
            </dl>
            {order && <Card body className="mb-3 bg-light">
              <h3 className="h6">Đơn #{String(order.id).slice(-8)} · {order.customerName}</h3>
              <p className="small mb-2">{orderStatuses[order.status]?.label} · Đặt lúc {date(order.createdAt)} · Hạn thanh toán {date(order.paymentExpiresAt)}</p>
              <Table size="sm" responsive><thead><tr><th>Món</th><th>Số lượng</th><th>Giá lúc đặt</th></tr></thead><tbody>
                {order.items.map((item, index) => <tr key={`${item.id}-${index}`}><td>{item.name}{item.note && <small className="d-block">{item.note}</small>}</td><td>{item.quantity}</td><td>{formatCurrency(item.price)}</td></tr>)}
              </tbody></Table>
              <p className="small mb-2">Tạm tính: {formatCurrency(order.subtotal)} · Giảm giá{order.promoCode ? ` (${order.promoCode})` : ""}: {formatCurrency(order.discount)} · Phí giao: {formatCurrency(order.deliveryFee)}</p>
              <strong>Tổng ban đầu: {formatCurrency(order.total)}</strong>
              {order.delivery && <p className="small mt-2 mb-0">{order.delivery.recipientName} · {order.delivery.recipientPhone}<br />{formatOrderAddress(order.delivery)}</p>}
            </Card>}
            {receipt.resolvedAt && <Alert variant="success">Xử lý lúc {date(receipt.resolvedAt)} bởi người dùng #{receipt.resolvedBy}.<p className="mb-0 text-break">{receipt.resolutionNote}</p></Alert>}
            {detail.resumable ? <>
              <Alert variant="warning">Tiếp tục đơn sẽ trừ lại tồn kho và chuyển đơn đã thanh toán sang hàng đợi chuẩn bị của staff. Giữ nguyên giá, phí giao hàng và giảm giá ban đầu.</Alert>
              <Form.Group className="mb-3" controlId="resume-note"><Form.Label>Ghi chú xác nhận với khách</Form.Label>
                <Form.Control as="textarea" rows={3} maxLength={500} required value={note} disabled={busy} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: Đã gọi khách xác nhận vẫn muốn nhận đơn và thời gian giao dự kiến." />
              </Form.Group>
              <Form.Check id="fulfillment-confirmed" required checked={confirmed} disabled={busy} onChange={(event) => setConfirmed(event.target.checked)} label="Đã xác nhận với khách; cửa hàng còn trong giờ phục vụ và có thể chuẩn bị, giao đầy đủ đơn." />
            </> : <Alert variant="secondary" className="mb-0">{detail.blockedReason} {receipt.reconciliationStatus !== "MATCHED" && !receipt.resolutionStatus && "Nếu không thể phục vụ, cần liên hệ khách để xử lý hoàn tiền riêng."}</Alert>}
          </>}
        </Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" disabled={busy} onClick={() => setSelectedId(null)}>Đóng</Button>
          {detail?.resumable && <Button type="submit" disabled={busy || !confirmed || !note.trim()}>{busy ? "Đang xác nhận..." : "Tiếp tục đơn"}</Button>}
        </Modal.Footer>
      </Form>
    </Modal>
  </div>;
}
