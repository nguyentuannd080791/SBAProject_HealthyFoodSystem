import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useSearchParams } from "react-router";
import { useAuth } from "../../../app/provider/useAuth";
import { CheckIcon } from "../../../shared/components/Icons";
import { useCart } from "../../cart/hooks/useCart";
import { bestActivePromotion } from "../../promotion/utils/promotionPricing";
import { screeningApi } from "../../screening/api/screeningApi";
import { MenuFilterBar } from "../components/MenuFilterBar";
import { MenuPagination } from "../components/MenuPagination";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { sortMenuCards } from "../utils/sortMenuCards";
import "../styles/menu.css";

export function MenuPage() {
  const catalog = useProducts();
  const { items } = useCart();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState(null);
  const [screeningMap, setScreeningMap] = useState(new Map());
  const [now, setNow] = useState(0);
  const offersOnly = searchParams.get("offers") === "1";
  const cartItemsByProduct = new Map(items.map((item) => [String(item.id), item]));
  const cards = sortMenuCards(catalog.filteredProducts.map((product) => ({
    product, promotion: bestActivePromotion(product, catalog.promotions, now),
  })).filter(({ promotion }) => !offersOnly || promotion), catalog.sortBy);
  const showCatalog = !catalog.loading && !catalog.error &&
    (!offersOnly || (!catalog.promotionLoading && !catalog.promotionError));

  const pageSize = 12;
  const total = cards.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const offset = (safePage - 1) * pageSize;
  const pagedCards = cards.slice(offset, offset + pageSize);
  const start = total ? offset + 1 : 0;
  const end = Math.min(offset + pageSize, total);

  useEffect(() => {
    setCurrentPage(1);
  }, [catalog.searchKeyword, catalog.selectedCategory, catalog.maxCalories, catalog.sortBy, offersOnly]);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

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

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    const catalogEl = document.getElementById("menu-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleOffers() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (next.get("offers") === "1") {
        next.delete("offers");
      } else {
        next.set("offers", "1");
      }
      return next;
    });
  }

  function resetFilters() {
    catalog.resetFilters();
    setSearchParams({});
    setCurrentPage(1);
  }

  return <div className="menu-page">
    <MenuFilterBar
      {...catalog}
      offersOnly={offersOnly}
      onToggleOffers={toggleOffers}
      resetFilters={resetFilters}
    />

    <section className="menu-catalog" id="menu-catalog" aria-labelledby="menu-catalog-title">
      <div className="menu-catalog-heading">
        <h1 id="menu-catalog-title">{offersOnly ? "Món ngon đang ưu đãi" : "Thực đơn dành cho bạn"}<span className="menu-heading-spark" aria-hidden="true">✳</span></h1>
        <span className="menu-result-count" role="status">
          {catalog.loading || (offersOnly && catalog.promotionLoading)
            ? "Đang tải..."
            : `${cards.length} món ăn${totalPages > 1 ? ` · Trang ${safePage}/${totalPages}` : ""}`}
        </span>
      </div>
      {catalog.error && <Alert variant="danger">Không tải được thực đơn: {catalog.error}</Alert>}
      {catalog.promotionError && <Alert variant="warning">
        {offersOnly ? "Không thể hiển thị món đang ưu đãi: " : "Không tải được mã giảm giá: "}{catalog.promotionError}
      </Alert>}
      {catalog.loading && <p role="status" className="menu-loading">Đang tải thực đơn…</p>}
      {!catalog.loading && offersOnly && catalog.promotionLoading && !catalog.error &&
        <p role="status" className="menu-loading">Đang tải ưu đãi…</p>}
      {showCatalog && (cards.length === 0 ? <div className="menu-empty-state">
        <h2>Không tìm thấy món phù hợp</h2>
        <p>Thử đổi từ khóa hoặc danh mục để xem thêm món ngon.</p>
        <Button variant="outline-success" onClick={resetFilters}>Xóa bộ lọc</Button>
      </div> : <>
        <div className="menu-product-grid">
          {pagedCards.map(({ product, promotion }) => <ProductCard key={product.id} product={product}
            promotion={promotion}
            screeningResult={screeningMap.get(product.id)}
            cartItem={cartItemsByProduct.get(String(product.id))}
            onAdded={(addedProduct, quantity) => setNotice({ name: addedProduct.name, quantity })} />)}
        </div>
        <MenuPagination
          page={safePage}
          totalPages={totalPages}
          start={start}
          end={end}
          total={total}
          onPageChange={handlePageChange}
        />
      </>)}
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
  </div>;
}
