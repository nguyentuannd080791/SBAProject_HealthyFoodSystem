import { Alert } from "react-bootstrap";
import { Link } from "react-router";

export function ProductHealthAlert({ screeningResult }) {
  if (!screeningResult) return null;

  const isSafe = Boolean(screeningResult.safe ?? screeningResult.isSafe);
  if (isSafe) {
    return (
      <Alert variant="success" className="mb-3 py-2 px-3 border-success-subtle">
        <div className="small">
          <strong className="d-block text-success mb-1">
            Phù hợp với hồ sơ sức khỏe của bạn
          </strong>
          <span className="text-muted">
            Món ăn đáp ứng định mức vi chất và không chứa nguyên liệu dị ứng/cấm
            theo hồ sơ của bạn.
          </span>
        </div>
      </Alert>
    );
  }

  const allergyViolations = (screeningResult.violations || []).filter((v) =>
    v.startsWith("Dị ứng:"),
  );
  const conditionViolations = (screeningResult.violations || []).filter(
    (v) => !v.startsWith("Dị ứng:"),
  );

  if (allergyViolations.length === 0 && conditionViolations.length === 0) {
    return null;
  }

  return (
    <Alert
      variant={allergyViolations.length > 0 ? "danger" : "warning"}
      className="mb-3 py-3 border shadow-sm"
    >
      <div className="mb-2">
        <strong
          className={`h6 mb-1 d-block ${
            allergyViolations.length > 0
              ? "text-danger"
              : "text-warning-emphasis"
          }`}
        >
          {allergyViolations.length > 0 && conditionViolations.length > 0
            ? "Cảnh báo dị ứng & Bệnh lý nền"
            : allergyViolations.length > 0
              ? "Cảnh báo dị ứng nguyên liệu"
              : "Cảnh báo định mức bệnh lý nền"}
        </strong>
        <p className="small text-muted mb-0" style={{ fontSize: "0.82rem" }}>
          Hệ thống tự động đối chiếu theo <strong>Hồ sơ bệnh lý nền</strong>{" "}
          đang lưu trong tài khoản của bạn.{" "}
          <Link
            to="/profile"
            className="text-decoration-underline text-success fw-medium"
          >
            Quản lý hoặc gỡ bỏ bệnh nền
          </Link>
        </p>
      </div>

      {allergyViolations.length > 0 && (
        <div className="mb-2">
          <span className="fw-semibold small text-danger d-block mb-1">
            Nguyên liệu dị ứng phát hiện:
          </span>
          <ul className="mb-2 ps-3 small text-danger fw-medium">
            {allergyViolations.map((v, idx) => (
              <li key={`alg-${idx}`}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      {conditionViolations.length > 0 && (
        <div>
          <span className="fw-semibold small text-dark d-block mb-1">
            Định mức vi chất / Thành phần theo bệnh nền:
          </span>
          <ul className="mb-0 ps-3 small text-muted">
            {conditionViolations.map((v, idx) => (
              <li key={`cnd-${idx}`}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </Alert>
  );
}
