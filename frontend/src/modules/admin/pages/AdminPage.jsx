import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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
import {
  LockIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
  XIcon,
} from "../../../shared/components/Icons";
import { ChangePasswordSection } from "../../auth/components/ChangePasswordSection";
import { adminApi } from "../api/adminApi";
import { CreateAccountForm } from "../components/CreateAccountForm";
import { EditAccountForm } from "../components/EditAccountForm";
import { RolesPermissionsSection } from "../components/RolesPermissionsSection";
import { UserDetailModal } from "../components/UserDetailModal";
import { useUsers } from "../hooks/useUsers";
import {
  getRoleLabel,
  getRoleStyle,
  getStatusStyle,
  ROLES,
} from "../utils/roles";
import "../../manager/components/manager.css";

export function AdminPage() {
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const activeTab = ["users", "roles", "password"].includes(currentTab)
    ? currentTab
    : "users";

  function handleSelectTab(tab) {
    setSearchParams({ tab });
  }

  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const { users, loading, error, reload } = useUsers(filters);

  const [stats, setStats] = useState({
    total: 0,
    byStatus: { active: 0, inactive: 0 },
    byRole: {},
  });

  const [rolesData, setRolesData] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

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

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError("");
    const res = await adminApi.getRoles();
    setRolesLoading(false);
    if (res.error) {
      setRolesError(res.error);
      return;
    }
    setRolesData(res.data || []);
  }, []);

  useEffect(() => {
    loadStats();
    loadRoles();
  }, [loadStats, loadRoles]);

  const internalCount =
    (stats.byRole?.staff || 0) +
    (stats.byRole?.manager || 0) +
    (stats.byRole?.administrator || 0) +
    (stats.byRole?.delivery_partner || 0);

  const roleFilterOptions = rolesData.length > 0 ? rolesData : ROLES;

  async function handleViewDetail(user) {
    setShowDetailModal(true);
    setDetailUser(null);
    setDetailError("");
    setDetailLoading(true);
    const res = await adminApi.getUserById(user.id);
    setDetailLoading(false);
    if (res.error) {
      setDetailError(res.error);
      return;
    }
    setDetailUser(res.data);
  }

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
    <div className="manager-workspace">
      <div className="manager-grid">
        <aside className="manager-sidebar-container">
          <div className="manager-sidebar-card">
            <div className="manager-sidebar-brand-box">
              <div className="manager-sidebar-brand-badge">
                <span className="manager-sidebar-badge-dot"></span>
                <span>Hệ thống Quản trị</span>
              </div>
              <h2 className="manager-sidebar-brand-title">Bảng Điều Khiển</h2>
              <p className="manager-sidebar-brand-subtitle">
                Quản trị người dùng, phân quyền vai trò và bảo mật hệ thống.
              </p>
            </div>

            <nav className="manager-sidebar-nav" aria-label="Điều hướng quản trị">
              <div className="manager-sidebar-group">
                <div className="manager-sidebar-group-title">
                  Quản trị Người dùng
                </div>
                <div className="manager-sidebar-group-items">
                  <button
                    type="button"
                    className={`manager-sidebar-link ${activeTab === "users" ? "is-active" : ""}`}
                    onClick={() => handleSelectTab("users")}
                  >
                    <span className="manager-sidebar-link-icon">
                      <UserIcon size={18} />
                    </span>
                    <span className="manager-sidebar-link-label">
                      Quản lý người dùng
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`manager-sidebar-link ${activeTab === "roles" ? "is-active" : ""}`}
                    onClick={() => handleSelectTab("roles")}
                  >
                    <span className="manager-sidebar-link-icon">
                      <ShieldCheckIcon size={18} />
                    </span>
                    <span className="manager-sidebar-link-label">
                      Vai trò & Quyền hạn
                    </span>
                  </button>
                </div>
              </div>

              <div className="manager-sidebar-group">
                <div className="manager-sidebar-group-title">
                  Bảo mật
                </div>
                <div className="manager-sidebar-group-items">
                  <button
                    type="button"
                    className={`manager-sidebar-link ${activeTab === "password" ? "is-active" : ""}`}
                    onClick={() => handleSelectTab("password")}
                  >
                    <span className="manager-sidebar-link-icon">
                      <LockIcon size={18} />
                    </span>
                    <span className="manager-sidebar-link-label">
                      Đổi mật khẩu
                    </span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        <main className="manager-content-container">
          {activeTab === "password" ? (
            <div style={{ maxWidth: 580 }}>
              <ChangePasswordSection />
            </div>
          ) : activeTab === "roles" ? (
            <RolesPermissionsSection
              roles={rolesData}
              loading={rolesLoading}
              error={rolesError}
              byRoleStats={stats.byRole}
            />
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                  <h1 className="h4 fw-bold mb-1">Quản trị người dùng & Tài khoản</h1>
                  <p className="text-muted small mb-0">
                    Tạo tài khoản nội bộ, quản lý vai trò và trạng thái hoạt động của người dùng
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="rounded-pill px-4 fw-semibold"
                  style={{
                    backgroundColor: "var(--hf-primary)",
                    borderColor: "var(--hf-primary)",
                  }}
                  onClick={() => {
                    setCreateError("");
                    setShowCreateModal(true);
                  }}
                >
                  + Tạo tài khoản nội bộ
                </Button>
              </div>

              {notice && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setNotice("")}
                  className="py-2 small mb-3"
                >
                  {notice}
                </Alert>
              )}

              <Row className="g-3 mb-4">
                <Col sm={6} lg={3}>
                  <Card body className="text-center shadow-sm h-100 rounded-3">
                    <div className="text-muted small">Tổng tài khoản</div>
                    <div className="fs-3 fw-bold text-primary mt-1">
                      {stats.total ?? 0}
                    </div>
                  </Card>
                </Col>
                <Col sm={6} lg={3}>
                  <Card body className="text-center shadow-sm h-100 rounded-3">
                    <div className="text-muted small">Đang hoạt động</div>
                    <div className="fs-3 fw-bold text-success mt-1">
                      {stats.byStatus?.active ?? 0}
                    </div>
                  </Card>
                </Col>
                <Col sm={6} lg={3}>
                  <Card body className="text-center shadow-sm h-100 rounded-3">
                    <div className="text-muted small">Tạm khóa</div>
                    <div className="fs-3 fw-bold text-warning mt-1">
                      {stats.byStatus?.inactive ?? 0}
                    </div>
                  </Card>
                </Col>
                <Col sm={6} lg={3}>
                  <Card body className="text-center shadow-sm h-100 rounded-3">
                    <div className="text-muted small">Tài khoản nội bộ</div>
                    <div className="fs-3 fw-bold text-info mt-1">{internalCount}</div>
                  </Card>
                </Col>
              </Row>

              <Card body className="shadow-sm rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 mb-0">
                    Danh sách người dùng
                    <Badge
                      bg="secondary"
                      pill
                      className="ms-2"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {users.length}
                    </Badge>
                  </h2>
                </div>

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
                      {roleFilterOptions.map((r) => (
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
                      className="w-100 d-flex align-items-center justify-content-center"
                      title="Xóa bộ lọc"
                      aria-label="Xóa bộ lọc"
                      onClick={() => setFilters({ search: "", role: "", status: "" })}
                      disabled={!filters.search && !filters.role && !filters.status}
                    >
                      <XIcon size={16} />
                    </Button>
                  </Col>
                </Row>

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" role="status" />
                    <div className="text-muted mt-2">Đang tải dữ liệu...</div>
                  </div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : users.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <div className="mb-2 text-secondary">
                      <SearchIcon size={44} />
                    </div>
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
                          <th className="text-end pe-3" style={{ minWidth: 210 }}>
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
                                  variant="outline-secondary"
                                  size="sm"
                                  className="me-2 rounded-pill"
                                  onClick={() => handleViewDetail(u)}
                                >
                                  Chi tiết
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2 rounded-pill"
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
                                  className="rounded-pill"
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
            </div>
          )}
        </main>
      </div>

      <UserDetailModal
        show={showDetailModal}
        userDetail={detailUser}
        loading={detailLoading}
        error={detailError}
        rolesData={rolesData}
        onClose={() => setShowDetailModal(false)}
        onEdit={(u) => {
          setEditError("");
          setEditingUser(u);
        }}
      />

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
              isSelf={Boolean(
                currentUser && String(currentUser.id) === String(editingUser.id),
              )}
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
              submitError={editError}
              isSubmitting={isUpdating}
            />
          )}
        </Modal.Body>
      </Modal>

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
