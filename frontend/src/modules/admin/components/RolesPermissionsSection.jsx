import { Alert, Badge, Card, Spinner, Table } from "react-bootstrap";
import { getPermissionLabel, getRoleStyle } from "../utils/roles";

export function RolesPermissionsSection({
  roles,
  loading,
  error,
  byRoleStats = {},
}) {
  return (
    <Card body className="shadow-sm">
      <div className="mb-3">
        <h2 className="h5 mb-1">Vai trò & Quyền hạn hệ thống</h2>
        <p className="text-muted small mb-0">
          Danh sách các vai trò, phân loại nội bộ/khách hàng và tập quyền hạn tương ứng trong hệ thống
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <div className="text-muted mt-2">Đang tải danh sách vai trò...</div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : roles.length === 0 ? (
        <div className="text-center py-5 text-muted">
          Không có dữ liệu vai trò.
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: 160 }}>Vai trò</th>
                <th style={{ minWidth: 130 }}>Loại tài khoản</th>
                <th className="text-center" style={{ minWidth: 110 }}>
                  Số tài khoản
                </th>
                <th>Quyền hạn (Permissions)</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.value}>
                  <td>
                    <span style={getRoleStyle(role.value)}>{role.label}</span>
                    <div className="text-muted small mt-1">{role.value}</div>
                  </td>
                  <td>
                    <Badge bg={role.internal ? "info" : "secondary"}>
                      {role.internal ? "Nội bộ" : "Khách hàng"}
                    </Badge>
                  </td>
                  <td className="text-center fw-semibold">
                    {byRoleStats?.[role.value] ?? 0}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {(role.permissions || []).map((perm) => (
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Card>
  );
}
