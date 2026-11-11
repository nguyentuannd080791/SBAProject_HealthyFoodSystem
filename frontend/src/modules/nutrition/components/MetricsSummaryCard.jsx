import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router";
import {
  ActivityIcon,
  FlameIcon,
  HeartPulseIcon,
  PencilIcon,
} from "../../../shared/components/Icons";

const ACTIVITY_LABELS = {
  SEDENTARY: "Ít vận động",
  LIGHTLY_ACTIVE: "Vận động nhẹ",
  MODERATELY_ACTIVE: "Vận động vừa",
  VERY_ACTIVE: "Vận động nhiều",
  EXTRA_ACTIVE: "Vận động rất nhiều",
};

const GOAL_LABELS = {
  LOSE_WEIGHT: "Giảm cân",
  MAINTAIN: "Duy trì vóc dáng",
  GAIN_WEIGHT: "Tăng cân",
};

function getBmiBadge(cat) {
  if (cat === "NORMAL") return "success";
  if (cat === "OBESE") return "danger";
  return "warning";
}

export function MetricsSummaryCard({ results }) {
  if (!results) {
    return (
      <Card className="nutrition-summary-card shadow-sm border-0">
        <Card.Body className="p-4 text-center">
          <HeartPulseIcon size={40} className="text-muted mb-3" />
          <h6 className="fw-bold text-dark">Chưa có chỉ số cơ thể</h6>
          <p className="text-muted small mb-3">
            Khai báo thông tin thể trạng để xây dựng bộ thực đơn phù hợp nhất.
          </p>
          <Link to="/nutrition" className="btn btn-outline-success btn-sm">
            Khai báo chỉ số ngay
          </Link>
        </Card.Body>
      </Card>
    );
  }

  const genderLabel =
    results.genderLabel ||
    (results.gender === "MALE"
      ? "Nam"
      : results.gender === "FEMALE"
        ? "Nữ"
        : results.gender || "--");

  const activityLabel =
    results.activityLevelLabel ||
    ACTIVITY_LABELS[results.activityLevel] ||
    results.activityLevel ||
    "--";

  const goalLabel =
    results.goalLabel ||
    GOAL_LABELS[results.goal] ||
    results.goal ||
    "--";

  const bmiBadgeVariant = getBmiBadge(results.bmiCategory);

  const idealWeightText =
    results.minIdealWeightKg != null && results.maxIdealWeightKg != null
      ? `${results.minIdealWeightKg} - ${results.maxIdealWeightKg} kg`
      : "--";

  const heightText = results.heightCm != null ? `${results.heightCm}cm` : "--";
  const weightText = results.weightKg != null ? `${results.weightKg}kg` : "--";
  const ageText = results.age != null ? `${results.age} tuổi` : "--";

  const macros = results.macroBreakdown;
  const meals = results.mealBreakdown;

  return (
    <Card className="nutrition-summary-card shadow-sm border-0">
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="nutrition-summary-icon">
              <HeartPulseIcon size={18} />
            </span>
            <h6 className="fw-bold mb-0 text-dark">Hồ sơ thể trạng</h6>
          </div>
          <Link
            to="/nutrition"
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 py-1 px-2"
          >
            <PencilIcon size={13} />
            <span className="small">Cập nhật</span>
          </Link>
        </div>

        <div className="nutrition-summary-stats-grid mb-3">
          <div className="nutrition-summary-stat-cell">
            <span className="label">Giới tính / Tuổi</span>
            <span className="value">
              {genderLabel}, {ageText}
            </span>
          </div>
          <div className="nutrition-summary-stat-cell">
            <span className="label">Chiều cao / Cân nặng</span>
            <span className="value">
              {heightText} / {weightText}
            </span>
          </div>
          <div className="nutrition-summary-stat-cell">
            <span className="label">Vận động</span>
            <span className="value">{activityLabel}</span>
          </div>
          <div className="nutrition-summary-stat-cell">
            <span className="label">Cân nặng lý tưởng</span>
            <span className="value text-success">{idealWeightText}</span>
          </div>
        </div>

        <div className="nutrition-summary-bmi-box mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Chỉ số khối cơ thể (BMI)</span>
            <Badge bg={bmiBadgeVariant} className="px-2 py-1">
              {results.bmiCategoryLabel || results.bmiCategory || "--"}
            </Badge>
          </div>
          <div className="fs-4 fw-bold text-dark">{results.bmi ?? "--"}</div>
        </div>

        <div className="nutrition-summary-target-box mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted d-flex align-items-center gap-1">
              <FlameIcon size={14} className="text-warning" /> Nhu cầu Calo mục
              tiêu
            </span>
            <Badge bg="success" className="px-2 py-1">
              {goalLabel}
            </Badge>
          </div>
          <div className="d-flex align-items-baseline gap-2">
            <span className="fs-3 fw-bold text-success">
              {results.targetCaloriesKcal != null
                ? results.targetCaloriesKcal.toLocaleString()
                : "--"}
            </span>
            <span className="text-muted small">kcal / ngày</span>
          </div>
          <div className="small text-muted mt-1 d-flex justify-content-between">
            <span>
              BMR:{" "}
              {results.bmrKcal != null
                ? results.bmrKcal.toLocaleString()
                : "--"}{" "}
              kcal
            </span>
            <span>
              TDEE:{" "}
              {results.tdeeKcal != null
                ? results.tdeeKcal.toLocaleString()
                : "--"}{" "}
              kcal
            </span>
          </div>
        </div>

        {macros && (
          <div className="nutrition-summary-macros mb-3">
            <div className="small fw-bold text-dark mb-2 d-flex align-items-center gap-1">
              <ActivityIcon size={14} className="text-success" />
              Đa lượng chất mục tiêu
            </div>
            <div className="row g-2 text-center">
              <div className="col-4">
                <div className="macro-cell">
                  <span className="label text-success">Đạm</span>
                  <span className="val">{macros.proteinG ?? 0}g</span>
                  <span className="pct text-muted">
                    {macros.proteinPercent ?? macros.proteinPct ?? 0}%
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div className="macro-cell">
                  <span className="label text-primary">Tinh bột</span>
                  <span className="val">
                    {macros.carbohydrateG ?? macros.carbsG ?? 0}g
                  </span>
                  <span className="pct text-muted">
                    {macros.carbohydratePercent ?? macros.carbsPct ?? 0}%
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div className="macro-cell">
                  <span className="label text-warning">Chất béo</span>
                  <span className="val">{macros.fatG ?? 0}g</span>
                  <span className="pct text-muted">
                    {macros.fatPercent ?? macros.fatPct ?? 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {meals && (
          <div className="nutrition-summary-meals">
            <div className="small fw-bold text-dark mb-2">
              Phân bổ 3 bữa chính
            </div>
            <div className="d-flex flex-column gap-1 small">
              <div className="d-flex justify-content-between text-muted">
                <span>Bữa sáng ({meals.breakfastPercent ?? 30}%):</span>
                <strong className="text-dark">
                  {meals.breakfastKcal != null
                    ? meals.breakfastKcal.toLocaleString()
                    : 0}{" "}
                  kcal
                </strong>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Bữa trưa ({meals.lunchPercent ?? 40}%):</span>
                <strong className="text-dark">
                  {meals.lunchKcal != null
                    ? meals.lunchKcal.toLocaleString()
                    : 0}{" "}
                  kcal
                </strong>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Bữa tối ({meals.dinnerPercent ?? 30}%):</span>
                <strong className="text-dark">
                  {meals.dinnerKcal != null
                    ? meals.dinnerKcal.toLocaleString()
                    : 0}{" "}
                  kcal
                </strong>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
