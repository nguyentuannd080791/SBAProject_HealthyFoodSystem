import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { OrderPageHeader } from "../../orders/components/OrderPageHeader";
import {
  formatOrderAddress,
  formatOrderDate,
} from "../../orders/utils/orderFormatting";
import "../../orders/styles/orders.css";
import { deliveryApi } from "../api/deliveryApi";

const HANDOVER_STATUS_META = {
  WAITING_PICKUP: {
    label: "Chờ đến lấy",
    variant: "warning",
    description: "Quán đã đóng gói xong và gửi yêu cầu giao hàng.",
  },
  DRIVER_ARRIVED: {
    label: "Đã báo đến · Chờ quán Confirm",
    variant: "info",
    description: "Đã gửi thông báo đến nhân viên quán, vui lòng chờ Confirm bàn giao.",
  },
  SHIPPING: {
    label: "Đang giao khách",
    variant: "primary",
    description: "Quán đã Confirm bàn giao. Giao đến địa chỉ khách hàng.",
  },
  DELIVERED: {
    label: "Đã giao thành công",
    variant: "success",
    description: "Đơn hàng đã hoàn tất giao cho khách.",
  },
};

const FILTER_TABS = [
  { key: "WAITING_PICKUP", label: "Chờ đến nhận" },
  { key: "DRIVER_ARRIVED", label: "Chờ quán Confirm" },
  { key: "SHIPPING", label: "Đang giao" },
  { key: "DELIVERED", label: "Đã giao" },
  { key: "", label: "Tất cả" },
];

export function DeliveryOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("WAITING_PICKUP");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  const [actionModal, setActionModal] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await deliveryApi.listOrders(statusFilter);
    if (!silent) setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setError("");
    setOrders(res.data || []);
  }, [statusFilter]);

  useEffect(() => {
    let active = true;
    let timer;

    async function poll(silent) {
      if (!active) return;
      await loadOrders(silent);
      if (active) {
        timer = setTimeout(() => poll(true), 5000);
      }
    }

    poll(false);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [loadOrders]);

  function openAction(type, handover) {
    setNoteInput("");
    setActionModal({ type, handover });
  }

  async function submitAction() {
    if (!actionModal) return;
    const { type, handover } = actionModal;
    setBusyId(handover.orderId);
    const res =
      type === "arrive"
        ? await deliveryApi.markArrived(handover.orderId, noteInput)
        : await deliveryApi.markDelivered(handover.orderId, noteInput);
    setBusyId("");
    setActionModal(null);

    if (res.error) {
      setError(res.error);
      return;
    }

    setNotice(
      type === "arrive"
        ? `Đã thông báo đến nhận đơn #${handover.orderId.slice(-8)} (Mã bàn giao: ${handover.handoverCode}). Chờ nhân viên quán Confirm!`
        : `Đã hoàn tất giao đơn #${handover.orderId.slice(-8)}.`,
    );
    await loadOrders(true);
  }

  return (
    <div className="orders-page">
      <OrderPageHeader
        eyebrow="ĐỐI TÁC GIAO HÀNG"
        title="Quản lý nhận & giao đơn hàng"
        description="Nhận đơn từ cửa hàng, gửi thông báo khi đến lấy hàng để nhân viên Confirm bàn giao và hoàn tất giao."
      >
        <Button
          variant="outline-primary"
          disabled={loading}
          onClick={() => loadOrders(false)}
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

      <nav
        aria-label="Lọc trạng thái giao hàng"
        className="d-flex flex-wrap gap-2 mb-4"
      >
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.key || "ALL"}
            variant={statusFilter === tab.key ? "primary" : "outline-secondary"}
            onClick={() => setStatusFilter(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải danh sách đơn giao...</span>
          </Spinner>
        </div>
      ) : orders.length === 0 ? (
        <Card body className="text-center py-5 text-muted">
          Hiện chưa có đơn hàng nào ở trạng thái này.
        </Card>
      ) : (
        <Row className="g-3">
          {orders.map((item) => {
            const meta = HANDOVER_STATUS_META[item.handoverStatus] || {
              label: item.handoverStatus,
              variant: "secondary",
              description: "",
            };
            const isBusy = busyId === item.orderId;

            return (
              <Col md={6} key={item.orderId}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        <div className="fw-bold">
                          Đơn #{item.orderId.slice(-8)}
                        </div>
                        <div className="small text-muted">
                          Mã bàn giao:{" "}
                          <Badge bg="dark" className="font-monospace">
                            {item.handoverCode}
                          </Badge>
                        </div>
                      </div>
                      <Badge bg={meta.variant}>{meta.label}</Badge>
                    </div>

                    <p className="small text-secondary mb-3">
                      {meta.description}
                    </p>

                    <div className="border rounded p-2 bg-light mb-3 small">
                      <div>
                        <strong>Khách nhận:</strong>{" "}
                        {item.delivery?.recipientName || item.customerName} ·{" "}
                        {item.delivery?.recipientPhone || "—"}
                      </div>
                      <div>
                        <strong>Địa chỉ:</strong>{" "}
                        {item.delivery
                          ? formatOrderAddress(item.delivery)
                          : "—"}
                      </div>
                      <div>
                        <strong>Giá trị đơn:</strong>{" "}
                        {formatCurrency(item.total ?? 0)} ({item.totalItems} món)
                      </div>
                      {item.note && (
                        <div className="text-primary mt-1">
                          <strong>Ghi chú từ quán:</strong> {item.note}
                        </div>
                      )}
                    </div>

                    {item.items && item.items.length > 0 && (
                      <div className="small mb-3">
                        <div className="fw-semibold mb-1">Chi tiết món:</div>
                        <ul className="mb-0 ps-3">
                          {item.items.map((dish, idx) => (
                            <li key={idx}>
                              {dish.quantity} × {dish.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="small text-muted">
                        {item.dispatchedAt
                          ? `Gửi yêu cầu lúc ${formatOrderDate(item.dispatchedAt)}`
                          : ""}
                      </span>

                      {item.handoverStatus === "WAITING_PICKUP" && (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isBusy}
                          onClick={() => openAction("arrive", item)}
                        >
                          {isBusy ? "Đang gửi..." : "Đã đến / Nhận đơn"}
                        </Button>
                      )}

                      {item.handoverStatus === "DRIVER_ARRIVED" && (
                        <Badge bg="info" text="dark">
                          Đang chờ quán Confirm...
                        </Badge>
                      )}

                      {item.handoverStatus === "SHIPPING" && (
                        <Button
                          size="sm"
                          variant="success"
                          disabled={isBusy}
                          onClick={() => openAction("deliver", item)}
                        >
                          {isBusy ? "Đang cập nhật..." : "Hoàn tất giao"}
                        </Button>
                      )}

                      {item.handoverStatus === "DELIVERED" && item.deliveredAt && (
                        <span className="small text-success fw-semibold">
                          Hoàn tất: {formatOrderDate(item.deliveredAt)}
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        show={Boolean(actionModal)}
        onHide={() => !busyId && setActionModal(null)}
        centered
      >
        <Modal.Header closeButton={!busyId}>
          <Modal.Title as="h2" className="h5">
            {actionModal?.type === "arrive"
              ? "Xác nhận đã đến cửa hàng nhận đơn"
              : "Hoàn tất giao đơn hàng cho khách"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionModal && (
            <>
              <p className="mb-2">
                Đơn <strong>#{actionModal.handover.orderId.slice(-8)}</strong> ·
                Mã bàn giao:{" "}
                <Badge bg="dark" className="font-monospace">
                  {actionModal.handover.handoverCode}
                </Badge>
              </p>
              <Form.Group>
                <Form.Label>
                  {actionModal.type === "arrive"
                    ? "Ghi chú cho nhân viên quán (không bắt buộc)"
                    : "Ghi chú giao hàng (không bắt buộc)"}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  maxLength={255}
                  placeholder={
                    actionModal.type === "arrive"
                      ? "VD: Đang đứng ở quầy nhận hàng..."
                      : "VD: Đã giao tận tay khách..."
                  }
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            disabled={Boolean(busyId)}
            onClick={() => setActionModal(null)}
          >
            Hủy
          </Button>
          <Button
            variant={actionModal?.type === "arrive" ? "primary" : "success"}
            disabled={Boolean(busyId)}
            onClick={submitAction}
          >
            {busyId
              ? "Đang xử lý..."
              : actionModal?.type === "arrive"
                ? "Gửi thông báo đã đến"
                : "Hoàn tất giao"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
