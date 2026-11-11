import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router";
import {
  ActivityIcon,
  LeafIcon,
  SparklesIcon,
} from "../../../shared/components/Icons";

function StatBox({
  label,
  value,
  unit,
  subtext,
  highlight = false,
  badgeText,
  badgeClass,
}) {
  return (
    <div className={`nutrition-stat-box ${highlight ? "highlight" : ""}`}>
      <div className="nutrition-stat-label">{label}</div>
      <div className="nutrition-stat-value">
        {value}
        {unit && <span className="nutrition-stat-unit">{unit}</span>}
      </div>
      {badgeText && (
        <Badge
          bg={badgeClass === "NORMAL" ? "success" : "warning"}
          className="mt-1"
        >
          {badgeText}
        </Badge>
      )}
      {subtext && <div className="nutrition-stat-subtext">{subtext}</div>}
    </div>
  );
}

function MacroBox({ name, gram, pct, cal }) {
  return (
    <div className="nutrition-macro-item">
      <div className="nutrition-macro-name">{name}</div>
      <div className="nutrition-macro-gram">
        {gram}
        <span className="nutrition-stat-unit">g</span>
      </div>
      <div className="nutrition-macro-meta">
        {pct}% • {cal} kcal
      </div>
    </div>
  );
}

function MealBox({ title, cal, desc }) {
  return (
    <div className="nutrition-meal-card">
      <div className="nutrition-meal-title">{title}</div>
      <div className="nutrition-meal-cal">
        {cal} <span className="unit">kcal</span>
      </div>
      <div className="nutrition-meal-pct">{desc}</div>
    </div>
  );
}

export function NutritionResultsView({
  results,
  onGenerateMealPlan,
  hasSavedPlan = false,
}) {
  return (
    <Card className="nutrition-card">
      <div className="nutrition-card-header">
        <h2 className="nutrition-card-title">
          <SparklesIcon size={20} /> Kết quả phân tích thể trạng
        </h2>
        {results && (
          <Badge bg="success" className="px-2 py-1">
            {results.goalLabel}
          </Badge>
        )}
      </div>

      <div className="nutrition-card-body">
        {!results ? (
          <div className="nutrition-empty-state">
            <div className="nutrition-empty-icon">
              <ActivityIcon size={32} />
            </div>
            <h5>Chưa có dữ liệu thể trạng</h5>
            <p className="text-muted small">
              Vui lòng điền thông số ở biểu mẫu bên cạnh và bấm{" "}
              <strong>&ldquo;Tính toán &amp; Lưu chỉ số&rdquo;</strong> để nhận
              phân tích chi tiết.
            </p>
          </div>
        ) : (
          <>
            <div className="nutrition-stat-grid">
              <StatBox
                highlight
                label="Năng lượng mục tiêu mỗi ngày"
                value={results.targetCaloriesKcal.toLocaleString()}
                unit="kcal/ngày"
                subtext={
                  results.calorieAdjustmentKcal === 0
                    ? "Giữ nguyên mức tiêu hao TDEE để duy trì vóc dáng ổn định"
                    : results.calorieAdjustmentKcal < 0
                      ? `Thâm hụt an toàn ${Math.abs(
                          results.calorieAdjustmentKcal,
                        )} kcal so với mức tiêu hao TDEE`
                      : `Thặng dư lành mạnh +${results.calorieAdjustmentKcal} kcal để tăng cân hiệu quả`
                }
              />

              <StatBox
                label="Chỉ số BMI"
                value={results.bmi}
                badgeText={results.bmiCategoryLabel}
                badgeClass={results.bmiCategory}
              />

              <StatBox
                label="Cân nặng chuẩn lý tưởng"
                value={`${results.minIdealWeightKg} - ${results.maxIdealWeightKg}`}
                unit="kg"
                subtext={`Theo chuẩn vóc dáng chiều cao ${results.heightCm}cm`}
              />

              <StatBox
                label="BMR (Trao đổi chất cơ bản)"
                value={results.bmrKcal.toLocaleString()}
                unit="kcal"
                subtext="Năng lượng tối thiểu duy trì sự sống"
              />

              <StatBox
                label="TDEE (Tổng tiêu hao)"
                value={results.tdeeKcal.toLocaleString()}
                unit="kcal"
                subtext="Dựa trên mức độ vận động hàng ngày"
              />
            </div>

            <div className="nutrition-macro-section">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-dark small text-uppercase">
                  Phân bổ đa lượng chất (Macronutrients)
                </strong>
                <span className="small text-success fw-bold">
                  100% Năng lượng
                </span>
              </div>

              <div className="nutrition-macro-row">
                <MacroBox
                  name="Chất đạm (Protein)"
                  gram={results.macroBreakdown.proteinG}
                  pct={results.macroBreakdown.proteinPercent}
                  cal={results.macroBreakdown.proteinCaloriesKcal}
                />
                <MacroBox
                  name="Tinh bột (Carbs)"
                  gram={results.macroBreakdown.carbohydrateG}
                  pct={results.macroBreakdown.carbohydratePercent}
                  cal={results.macroBreakdown.carbohydrateCaloriesKcal}
                />
                <MacroBox
                  name="Chất béo (Fat)"
                  gram={results.macroBreakdown.fatG}
                  pct={results.macroBreakdown.fatPercent}
                  cal={results.macroBreakdown.fatCaloriesKcal}
                />
              </div>
            </div>

            <div className="nutrition-meals-section">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-dark small text-uppercase">
                  Phân bổ calo các bữa ăn
                </strong>
                <span className="small text-muted">Khuyến nghị trong ngày</span>
              </div>

              <div className="nutrition-meals-row">
                <MealBox
                  title="Bữa sáng (30%)"
                  cal={results.mealBreakdown.breakfastKcal}
                  desc="Cung cấp năng lượng đầu ngày"
                />
                <MealBox
                  title="Bữa trưa (40%)"
                  cal={results.mealBreakdown.lunchKcal}
                  desc="Bữa ăn chính dồi dào dưỡng chất"
                />
                <MealBox
                  title="Bữa tối (30%)"
                  cal={results.mealBreakdown.dinnerKcal}
                  desc="Thanh nhẹ, dễ tiêu hóa"
                />
              </div>
            </div>

            <button
              type="button"
              className="nutrition-menu-cta"
              onClick={onGenerateMealPlan}
            >
              <LeafIcon size={20} />
              <span>Lên thực đơn phù hợp với bộ chỉ số</span>
            </button>

            {hasSavedPlan && (
              <div className="text-center mt-2">
                <Link
                  to="/nutrition/plan"
                  state={{ regenerate: false, results }}
                  className="small text-muted text-decoration-none"
                >
                  Xem thực đơn đã lưu gần nhất →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
