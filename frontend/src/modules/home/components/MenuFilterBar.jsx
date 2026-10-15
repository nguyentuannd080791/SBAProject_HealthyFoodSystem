// src/modules/home/components/MenuFilterBar.jsx
import { Row, Col, Nav, Form, InputGroup } from "react-bootstrap";
import { NUTRITION_CATEGORIES } from "../utils/mealModels";

export function MenuFilterBar({
  selectedCategory,
  onSelectCategory,
  searchKeyword,
  onSearchChange,
}) {
  return (
    <Row className="align-items-center justify-content-between g-3 mb-4">
      <Col lg={8}>
        <Nav
          variant="pills"
          activeKey={selectedCategory}
          onSelect={(key) => onSelectCategory(key)}
          className="gap-2 flex-wrap"
        >
          {NUTRITION_CATEGORIES.map((category) => (
            <Nav.Item key={category.id}>
              <Nav.Link
                eventKey={category.id}
                className={
                  selectedCategory === category.id
                    ? "bg-success text-white fw-semibold"
                    : "bg-light text-dark border"
                }
              >
                {category.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Col>
      <Col lg={4}>
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Tìm món ăn (VD: ức gà, cá hồi, salad...)"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Tìm kiếm món ăn"
          />
        </InputGroup>
      </Col>
    </Row>
  );
}
