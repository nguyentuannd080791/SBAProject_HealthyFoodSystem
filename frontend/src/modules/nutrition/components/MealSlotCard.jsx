import { Badge, Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import {
  CartIcon,
  CheckIcon,
  FlameIcon,
} from "../../../shared/components/Icons";
import { HealthWarningBadge } from "../../screening/components/HealthWarningBadge";

export function MealSlotCard({
  meal,
  onAddToCart,
  isAdding = false,
  isAdded = false,
  cartQuantity = 0,
  screeningResult,
}) {
  const dish = meal?.dish;
  if (!dish) return null;

  const diff = meal.calorieDifferenceKcal ?? 0;
  const diffSign = diff > 0 ? `+${diff}` : `${diff}`;
  const isUnsafe = Boolean(
    screeningResult && !screeningResult.isSafe && !screeningResult.safe
  );

  return (
    <Card
      className={`meal-slot-item-card border-0 shadow-sm mb-3 ${
        isUnsafe ? "border-start border-danger border-4" : ""
      }`}
    >
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-2 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <h6 className="fw-bold mb-0 text-dark">{meal.mealName}</h6>
            <span className="small text-muted">
              (Mục tiêu: {meal.targetCaloriesKcal} kcal)
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted">
              Thực tế:{" "}
              <strong className="text-success">
                {meal.actualCaloriesKcal} kcal
              </strong>
            </span>
            <Badge
              bg={Math.abs(diff) <= 60 ? "success" : "secondary"}
              className="px-2 py-1 font-monospace"
            >
              {diff === 0 ? "Khớp 100%" : `${diffSign} kcal`}
            </Badge>
          </div>
        </div>

        <div className="meal-slot-dish-container d-flex flex-column flex-sm-row gap-3 align-items-sm-center justify-content-between">
          <div className="d-flex gap-3 align-items-center flex-grow-1">
            <Link
              to={`/products/${dish.productId}`}
              className="meal-slot-thumb-link text-decoration-none"
            >
              {dish.imageUrl ? (
                <img
                  src={dish.imageUrl}
                  alt={dish.productName}
                  className="meal-slot-thumb rounded"
                />
              ) : (
                <div className="meal-slot-thumb-placeholder rounded">
                  <FlameIcon size={26} />
                </div>
              )}
            </Link>

            <div className="meal-slot-info flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <Link
                  to={`/products/${dish.productId}`}
                  className="fw-bold text-dark text-decoration-none text-truncate meal-dish-title"
                >
                  {dish.productName}
                </Link>
                {dish.categoryName && (
                  <Badge bg="light" text="dark" className="border small">
                    {dish.categoryName}
                  </Badge>
                )}
                {screeningResult && (
                  <HealthWarningBadge screeningResult={screeningResult} />
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 small mb-2">
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

              {isUnsafe && screeningResult.warningSummary && (
                <div className="alert alert-danger py-1 px-2 mb-2 small border-0 bg-danger-subtle text-danger">
                  ⚠️ {screeningResult.warningSummary}
                </div>
              )}

              <div className="fw-bold text-success fs-6">
                {dish.price?.toLocaleString()}đ
              </div>
            </div>
          </div>

          <div className="meal-slot-cart-action d-flex flex-column align-items-sm-end justify-content-center pt-2 pt-sm-0">
            {cartQuantity > 0 && (
              <span className="small text-success mb-1 d-flex align-items-center gap-1">
                <CheckIcon size={13} /> Đã có trong giỏ ({cartQuantity})
              </span>
            )}

            {isAdded ? (
              <Button
                variant="outline-success"
                size="sm"
                disabled
                className="d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
              >
                <CheckIcon size={16} /> Đã thêm vào giỏ
              </Button>
            ) : (
              <Button
                variant={isUnsafe ? "outline-danger" : "success"}
                size="sm"
                onClick={() => onAddToCart(dish, screeningResult)}
                disabled={isAdding}
                className="d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                title={
                  isUnsafe
                    ? "Món ăn vi phạm cảnh báo bệnh nền / dị ứng"
                    : undefined
                }
              >
                {isAdding ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Đang thêm...</span>
                  </>
                ) : (
                  <>
                    <CartIcon size={16} />
                    <span>
                      {cartQuantity > 0 ? "Thêm tiếp" : "Thêm vào giỏ"}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
