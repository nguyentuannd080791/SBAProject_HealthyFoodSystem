import { Button, Card, Col, Form, Row } from "react-bootstrap";

export function MenuFilterBar({
  categories, searchKeyword, setSearchKeyword, selectedCategory, setSelectedCategory,
  maxCalories, setMaxCalories, sortBy, setSortBy, resetFilters,
}) {
  return (
    <Card body className="border-0 shadow-sm mb-4">
      <Row className="g-3 mb-3">
        <Col md={6}><Form.Group controlId="menu-search">
          <Form.Label>Tìm món ăn</Form.Label>
          <Form.Control type="search" placeholder="Nhập tên món ăn…" value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)} />
        </Form.Group></Col>
        <Col sm={6} md={3}><Form.Group controlId="menu-calories">
          <Form.Label>Calories tối đa (kcal)</Form.Label>
          <Form.Control type="number" min="0" step="1" placeholder="Không giới hạn" value={maxCalories}
            onChange={(event) => {
              const value = event.target.value;
              setMaxCalories(value === "" ? "" : Math.max(0, Number(value)));
            }} />
        </Form.Group></Col>
        <Col sm={6} md={3}><Form.Group controlId="menu-sort">
          <Form.Label>Sắp xếp</Form.Label>
          <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="calories-asc">Calories: Thấp → Cao</option>
            <option value="calories-desc">Calories: Cao → Thấp</option>
          </Form.Select>
        </Form.Group></Col>
      </Row>
      <div className="d-flex flex-wrap gap-2" role="group" aria-label="Danh mục món ăn">
        {[{ id: "all", name: "Tất cả" }, ...categories].map((category) => (
          <Button key={category.id} size="sm" className="rounded-pill"
            variant={selectedCategory === category.id ? "success" : "outline-success"}
            aria-pressed={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}>{category.name}</Button>
        ))}
        <Button variant="link" size="sm" onClick={resetFilters}>Xóa bộ lọc</Button>
      </div>
    </Card>
  );
}
