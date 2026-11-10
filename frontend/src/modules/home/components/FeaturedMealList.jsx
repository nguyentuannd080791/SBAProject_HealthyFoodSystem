import { Alert, Button } from "react-bootstrap";
import { MenuFilterBar } from "../../menu/components/MenuFilterBar";
import { ProductCard } from "../../menu/components/ProductCard";
import "../../menu/styles/menu.css";

export function FeaturedMealList({ catalog, cards, cartItemsByProduct, onAdded }) {
  return <section id="featured-meals" className="home-featured-menu mb-5" aria-labelledby="featured-meals-title">
    <div className="menu-catalog-heading">
      <h2 id="featured-meals-title">Thực đơn dành cho bạn</h2>
      <span className="menu-result-count" role="status">
        {catalog.loading ? "Đang tải..." : `${cards.length} món ăn`}
      </span>
    </div>
    <p className="home-featured-intro">Mỗi khẩu phần được cân đo chính xác hàm lượng dinh dưỡng.</p>

    <MenuFilterBar {...catalog} />

    {catalog.error && <Alert variant="danger">Không tải được thực đơn: {catalog.error}</Alert>}
    {catalog.promotionError && <Alert variant="warning">Không tải được mã giảm giá: {catalog.promotionError}</Alert>}
    {catalog.loading && <p role="status" className="menu-loading">Đang tải thực đơn…</p>}
    {!catalog.loading && !catalog.error && (cards.length === 0 ? <div className="menu-empty-state">
      <h3>Không tìm thấy món phù hợp</h3>
      <p>Thử đổi từ khóa hoặc danh mục để xem thêm món ngon.</p>
      <Button variant="outline-success" onClick={catalog.resetFilters}>Xóa bộ lọc</Button>
    </div> : <div className="menu-product-grid">
      {cards.map(({ product, promotion }) => <ProductCard key={product.id} product={product}
        promotion={promotion} cartItem={cartItemsByProduct.get(String(product.id))}
        onAdded={onAdded} />)}
    </div>)}
  </section>;
}
