// src/modules/home/components/FeaturedMealList.jsx
import { Row, Col, Alert } from "react-bootstrap";
import { MealCard } from "./MealCard";
import { MenuFilterBar } from "./MenuFilterBar";

export function FeaturedMealList({
  meals,
  selectedCategory,
  onSelectCategory,
  searchKeyword,
  onSearchChange,
  onSelectMeal,
}) {
  return (
    <section id="featured-meals" className="mb-5">
      <div className="mb-4">
        <h2 className="h3 fw-bold text-dark mb-1">
          Thực đơn Healthy trong ngày
        </h2>
        <p className="text-muted mb-0">
          Mỗi khẩu phần ăn đều được cân đo chính xác hàm lượng dinh dưỡng
        </p>
      </div>

      <MenuFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        searchKeyword={searchKeyword}
        onSearchChange={onSearchChange}
      />

      {meals.length === 0 && (
        <Alert variant="light" className="text-center border py-4">
          Không tìm thấy món ăn phù hợp với tiêu chí lọc của bạn.
        </Alert>
      )}

      <Row className="g-4">
        {meals.map((meal) => (
          <Col md={6} lg={4} key={meal.id}>
            <MealCard meal={meal} onSelect={onSelectMeal} />
          </Col>
        ))}
      </Row>
    </section>
  );
}
