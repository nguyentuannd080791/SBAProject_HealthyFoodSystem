import { Form } from "react-bootstrap";

function SearchIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="7.2" /><path d="m16.3 16.3 5 5" />
    </svg>
  );
}

export function MenuFilterBar({
  categories, searchKeyword, setSearchKeyword, selectedCategory, setSelectedCategory,
  maxCalories, setMaxCalories, sortBy, setSortBy, resetFilters,
}) {
  return (
    <div className="menu-filters">
      <div className="menu-filter-panel">
        <Form.Group className="menu-search-field" controlId="menu-search">
          <Form.Label className="visually-hidden">Tìm món ăn</Form.Label>
          <span className="menu-search-icon"><SearchIcon /></span>
          <Form.Control type="search" placeholder="Tìm món ăn yêu thích..." value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)} />
        </Form.Group>
        <Form.Group className="menu-select-field" controlId="menu-calories">
          <Form.Label>Calories tối đa</Form.Label>
          <Form.Select value={maxCalories} onChange={(event) => setMaxCalories(event.target.value)}>
            <option value="">Không giới hạn</option>
            {[200, 300, 400, 500, 600, 800].map((value) => (
              <option key={value} value={value}>Dưới {value} kcal</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="menu-select-field" controlId="menu-sort">
          <Form.Label>Sắp xếp</Form.Label>
          <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="calories-asc">Calories: Thấp → Cao</option>
            <option value="calories-desc">Calories: Cao → Thấp</option>
          </Form.Select>
        </Form.Group>
      </div>
      <div className="menu-category-row">
        <div className="menu-category-list" role="group" aria-label="Danh mục món ăn">
          {[{ id: "all", name: "Tất cả" }, ...categories].map((category) => (
            <button key={category.id} type="button" className={`menu-category-pill${selectedCategory === category.id ? " is-active" : ""}`}
              aria-pressed={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}>{category.name}</button>
          ))}
        </div>
        <button type="button" className="menu-reset-filter" onClick={resetFilters}>Xóa bộ lọc</button>
      </div>
    </div>
  );
}
