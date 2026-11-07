import { Badge, Col, Row } from "react-bootstrap";
import {
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserIcon,
} from "../../../shared/components/Icons";

export function ProfileSummary({ profile }) {
  return (
    <Row className="g-3">
      <Col xs={12} sm={6}>
        <div className="profile-info-tile h-100 d-flex align-items-start gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ backgroundColor: "#dcfce7", color: "var(--hf-primary)" }}
          >
            <UserIcon size={20} />
          </div>
          <div className="min-w-0">
            <span className="small text-muted d-block mb-1">Họ và tên</span>
            <span className="fw-bold text-dark fs-6 text-truncate d-block">
              {profile.fullName || "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6}>
        <div className="profile-info-tile h-100 d-flex align-items-start gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}
          >
            <MailIcon size={20} />
          </div>
          <div className="min-w-0 flex-grow-1">
            <div className="d-flex align-items-center justify-content-between gap-1 mb-1">
              <span className="small text-muted">Địa chỉ email</span>
              <Badge bg="light" className="text-secondary border small fw-normal">
                Đăng nhập
              </Badge>
            </div>
            <span className="fw-semibold text-dark text-truncate d-block">
              {profile.email}
            </span>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6}>
        <div className="profile-info-tile h-100 d-flex align-items-start gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
          >
            <PhoneIcon size={20} />
          </div>
          <div className="min-w-0">
            <span className="small text-muted d-block mb-1">Số điện thoại</span>
            <span className="fw-semibold text-dark fs-6">
              {profile.phone || "Chưa thiết lập"}
            </span>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6}>
        <div className="profile-info-tile h-100 d-flex align-items-start gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}
          >
            <ShieldCheckIcon size={20} />
          </div>
          <div className="min-w-0">
            <span className="small text-muted d-block mb-1">Trạng thái tài khoản</span>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle">
                Hoạt động
              </span>
              <span className="small text-muted">Bảo mật chuẩn</span>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}
