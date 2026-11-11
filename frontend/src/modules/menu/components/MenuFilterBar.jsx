import { Form } from "react-bootstrap";
import { LeafIcon, SearchIcon } from "../../../shared/components/Icons";

function CategoryIcon({ name }) {
  const lower = name.toLocaleLowerCase("vi-VN");
  if (lower.includes("salad") || lower.includes("keto")) return <LeafIcon size={22} />;
  if (lower.includes("uống") || lower.includes("ép")) return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 6h14l-1.4 15H6.4L5 6Z" /><path d="M3 6h18M11 6l2-5" /></svg>;
  if (lower.includes("bowl") || lower.includes("bữa") || lower.includes("cơm")) return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 10h20c-.3 7-3.6 11-10 11S2.3 17 2 10ZM7 7l3-4m7 4-3-4" /></svg>;
  return <LeafIcon size={22} />;
}

export function MenuFilterBar({
  categories, searchKeyword, setSearchKeyword, selectedCategory, setSelectedCategory,
  maxCalories, setMaxCalories, sortBy, setSortBy, offersOnly = false, resetFilters,
}) {
  const filtersActive = Boolean(searchKeyword || maxCalories || selectedCategory !== "all" || sortBy !== "default" || offersOnly);
  return <div className="menu-filters">
    <Form.Group className="menu-search-field" controlId="menu-search">
      <Form.Label className="visually-hidden">Tìm món ăn, đồ uống</Form.Label>
      <span className="menu-search-icon"><SearchIcon /></span>
      <Form.Control type="search" placeholder="Tìm món ăn, đồ uống healthy..." value={searchKeyword}
        onChange={(event) => setSearchKeyword(event.target.value)} />
    </Form.Group>
    <div className="menu-category-row">
      <div className="menu-category-list" role="group" aria-label="Danh mục món ăn">
        {[{ id: "all", name: "Tất cả" }, ...categories].map((category) => (
          <button key={category.id} type="button"
            className={`menu-category-pill${selectedCategory === category.id ? " is-active" : ""}`}
            aria-pressed={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}>
            {category.id === "all" ? <span className="menu-all-icon" aria-hidden="true">▦</span> : <CategoryIcon name={category.name} />}
            {category.name}
          </button>
        ))}
      </div>
      <div className="menu-filter-actions">
        <Form.Group className="menu-calorie-field" controlId="menu-calories">
          <Form.Label className="visually-hidden">Calories tối đa</Form.Label>
          <Form.Select value={maxCalories} onChange={(event) => setMaxCalories(event.target.value)} aria-label="Calories tối đa">
            <option value="">Mọi mức kcal</option>
            {[200, 300, 400, 500, 600, 800].map((value) => <option key={value} value={value}>Dưới {value} kcal</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="menu-sort-field" controlId="menu-sort">
          <Form.Label className="visually-hidden">Sắp xếp sản phẩm</Form.Label>
          <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sắp xếp sản phẩm">
            <option value="default">Ưu đãi trước</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="calories-asc">Calories: Thấp → Cao</option>
            <option value="calories-desc">Calories: Cao → Thấp</option>
          </Form.Select>
        </Form.Group>
        {filtersActive && <button type="button" className="menu-reset-filter" onClick={resetFilters}>Xóa lọc</button>}
      </div>
    </div>
  </div>;
}
