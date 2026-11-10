import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { CheckIcon } from "../../../shared/components/Icons";
import { useCart } from "../../cart/hooks/useCart";
import { screeningApi } from "../../screening/api/screeningApi";
import { MenuFilterBar } from "../components/MenuFilterBar";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import "../styles/menu.css";

export function MenuPage() {
  const catalog = useProducts();
  const { items } = useCart();
  const { user } = useAuth();
  const [notice, setNotice] = useState(null);
  const [screeningMap, setScreeningMap] = useState(new Map());
  const cartItemsByProduct = new Map(items.map((item) => [String(item.id), item]));

  useEffect(() => {
    if (!user) {
      setScreeningMap(new Map());
      return;
    }
    screeningApi.evaluateCatalog()
      .then((results) => {
        const map = new Map((results || []).map((r) => [r.productId, r]));
        setScreeningMap(map);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  return (
    <div className="menu-page">
      <section className="menu-hero" aria-labelledby="menu-hero-title">
        <div className="menu-hero-copy">
          <span className="menu-hero-eyebrow">TƯƠI NGON MỖI NGÀY</span>
          <span className="menu-hero-rule" aria-hidden="true" />
          <h1 id="menu-hero-title">Ăn ngon mỗi ngày,<br />sống khỏe theo cách bạn.</h1>
          <p>Khám phá thực đơn phù hợp với khẩu vị và mục tiêu dinh dưỡng của bạn.</p>
        </div>
      </section>

      <MenuFilterBar {...catalog} />

      <section className="menu-catalog" aria-labelledby="menu-catalog-title">
        <div className="menu-catalog-heading">
          <h2 id="menu-catalog-title">Thực đơn dành cho bạn</h2>
          <span className="menu-result-count" role="status">
            {catalog.loading ? "Đang tải..." : `${catalog.filteredProducts.length} món ăn`}
          </span>
        </div>
        {catalog.error && <Alert variant="danger">Không tải được thực đơn: {catalog.error}</Alert>}
        {catalog.loading && <p role="status" className="menu-loading">Đang tải thực đơn…</p>}
        {!catalog.loading && !catalog.error && catalog.filteredProducts.length === 0 ? (
          <div className="menu-empty-state">
            <h3>Không tìm thấy món phù hợp với bộ lọc</h3>
            <p>Thử đổi từ khóa, danh mục hoặc mức Calories tối đa.</p>
            <Button variant="outline-success" onClick={catalog.resetFilters}>Xóa bộ lọc</Button>
          </div>
        ) : (
          <div className="menu-product-grid">
            {catalog.filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product}
                screeningResult={screeningMap.get(product.id)}
                cartItem={cartItemsByProduct.get(String(product.id))}
                onAdded={(addedProduct, quantity) => setNotice({ name: addedProduct.name, quantity })} />
            ))}
          </div>
        )}
      </section>

      {notice && <div className="menu-cart-toast" role="status" aria-live="polite">
        <span className="menu-cart-toast-icon"><CheckIcon size={22} /></span>
        <div className="menu-cart-toast-copy">
          <strong>Đã thêm vào giỏ hàng!</strong>
          <span>Đã thêm {notice.quantity} phần {notice.name} vào giỏ hàng.</span>
        </div>
        <button type="button" className="menu-cart-toast-close" aria-label="Đóng thông báo"
          onClick={() => setNotice(null)}>×</button>
      </div>}
    </div>
  );
}
