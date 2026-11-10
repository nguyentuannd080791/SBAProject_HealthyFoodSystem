import { Alert } from "react-bootstrap";

export function ProductHealthAlert({ screeningResult }) {
  if (!screeningResult) return null;

  if (screeningResult.isSafe) {
    return (
      <Alert
        variant="success"
        className="mb-3 py-2 px-3 border-success-subtle"
      >
        <div className="small">
          <strong className="d-block text-success mb-1">
            Phù hợp với hồ sơ sức khỏe của bạn
          </strong>
          <span className="text-muted">
            Món ăn đáp ứng định mức vi chất và không chứa nguyên liệu dị ứng/cấm.
          </span>
        </div>
      </Alert>
    );
  }

  return (
    <Alert variant="danger" className="mb-3 py-3 border-danger shadow-sm">
      <div className="mb-2">
        <strong className="text-danger h6 mb-0 d-block">
          Cảnh báo lâm sàng & dị ứng
        </strong>
      </div>
      <p className="small mb-2 text-dark">
        Món ăn này có thể không phù hợp với thể trạng hoặc bệnh lý của bạn:
      </p>
      <ul className="mb-0 ps-3 small text-danger fw-medium">
        {(screeningResult.violations || []).map((v, idx) => (
          <li key={idx} className="mb-1">
            {v}
          </li>
        ))}
      </ul>
    </Alert>
  );
}
