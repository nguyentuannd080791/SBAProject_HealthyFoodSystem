import { useEffect, useState } from "react";
import { Alert, Badge, Button, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import {
  CheckIcon,
  FlameIcon,
  LeafIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "../../../shared/components/Icons";
import { nutritionApi } from "../api/nutritionApi";

export function MealPlanModal({ show, onHide, results }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    if (show && results && !mealPlan && !loading) {
      loadMealPlan();
    }
  }, [show, results]);

  async function loadMealPlan() {
    setLoading(true);
    setError("");
    const res = await nutritionApi.generateMealPlan();
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setMealPlan(res.data);
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
          <SparklesIcon size={20} className="text-success" />
          Thực đơn dinh dưỡng cá nhân hoá (Beam Search)
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" className="mb-3" />
            <h6 className="fw-bold text-dark">
              Đang tối ưu thực đơn 3 bữa cho bạn...
            </h6>
            <p className="text-muted small mb-0">
              Sàng lọc bệnh nền, dị ứng và chạy thuật toán Beam Search để phân bổ
              chuẩn calo &amp; đa lượng chất.
            </p>
          </div>
        )}

        {error && !loading && (
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        )}

        {mealPlan && !loading && (
          <div>
            <div className="meal-plan-overview-box mb-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="success" className="px-2 py-1">
                    {mealPlan.goalLabel}
                  </Badge>
                  <span className="small text-muted">
                    Thuật toán:{" "}
                    <strong className="text-dark">
                      {mealPlan.algorithmUsed}
                    </strong>
                  </span>
                </div>
                <div className="text-success fw-bold small d-flex align-items-center gap-1">
                  <CheckIcon size={14} /> Độ khớp calo:{" "}
                  {mealPlan.accuracyPercentage}%
                </div>
              </div>

              <div className="row g-2 text-center">
                <div className="col-4">
                  <div className="small text-muted">Tổng Calo</div>
                  <div className="fw-bold text-dark fs-5">
                    {mealPlan.actualCaloriesKcal}{" "}
                    <span className="fs-6 text-muted fw-normal">
                      / {mealPlan.targetCaloriesKcal} kcal
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="small text-muted">Đạm (Protein)</div>
                  <div className="fw-bold text-success fs-5">
                    {mealPlan.actualProteinG}g
                  </div>
                </div>
                <div className="col-4">
                  <div className="small text-muted">Tinh bột / Béo</div>
                  <div className="fw-bold text-dark fs-5">
                    {mealPlan.actualCarbG}g / {mealPlan.actualFatG}g
                  </div>
                </div>
              </div>

              {mealPlan.screenedConditionsCount > 0 && (
                <div className="mt-2 pt-2 border-top small text-success d-flex align-items-center gap-1">
                  <ShieldCheckIcon size={14} />
                  <span>
                    Đã kiểm duyệt an toàn bệnh nền: bảo đảm 0 vi phạm chất cấm/dị
                    ứng.
                  </span>
                </div>
              )}
            </div>

            <div className="meal-plan-slots-list d-flex flex-column gap-3 mb-3">
              {mealPlan.meals?.map((m) => {
                const dish = m.dish;
                return (
                  <div key={m.mealType} className="meal-plan-slot-card">
                    <div className="meal-plan-slot-header d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark">
                        {m.mealName} ({m.targetCaloriesKcal} kcal mục tiêu)
                      </span>
                      <span className="small text-muted">
                        Thực tế:{" "}
                        <strong className="text-success">
                          {m.actualCaloriesKcal} kcal
                        </strong>
                      </span>
                    </div>

                    <div className="meal-plan-dish-row d-flex gap-3 align-items-center mt-2">
                      {dish.imageUrl ? (
                        <img
                          src={dish.imageUrl}
                          alt={dish.productName}
                          className="meal-plan-dish-img rounded"
                        />
                      ) : (
                        <div className="meal-plan-dish-placeholder rounded">
                          <FlameIcon size={24} />
                        </div>
                      )}

                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark mb-1">
                          {dish.productName}
                        </div>
                        <div className="d-flex flex-wrap gap-2 small mb-1">
                          <span className="badge bg-light text-dark border">
                            {dish.caloriesKcal} kcal
                          </span>
                          <span className="badge bg-light text-success border">
                            {dish.proteinG}g Đạm
                          </span>
                          <span className="badge bg-light text-secondary border">
                            {dish.carbohydrateG}g Carbs
                          </span>
                          <span className="badge bg-light text-secondary border">
                            {dish.fatG}g Fat
                          </span>
                        </div>
                        {dish.expertReason && (
                          <div className="small text-muted fst-italic">
                            💡 {dish.expertReason}
                          </div>
                        )}
                      </div>

                      <div className="text-end ps-2">
                        <div className="fw-bold text-dark">
                          {dish.price?.toLocaleString()}đ
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {mealPlan.nutritionalHighlights?.length > 0 && (
              <div className="meal-plan-highlights-box mb-2 p-3 rounded">
                <div className="small fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                  <LeafIcon size={14} className="text-success" /> Điểm nổi bật
                  của thực đơn:
                </div>
                <ul className="mb-0 ps-3 small text-muted">
                  {mealPlan.nutritionalHighlights.map((hl, idx) => (
                    <li key={idx}>{hl}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={loadMealPlan}
          disabled={loading}
          className="me-auto d-flex align-items-center gap-1"
        >
          <RotateCcwIcon size={14} /> Tạo lại thực đơn
        </Button>
        <Button variant="secondary" size="sm" onClick={onHide}>
          Đóng
        </Button>
        <Button as={Link} to="/menu" variant="primary" size="sm" onClick={onHide}>
          Khám phá thực đơn
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
