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

  const { hasAllergy, hasForbiddenIngredients, exceedsNutrientLimits, warningSummary } = screeningResult;

  if (hasAllergy && (hasForbiddenIngredients || exceedsNutrientLimits)) {
    return (
      <Badge
        bg="danger"
        className="text-white px-2 py-1 small fw-semibold"
        title={warningSummary || "Món ăn vi phạm cả dị ứng và chỉ số bệnh nền"}
      >
        Dị ứng & Bệnh nền
      </Badge>
    );
  }

  if (hasAllergy) {
    return (
      <Badge
        bg="danger-subtle"
        className="text-danger border border-danger-subtle px-2 py-1 small fw-semibold"
        title={warningSummary || "Món ăn chứa nguyên liệu bạn bị dị ứng / kiêng"}
      >
        Dị ứng nguyên liệu
      </Badge>
    );
  }

  return (
    <Badge
      bg="warning-subtle"
      className="text-warning-emphasis border border-warning-subtle px-2 py-1 small fw-semibold"
      title={warningSummary || "Món ăn có chỉ số vi chất vượt ngưỡng bệnh lý nền"}
    >
      Cảnh báo bệnh nền
    </Badge>
  );
}
