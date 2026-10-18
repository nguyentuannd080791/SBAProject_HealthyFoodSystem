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
  Table,
} from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { adminApi } from "../api/adminApi";
import { CreateAccountForm } from "../components/CreateAccountForm";
import { EditAccountForm } from "../components/EditAccountForm";
import { useUsers } from "../hooks/useUsers";
import {
  getRoleLabel,
  getRoleStyle,
  getStatusStyle,
  ROLES,
} from "../utils/roles";

export function AdminPage() {
  const { user: currentUser } = useAuth();
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const { users, loading, error, reload } = useUsers(filters);

  const [stats, setStats] = useState({
    total: 0,
    byStatus: { active: 0, inactive: 0 },
    byRole: {},
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editError, setEditError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmToggleUser, setConfirmToggleUser] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [notice, setNotice] = useState("");

  function showNotification(msg) {
    setNotice(msg);
    setTimeout(() => {
      setNotice((prev) => (prev === msg ? "" : prev));
    }, 4000);
  }

  const loadStats = useCallback(async () => {
    const res = await adminApi.getStats();
    if (res.data) setStats(res.data);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const internalCount =
    (stats.byRole?.staff || 0) +
    (stats.byRole?.manager || 0) +
    (stats.byRole?.administrator || 0) +
    (stats.byRole?.delivery_partner || 0);

  // Tạo tài khoản nội bộ
  async function handleCreate(values) {
    setIsCreating(true);
    setCreateError("");
    const res = await adminApi.createAccount(values);
    setIsCreating(false);
    if (res.error) {
      setCreateError(res.error);
      return;
    }
    setShowCreateModal(false);
    showNotification(`Đã tạo tài khoản "${values.fullName}" thành công.`);
    reload();
    loadStats();
  }

  // Cập nhật tài khoản
  async function handleUpdate(values) {
    if (!editingUser) return;
    setIsUpdating(true);
    setEditError("");
    const res = await adminApi.updateUser(editingUser.id, values);
    setIsUpdating(false);
    if (res.error) {
      setEditError(res.error);
      return;
    }
    setEditingUser(null);
    showNotification(`Đã cập nhật tài khoản "${values.fullName}" thành công.`);
    reload();
    loadStats();
  }

  // Khóa / Mở khóa tài khoản
  async function handleConfirmToggle() {
    if (!confirmToggleUser) return;
    setIsToggling(true);
    const res = await adminApi.toggleStatus(confirmToggleUser.id);
    setIsToggling(false);
    if (res.error) {
      showNotification(res.error);
      setConfirmToggleUser(null);
      return;
    }
    const actionText =
      confirmToggleUser.status === "active" ? "tạm khóa" : "kích hoạt";
    showNotification(
      `Đã ${actionText} tài khoản "${confirmToggleUser.fullName}".`,
    );
    setConfirmToggleUser(null);
    reload();
    loadStats();
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Quản trị người dùng & Tài khoản</h1>
          <p className="text-muted mb-0">
            Tạo tài khoản nội bộ, quản lý vai trò và trạng thái hoạt động của người dùng
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setCreateError("");
            setShowCreateModal(true);
          }}
        >
          + Tạo tài khoản nội bộ
        </Button>
      </div>

      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {/* Thẻ thống kê */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card body className="text-center shadow-sm h-100">
            <div className="text-muted small">Tổng tài khoản</div>
            <div className="fs-3 fw-bold text-primary mt-1">
              {stats.total ?? 0}
            </div>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card body className="text-center shadow-sm h-100">
            <div className="text-muted small">Đang hoạt động</div>
            <div className="fs-3 fw-bold text-success mt-1">
              {stats.byStatus?.active ?? 0}
            </div>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card body className="text-center shadow-sm h-100">
            <div className="text-muted small">Tạm khóa</div>
            <div className="fs-3 fw-bold text-warning mt-1">
              {stats.byStatus?.inactive ?? 0}
            </div>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card body className="text-center shadow-sm h-100">
            <div className="text-muted small">Tài khoản nội bộ</div>
            <div className="fs-3 fw-bold text-info mt-1">{internalCount}</div>
          </Card>
        </Col>
      </Row>

      {/* Bảng danh sách tài khoản */}
      <Card body className="shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">
            Danh sách người dùng
            <Badge bg="secondary" pill className="ms-2" style={{ fontSize: "0.8rem" }}>
              {users.length}
            </Badge>
          </h2>
        </div>

        {/* Bộ lọc tìm kiếm */}
        <Row className="g-2 mb-3">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filters.role}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <option value="">Tất cả vai trò</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </Form.Select>
          </Col>
          <Col md={1} className="d-flex">
            <Button
              variant="outline-secondary"
              className="w-100"
              title="Xóa bộ lọc"
              onClick={() => setFilters({ search: "", role: "", status: "" })}
              disabled={!filters.search && !filters.role && !filters.status}
            >
              ✕
            </Button>
          </Col>
        </Row>

        {/* Danh sách người dùng */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status" />
            <div className="text-muted mt-2">Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : users.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="fs-1 mb-2">🔍</div>
            <div>Không tìm thấy tài khoản nào khớp với bộ lọc.</div>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Họ và tên / Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th className="text-end pe-3" style={{ minWidth: 150 }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf =
                    currentUser && String(currentUser.id) === String(u.id);
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="fw-semibold">
                          {u.fullName}
                          {isSelf && (
                            <span
                              className="badge bg-secondary-subtle text-secondary ms-2"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="text-muted small">{u.email}</div>
                      </td>
                      <td>{u.phone || <span className="text-muted">—</span>}</td>
                      <td>
                        <span style={getRoleStyle(u.role)}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td>
                        <span style={getStatusStyle(u.status)}>
                          {u.status === "active" ? "● Hoạt động" : "○ Tạm khóa"}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditError("");
                            setEditingUser(u);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant={
                            u.status === "active"
                              ? "outline-danger"
                              : "outline-success"
                          }
                          size="sm"
                          disabled={isSelf}
                          onClick={() => setConfirmToggleUser(u)}
                          title={
                            isSelf
                              ? "Không thể khóa tài khoản của chính bạn"
                              : ""
                          }
                        >
                          {u.status === "active" ? "Khóa" : "Mở"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modal Tạo tài khoản nội bộ */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">
            Tạo tài khoản nội bộ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateAccountForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateModal(false)}
            submitError={createError}
            isSubmitting={isCreating}
          />
        </Modal.Body>
      </Modal>

      {/* Modal Sửa tài khoản */}
      <Modal
        show={Boolean(editingUser)}
        onHide={() => setEditingUser(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">
            Chỉnh sửa tài khoản
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser && (
            <EditAccountForm
              key={editingUser.id}
              user={editingUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
              submitError={editError}
              isSubmitting={isUpdating}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Hộp thoại xác nhận Khóa / Mở khóa */}
      <ConfirmDialog
        show={Boolean(confirmToggleUser)}
        title={
          confirmToggleUser?.status === "active"
            ? "Tạm khóa tài khoản"
            : "Kích hoạt tài khoản"
        }
        message={
          confirmToggleUser?.status === "active"
            ? `Bạn có chắc muốn tạm khóa tài khoản "${confirmToggleUser?.fullName}" (${confirmToggleUser?.email}) không? Tài khoản này sẽ không thể đăng nhập.`
            : `Bạn có muốn kích hoạt lại tài khoản "${confirmToggleUser?.fullName}" (${confirmToggleUser?.email}) không?`
        }
        confirmLabel={
          confirmToggleUser?.status === "active" ? "Khóa tài khoản" : "Kích hoạt"
        }
        isBusy={isToggling}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmToggleUser(null)}
      />
    </div>
  );
}
