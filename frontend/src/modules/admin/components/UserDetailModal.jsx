import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import {
  formatOrderDate,
  orderStatuses,
} from "../../orders/utils/orderFormatting";
import {
  getPermissionLabel,
  getRoleLabel,
  getRoleStyle,
  getStatusStyle,
} from "../utils/roles";

const DELIVERY_STATUS_BADGE = {
  WAITING_PICKUP: { label: "Chờ đến nhận", variant: "warning" },
  DRIVER_ARRIVED: { label: "Chờ quán Confirm", variant: "info" },
  SHIPPING: { label: "Đang giao", variant: "primary" },
  DELIVERED: { label: "Đã giao", variant: "success" },
};

export function UserDetailModal({
  show,
  userDetail,
  loading,
  error,
  rolesData = [],
  onClose,
  onEdit,
}) {
  const roleInfo = rolesData.find((r) => r.value === userDetail?.role);
  const stats = userDetail?.orderStats;
  const deliveryStats = userDetail?.deliveryStats;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5">
          Chi tiết tài khoản
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <div className="text-muted mt-2">Đang tải thông tin tài khoản...</div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : !userDetail ? null : (
          <>
            <Card body className="bg-light border-0 mb-3">
              <Row className="g-3">
                <Col sm={6}>
                  <div className="text-muted small">Họ và tên</div>
                  <div className="fw-semibold">
                    {userDetail.fullName}{" "}
                    <span className="text-muted fw-normal small">
                      (#{userDetail.id})
                    </span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold">{userDetail.email}</div>
                </Col>
                <Col sm={4}>
                  <div className="text-muted small">Số điện thoại</div>
                  <div>{userDetail.phone || "—"}</div>
                </Col>
                <Col sm={4}>
                  <div className="text-muted small">Vai trò</div>
                  <div className="mt-1">
                    <span style={getRoleStyle(userDetail.role)}>
                      {getRoleLabel(userDetail.role)}
                    </span>
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="text-muted small">Trạng thái</div>
                  <div className="mt-1">
                    <span style={getStatusStyle(userDetail.status)}>
                      {userDetail.status === "active"
                        ? "● Hoạt động"
                        : "○ Tạm khóa"}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>

            {userDetail.role === "customer" && stats ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h6 mb-0">Thống kê đơn hàng của khách hàng</h3>
                  {stats.lastOrderAt && (
                    <span className="text-muted small">
                      Đơn gần nhất: {formatOrderDate(stats.lastOrderAt)}
                    </span>
                  )}
                </div>

                <Row className="g-2 mb-3">
                  <Col xs={6} md={3}>
                    <Card body className="text-center h-100 py-2">
                      <div className="text-muted small">Tổng đơn hàng</div>
                      <div className="fs-5 fw-bold text-primary">
                        {stats.totalOrders ?? 0}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={6} md={3}>
                    <Card body className="text-center h-100 py-2">
                      <div className="text-muted small">Đã giao</div>
                      <div className="fs-5 fw-bold text-success">
                        {stats.completedOrders ?? 0}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={6} md={3}>
                    <Card body className="text-center h-100 py-2">
                      <div className="text-muted small">Đang xử lý</div>
                      <div className="fs-5 fw-bold text-info">
                        {stats.activeOrders ?? 0}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={6} md={3}>
                    <Card body className="text-center h-100 py-2">
                      <div className="text-muted small">Đã hủy</div>
                      <div className="fs-5 fw-bold text-secondary">
                        {stats.cancelledOrders ?? 0}
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card body className="mb-3 py-2 border-success-subtle bg-success-subtle bg-opacity-10">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      Tổng chi tiêu đã thanh toán
                    </span>
                    <span className="fs-5 fw-bold text-success">
                      {formatCurrency(stats.totalSpent ?? 0)}
                    </span>
                  </div>
                </Card>

                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  <div>
                    <div className="text-muted small fw-semibold mb-2">
                      Đơn hàng gần đây (tối đa 5 đơn)
                    </div>
                    <div className="table-responsive">
                      <Table size="sm" hover className="align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th className="text-center">Số món</th>
                            <th className="text-end">Tổng tiền</th>
                            <th className="text-end">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentOrders.map((order) => {
                            const statusMeta = orderStatuses[order.status] || {
                              label: order.status,
                              variant: "secondary",
                            };
                            return (
                              <tr key={order.id}>
                                <td className="font-monospace small">
                                  {order.id.slice(0, 8)}...
                                </td>
                                <td className="small">
                                  {order.createdAt
                                    ? formatOrderDate(order.createdAt)
                                    : "—"}
                                </td>
                                <td className="text-center">
                                  {order.totalItems}
                                </td>
                                <td className="text-end fw-semibold">
                                  {formatCurrency(order.total ?? 0)}
                                </td>
                                <td className="text-end">
                                  <Badge bg={statusMeta.variant}>
                                    {statusMeta.label}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted py-3 border rounded small">
                    Khách hàng này chưa có đơn hàng nào.
                  </div>
                )}
              </div>
            ) : (
              <>
                {userDetail.role === "delivery_partner" && deliveryStats && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h3 className="h6 mb-0">
                        Thống kê giao nhận của đối tác
                      </h3>
                      {deliveryStats.lastDeliveryAt && (
                        <span className="text-muted small">
                          Gần nhất:{" "}
                          {formatOrderDate(deliveryStats.lastDeliveryAt)}
                        </span>
                      )}
                    </div>

                    <Row className="g-2 mb-3">
                      <Col xs={6} md={3}>
                        <Card body className="text-center h-100 py-2">
                          <div className="text-muted small">Tổng đơn nhận</div>
                          <div className="fs-5 fw-bold text-primary">
                            {deliveryStats.totalDeliveries ?? 0}
                          </div>
                        </Card>
                      </Col>
                      <Col xs={6} md={3}>
                        <Card body className="text-center h-100 py-2">
                          <div className="text-muted small">Chờ Confirm</div>
                          <div className="fs-5 fw-bold text-info">
                            {deliveryStats.waitingConfirm ?? 0}
                          </div>
                        </Card>
                      </Col>
                      <Col xs={6} md={3}>
                        <Card body className="text-center h-100 py-2">
                          <div className="text-muted small">Đang giao</div>
                          <div className="fs-5 fw-bold text-warning">
                            {deliveryStats.inTransit ?? 0}
                          </div>
                        </Card>
                      </Col>
                      <Col xs={6} md={3}>
                        <Card body className="text-center h-100 py-2">
                          <div className="text-muted small">Đã giao xong</div>
                          <div className="fs-5 fw-bold text-success">
                            {deliveryStats.completedDeliveries ?? 0}
                          </div>
                        </Card>
                      </Col>
                    </Row>

                    {deliveryStats.recentDeliveries &&
                    deliveryStats.recentDeliveries.length > 0 ? (
                      <div className="table-responsive">
                        <Table size="sm" hover className="align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Mã đơn</th>
                              <th>Mã bàn giao</th>
                              <th>Thời gian nhận</th>
                              <th className="text-end">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliveryStats.recentDeliveries.map((d) => {
                              const meta = DELIVERY_STATUS_BADGE[
                                d.handoverStatus
                              ] || {
                                label: d.handoverStatus,
                                variant: "secondary",
                              };
                              return (
                                <tr key={d.orderId}>
                                  <td className="font-monospace small">
                                    #{d.orderId.slice(-8)}
                                  </td>
                                  <td>
                                    <Badge bg="dark" className="font-monospace">
                                      {d.handoverCode}
                                    </Badge>
                                  </td>
                                  <td className="small">
                                    {d.deliveredAt
                                      ? formatOrderDate(d.deliveredAt)
                                      : d.arrivedAt
                                        ? formatOrderDate(d.arrivedAt)
                                        : "—"}
                                  </td>
                                  <td className="text-end">
                                    <Badge bg={meta.variant}>
                                      {meta.label}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3 border rounded small">
                        Đối tác này chưa nhận giao đơn hàng nào.
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="h6 mb-2">Quyền hạn theo vai trò</h3>
                  {roleInfo?.permissions?.length ? (
                    <div className="d-flex flex-wrap gap-2">
                      {roleInfo.permissions.map((perm) => (
                        <Badge
                          key={perm}
                          bg="light"
                          text="dark"
                          className="border fw-normal px-2 py-1"
                          title={perm}
                        >
                          {getPermissionLabel(perm)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted small">
                      Tài khoản nội bộ thuộc nhóm{" "}
                      {getRoleLabel(userDetail.role)}.
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Đóng
        </Button>
        {userDetail && !loading && (
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(userDetail);
            }}
          >
            Chỉnh sửa tài khoản
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
