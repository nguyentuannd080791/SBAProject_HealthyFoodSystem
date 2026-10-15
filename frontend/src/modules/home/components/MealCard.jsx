// src/modules/home/components/MealCard.jsx
import { Card, Badge, Button, Row, Col } from "react-bootstrap";

function MacroBadge({ label, value }) {
  return (
    <Col xs={4} className="text-center border-end last-border-0">
      <div className="small text-muted" style={{ fontSize: "0.75rem" }}>
        {label}
      </div>
      <div className="fw-semibold text-dark">{value}g</div>
    </Col>
  );
}

export function MealCard({ meal, onSelect }) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={meal.imageUrl}
          alt={meal.title}
          loading="lazy"
          decoding="async"
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
          {meal.isBestSeller && (
            <Badge bg="warning" text="dark">
              Bán chạy
            </Badge>
          )}
          <Badge bg="dark" className="bg-opacity-75">
            {meal.weightGrams}g
          </Badge>
        </div>
        <Badge
          bg="success"
          className="position-absolute bottom-0 end-0 m-2 px-2 py-1 fs-6"
        >
          {meal.macros.formatCalories()}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6 fw-bold mb-2">{meal.title}</Card.Title>
        <Card.Text className="small text-muted mb-3">
          {meal.description}
        </Card.Text>

        <Row className="g-0 bg-light rounded-3 py-2 mb-3 border">
          <MacroBadge label="Đạm (Protein)" value={meal.macros.proteinGrams} />
          <MacroBadge label="Tinh bột (Carb)" value={meal.macros.carbsGrams} />
          <MacroBadge label="Chất béo (Fat)" value={meal.macros.fatGrams} />
        </Row>

        <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
          <span className="fs-5 fw-bold text-success">
            {meal.price.format()}
          </span>
          <Button variant="success" size="sm" onClick={() => onSelect(meal)}>
            + Chọn món
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
