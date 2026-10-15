// src/modules/home/components/MealPlanSection.jsx
import { Row, Col, Card, Button, Badge, ListGroup } from "react-bootstrap";
import { MEAL_PLANS } from "../utils/mealModels";

export function MealPlanSection({ onSelectPlan }) {
  return (
    <section id="meal-plans" className="mb-5 py-4">
      <div className="text-center mb-4">
        <Badge bg="success" className="mb-2">
          Tiết kiệm & Kỷ luật hơn
        </Badge>
        <h2 className="h3 fw-bold">Gói Ăn Định Kỳ Giao Tận Nơi</h2>
        <p className="text-muted">
          Đăng ký một lần, bếp tự động lên thực đơn đa dạng không trùng lặp và
          giao mỗi ngày
        </p>
      </div>

      <Row className="g-4">
        {MEAL_PLANS.map((plan) => (
          <Col lg={4} key={plan.id}>
            <Card
              className={`h-100 rounded-4 ${
                plan.isPopular
                  ? "border-success border-2 shadow"
                  : "border shadow-sm"
              }`}
            >
              <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="h5 fw-bold mb-0">
                    {plan.name}
                  </Card.Title>
                  {plan.isPopular && <Badge bg="success">Phổ biến nhất</Badge>}
                </div>
                <p className="small text-muted mb-3">{plan.subtitle}</p>
                <div className="display-6 fw-bold text-success mb-1">
                  {plan.price.format()}
                </div>
                <div className="small text-success fw-semibold mb-3">
                  {plan.savingNote}
                </div>

                <ListGroup variant="flush" className="mb-4 small">
                  <ListGroup.Item className="px-0">
                    <strong>Số lượng:</strong> {plan.mealsCount}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Năng lượng:</strong> {plan.caloriesRange}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Linh hoạt:</strong> Đổi món hoặc tạm dừng trước 24h
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  variant={plan.isPopular ? "success" : "outline-success"}
                  className="mt-auto w-100"
                  onClick={() => onSelectPlan?.(plan)}
                >
                  Đăng ký gói ăn
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
