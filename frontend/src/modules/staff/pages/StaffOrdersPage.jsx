import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { staffOrderApi } from "../api/staffOrderApi";
import {
  orderStatuses,
  formatOrderAddress,
  formatOrderDate,
} from "../../orders/utils/orderFormatting";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { OrderPageHeader } from "../../orders/components/OrderPageHeader";
import "../../orders/styles/orders.css";

const steps = {
  processing: { next: "shipping", action: "Xác nhận đang giao hàng" },
};
const statusLabel = (status) =>
  status === "shipping"
    ? "Đơn hàng đang được giao đến cho khách"
    : orderStatuses[status]?.label;

const handoverStatusMeta = {
  WAITING_PICKUP: { label: "Chờ tài xế đến nhận", variant: "warning" },
  DRIVER_ARRIVED: { label: "Tài xế đã đến · Chờ Confirm", variant: "info" },
  SHIPPING: { label: "Đã bàn giao · Đang giao", variant: "primary" },
  DELIVERED: { label: "Đối tác đã giao xong", variant: "success" },
};

export function StaffOrdersPage() {
  const [status, setStatus] = useState("processing");
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [handoverMap, setHandoverMap] = useState({});
  const [arrivedAlerts, setArrivedAlerts] = useState([]);
  const [partners, setPartners] = useState([]);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmAdvance, setConfirmAdvance] = useState(false);

  const [dispatchPartnerId, setDispatchPartnerId] = useState("");
  const [dispatchNote, setDispatchNote] = useState("");

  const loadArrivedAlerts = useCallback(async () => {
    const res = await staffOrderApi.getArrivedHandovers();
    if (!res.error && res.data) {
      setArrivedAlerts(res.data);
    }
  }, []);

  useEffect(() => {
    staffOrderApi.getDeliveryPartners().then((res) => {
      if (!res.error && res.data) setPartners(res.data);
    });
  }, []);

  useEffect(() => {
    let active = true;
    let timer;
    setLoading(true);
    setData(null);
    async function load() {
      const [ordersRes, arrivedRes] = await Promise.all([
        staffOrderApi.list(status, page),
        staffOrderApi.getArrivedHandovers(),
      ]);
      if (!active) return;
      if (!arrivedRes.error && arrivedRes.data) {
        setArrivedAlerts(arrivedRes.data);
      }
      setError(ordersRes.error ?? "");
      if (!ordersRes.error) {
        setData(ordersRes.data);
        const ids = (ordersRes.data?.content || []).map((item) => item.orderId);
        if (ids.length > 0) {
          const handoversRes = await staffOrderApi.getHandoversByOrders(ids);
          if (active && !handoversRes.error && handoversRes.data) {
            const nextMap = {};
            for (const h of handoversRes.data) {
              nextMap[h.orderId] = h;
            }
            setHandoverMap(nextMap);
          }
        } else {
          setHandoverMap({});
        }
      }
      setLoading(false);
      timer = setTimeout(load, 8000);
    }
    load();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [status, page, refresh]);

  async function view(id) {
    setBusy(true);
    const [result, handoverRes] = await Promise.all([
      staffOrderApi.get(id),
      staffOrderApi.getHandoversByOrders([id]),
    ]);
    setBusy(false);
    if (result.error) setError(result.error);
    else {
      setError("");
      setDispatchPartnerId("");
      setDispatchNote("");
      if (!handoverRes.error && handoverRes.data?.[0]) {
        setHandoverMap((prev) => ({ ...prev, [id]: handoverRes.data[0] }));
      }
      setOrder(result.data);
    }
  }

  async function handleConfirmAdvance() {
    const step = steps[order?.status];
    if (!step || busy) return;
    setBusy(true);
    const result = await staffOrderApi.update(order.id, order.status, step.next);
    setBusy(false);
    setConfirmAdvance(false);
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

  async function handleDispatch() {
    if (!order || busy) return;
    setBusy(true);
    const payload = {
      deliveryPartnerId: dispatchPartnerId ? Number(dispatchPartnerId) : null,
      note: dispatchNote.trim() || null,
    };
    const res = await staffOrderApi.dispatchHandover(order.id, payload);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setOrder(null);
    setError("");
    setNotice(
      `Đã gửi yêu cầu giao hàng cho đơn #${order.id.slice(-8)} (Mã bàn giao: ${res.data.handoverCode}).`,
    );
    setRefresh((value) => value + 1);
  }

  async function handleConfirmHandover(orderId) {
    if (busy) return;
    setBusy(true);
    const res = await staffOrderApi.confirmHandover(orderId);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setOrder(null);
    setError("");
    setNotice(
      `Đã Confirm bàn giao đơn #${orderId.slice(-8)} cho ${res.data.deliveryPartnerName || "đối tác giao hàng"}. Đơn đã chuyển sang Đang giao.`,
    );
    await loadArrivedAlerts();
    setRefresh((value) => value + 1);
  }

  async function handleRejectHandover(orderId) {
    if (busy) return;
    if (!window.confirm(`Từ chối nhận và đưa đơn #${orderId.slice(-8)} quay lại hàng chờ giao hàng?`)) {
      return;
    }
    setBusy(true);
    const res = await staffOrderApi.rejectHandover(orderId, "");
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setOrder(null);
    setError("");
    setNotice(`Đã đưa đơn #${orderId.slice(-8)} quay lại trạng thái chờ đối tác giao hàng đến nhận.`);
    await loadArrivedAlerts();
    setRefresh((value) => value + 1);
  }

  const currentHandover = order
    ? handoverMap[order.id] || arrivedAlerts.find((a) => a.orderId === order.id)
    : null;

  return (
    <div className="orders-page">
      <OrderPageHeader
        eyebrow="KHU VỰC NHÂN VIÊN"
        title="Xử lý đơn hàng"
        description="Tiếp nhận đơn đã thanh toán, gửi yêu cầu cho đối tác giao hàng và Confirm bàn giao khi tài xế đến nhận."
      >
        <Button
          variant="outline-primary"
          disabled={loading || busy}
          onClick={() => setRefresh((value) => value + 1)}
        >
          Làm mới
        </Button>
      </OrderPageHeader>

      {error && <Alert variant="danger">{error}</Alert>}
      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {arrivedAlerts.length > 0 && (
        <Alert variant="info" className="shadow-sm border-info">
          <div className="fw-bold mb-2">
            Thông báo nhận đơn từ bên giao hàng ({arrivedAlerts.length} đơn đang chờ Confirm)
          </div>
          <div className="d-flex flex-column gap-2">
            {arrivedAlerts.map((item) => (
              <div
                key={item.orderId}
                className="d-flex flex-wrap justify-content-between align-items-center gap-2 bg-white rounded p-2 border"
              >
                <div className="small">
                  <strong>Đơn #{item.orderId.slice(-8)}</strong> · Đối tác:{" "}
                  <strong>{item.deliveryPartnerName || "Tài xế"}</strong>
                  {item.deliveryPartnerPhone ? ` (${item.deliveryPartnerPhone})` : ""} · Mã bàn giao:{" "}
                  <Badge bg="dark" className="font-monospace">
                    {item.handoverCode}
                  </Badge>
                  {item.deliveryNote && (
                    <span className="text-muted ms-2">“{item.deliveryNote}”</span>
                  )}
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={busy}
                    onClick={() => view(item.orderId)}
                  >
                    Xem đơn
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={busy}
                    onClick={() => handleRejectHandover(item.orderId)}
                  >
                    Từ chối
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    disabled={busy}
                    onClick={() => handleConfirmHandover(item.orderId)}
                  >
                    Confirm bàn giao
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Alert>
      )}

      <nav aria-label="Lọc trạng thái đơn" className="d-flex flex-wrap gap-2 mb-4">
        {["processing", "shipping"].map((key) => (
          <Button
            key={key}
            variant={status === key ? "primary" : "outline-secondary"}
            onClick={() => {
              setStatus(key);
              setPage(0);
            }}
          >
            {statusLabel(key)}
          </Button>
        ))}
      </nav>

      <Card body>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải đơn...</span>
          </Spinner>
        ) : (
          <>
            <p className="small text-secondary">
              {data?.totalElements ?? 0} đơn · Chỉ hiển thị đơn đã thanh toán
            </p>
            {!data?.content.length ? (
              <p className="text-center py-4">Chưa có đơn hàng ở bước này.</p>
            ) : (
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Giao nhận</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((item) => {
                    const handover = handoverMap[item.orderId];
                    const handoverMeta = handover
                      ? handoverStatusMeta[handover.handoverStatus]
                      : null;
                    return (
                      <tr key={item.orderId}>
                        <td>#{item.orderId.slice(-8)}</td>
                        <td>{item.customerName}</td>
                        <td>{formatOrderDate(item.createdAt)}</td>
                        <td>{formatCurrency(item.total)}</td>
                        <td>
                          {handoverMeta ? (
                            <div>
                              <Badge bg={handoverMeta.variant}>
                                {handoverMeta.label}
                              </Badge>
                              <div className="small text-muted">
                                Mã: {handover.handoverCode}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            disabled={busy}
                            onClick={() => view(item.orderId)}
                          >
                            Xem & xử lý
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            {data?.totalPages > 1 && (
              <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Trước
                </Button>
                <span>
                  Trang {page + 1}/{data.totalPages}
                </span>
                <Button
                  disabled={page + 1 >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal
        show={!!order}
        onHide={() => {
          if (!busy) setOrder(null);
        }}
        size="lg"
        centered
        backdrop={busy ? "static" : true}
        keyboard={!busy}
      >
        <Modal.Header closeButton={!busy}>
          <Modal.Title>Đơn #{order?.id.slice(-8)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {order && (
            <>
              <Badge bg={orderStatuses[order.status]?.variant}>
                {statusLabel(order.status)}
              </Badge>
              <Badge bg="success" className="ms-2">
                Đã thanh toán
              </Badge>

              <h3 className="h6 mt-4">Món cần chuẩn bị</h3>
              {order.items.map((item, index) => (
                <div key={index} className="border-bottom py-2">
                  <strong>
                    {item.quantity} × {item.name}
                  </strong>
                  {item.note && (
                    <p className="small mb-0 text-secondary">
                      Ghi chú: {item.note}
                    </p>
                  )}
                </div>
              ))}

              <h3 className="h6 mt-4">Thông tin giao hàng</h3>
              <p>
                {order.delivery.recipientName} · {order.delivery.recipientPhone}
                <br />
                {formatOrderAddress(order.delivery)}
              </p>

              {order.status === "processing" && !currentHandover && (
                <Card body className="bg-light border mt-3">
                  <h4 className="h6 mb-2">Gửi yêu cầu giao hàng</h4>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">
                      Chọn đối tác giao hàng (tùy chọn)
                    </Form.Label>
                    <Form.Select
                      size="sm"
                      value={dispatchPartnerId}
                      onChange={(e) => setDispatchPartnerId(e.target.value)}
                    >
                      <option value="">
                        Tất cả đối tác giao hàng đang hoạt động
                      </option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fullName} {p.phone ? `(${p.phone})` : ""}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">
                      Ghi chú bàn giao cho bên giao hàng
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      placeholder="VD: Lấy hàng tại quầy số 2..."
                      value={dispatchNote}
                      onChange={(e) => setDispatchNote(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={busy}
                    onClick={handleDispatch}
                  >
                    {busy ? "Đang gửi..." : "Gửi yêu cầu giao hàng"}
                  </Button>
                </Card>
              )}

              {currentHandover && (
                <Alert
                  variant={
                    currentHandover.handoverStatus === "DRIVER_ARRIVED"
                      ? "info"
                      : "secondary"
                  }
                  className="mt-3 mb-2"
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong>Trạng thái bàn giao giao hàng</strong>
                    <Badge
                      bg={
                        handoverStatusMeta[currentHandover.handoverStatus]
                          ?.variant || "secondary"
                      }
                    >
                      {handoverStatusMeta[currentHandover.handoverStatus]
                        ?.label || currentHandover.handoverStatus}
                    </Badge>
                  </div>
                  <div className="small">
                    Mã bàn giao:{" "}
                    <Badge bg="dark" className="font-monospace">
                      {currentHandover.handoverCode}
                    </Badge>
                    {currentHandover.deliveryPartnerName && (
                      <span className="ms-2">
                        · Đối tác:{" "}
                        <strong>{currentHandover.deliveryPartnerName}</strong>
                        {currentHandover.deliveryPartnerPhone
                          ? ` (${currentHandover.deliveryPartnerPhone})`
                          : ""}
                      </span>
                    )}
                  </div>
                  {currentHandover.deliveryNote && (
                    <div className="small mt-1">
                      Lời nhắn tài xế: {currentHandover.deliveryNote}
                    </div>
                  )}
                </Alert>
              )}

              <small className="text-secondary d-block mt-2">
                Chỉ Confirm bàn giao khi đối tác giao hàng đã đến nhận đơn.
              </small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={busy}
            variant="outline-secondary"
            onClick={() => setOrder(null)}
          >
            Đóng
          </Button>
          {order && (
            <Button
              as={Link}
              to={`/staff/orders/${encodeURIComponent(order.id)}/invoice`}
              variant="outline-primary"
              disabled={busy}
            >
              Xem / in hóa đơn
            </Button>
          )}
          {currentHandover?.handoverStatus === "DRIVER_ARRIVED" && (
            <>
              <Button
                variant="outline-danger"
                disabled={busy}
                onClick={() => handleRejectHandover(order.id)}
              >
                Từ chối / Trả hàng chờ
              </Button>
              <Button
                variant="success"
                disabled={busy}
                onClick={() => handleConfirmHandover(order.id)}
              >
                {busy ? "Đang xác nhận..." : "Confirm bàn giao"}
              </Button>
            </>
          )}
          {steps[order?.status] && !currentHandover && (
            <Button
              variant="outline-primary"
              disabled={busy}
              onClick={() => setConfirmAdvance(true)}
            >
              {busy ? "Đang cập nhật..." : steps[order.status].action}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <ConfirmDialog
        show={confirmAdvance}
        title="Xác nhận giao hàng"
        message={
          order
            ? `${steps[order.status]?.action} cho đơn #${order.id.slice(-8)}?`
            : ""
        }
        confirmLabel="Xác nhận"
        isBusy={busy}
        onConfirm={handleConfirmAdvance}
        onCancel={() => setConfirmAdvance(false)}
      />
    </div>
  );
}
