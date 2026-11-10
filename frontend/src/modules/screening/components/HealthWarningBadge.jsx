import { Badge } from "react-bootstrap";

export function HealthWarningBadge({ screeningResult }) {
  if (!screeningResult) return null;

  if (screeningResult.isSafe) {
    return (
      <Badge
        bg="success-subtle"
        className="text-success border border-success-subtle px-2 py-1 small fw-normal"
        title="Món ăn phù hợp với hồ sơ lâm sàng của bạn"
      >
        Phù hợp sức khỏe
      </Badge>
    );
  }

  return (
    <Badge
      bg="danger-subtle"
      className="text-danger border border-danger-subtle px-2 py-1 small fw-semibold"
      title={screeningResult.warningSummary || "Có cảnh báo lâm sàng"}
    >
      Cảnh báo sức khỏe
    </Badge>
  );
}
