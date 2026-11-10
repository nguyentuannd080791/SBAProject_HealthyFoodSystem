import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { CartIcon } from "../../../shared/components/Icons";
import { QuantityControl } from "../../../shared/components/QuantityControl";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../../cart/hooks/useCart";
import { NutritionFacts } from "../components/NutritionFacts";
import { useProductDetail } from "../hooks/useProductDetail";
import "../styles/productDetail.css";

function ProductDetailContent({ product, promotion, promotionError, promotionLoading }) {
  const navigate = useNavigate();
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [pending, setPending] = useState(false);
  const [addError, setAddError] = useState("");
  const [addedQuantity, setAddedQuantity] = useState(null);
  const availableQuantity = product.availableQuantity ?? 0;
  const inCartQuantity = items.reduce((total, item) => item.id === product.id ? total + item.quantity : total, 0);
  const remainingQuantity = Math.max(0, availableQuantity - inCartQuantity);
  const soldOut = product.status !== "AVAILABLE" || availableQuantity === 0;
  const cannotAdd = soldOut || remainingQuantity === 0;
  const selectedQuantity = Math.min(quantity, Math.max(remainingQuantity, 1));
  const saving = promotion ? Math.max(0, product.price - promotion.price) : 0;
  const hasPromotion = saving > 0 && Boolean(promotion?.promotion?.code);
  const discountPercent = product.price > 0 ? Math.round(saving / product.price * 100) : 0;
  const discountLabel = promotion?.promotion?.type === "percentage"
    ? `-${Number(promotion.promotion.value).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`
    : discountPercent > 0 ? `-${discountPercent}%` : "<1%";

  async function handleAddToCart(buyNow = false) {
    if (pending || cannotAdd) return;
    setPending(true);
    setAddError("");
    try {
      const result = await addToCart(product, selectedQuantity);
      if (result.error) {
        setAddError(result.error);
        return;
      }
      if (buyNow) {
        const promoQuery = hasPromotion ? `?promo=${encodeURIComponent(promotion.promotion.code)}` : "";
        navigate(`/checkout${promoQuery}`);
        return;
      }
      setAddedQuantity(selectedQuantity);
      setQuantity(1);
    } finally {
      setPending(false);
    }
  }

  return <div className="product-detail-page">
    <Button as={Link} to="/menu" variant="outline-success" className="product-detail-back">
      ← Quay lại danh sách sản phẩm
    </Button>
    <div className="product-detail-main">
      <div className="product-detail-media">
        {product.image ? <img src={product.image} alt={product.name} />
          : <div className="product-detail-image-empty">Chưa có ảnh sản phẩm</div>}
        {hasPromotion && <span className="product-detail-image-discount">{discountLabel}</span>}
      </div>

      <div className="product-detail-summary">
        <h1>{product.name}</h1>
        {product.description && <p className="product-detail-summary-description">{product.description}</p>}

        <div className="product-detail-pricing">
          {hasPromotion && <span className="product-detail-original-price">{formatCurrency(product.price)}</span>}
          <strong className="product-detail-price">{formatCurrency(hasPromotion ? promotion.price : product.price)}</strong>
          {hasPromotion && <span className="product-detail-price-discount">{discountLabel}</span>}
        </div>
        {hasPromotion && <p className="product-detail-promo-note">
          Nhập mã <strong>{promotion.promotion.code}</strong> khi thanh toán để nhận giá ưu đãi.
        </p>}
        {promotionError && <Alert variant="warning" className="mt-3">
          Không tải được mã giảm giá: {promotionError}
        </Alert>}

        <div className="product-detail-purchase">
          <div className="product-detail-quantity">
            <span>Số lượng:</span>
            <QuantityControl quantity={selectedQuantity} onChange={setQuantity}
              max={remainingQuantity} name={product.name} disabled={pending || cannotAdd} />
          </div>
          <button type="button" className="product-detail-add" disabled={pending || cannotAdd}
            onClick={() => handleAddToCart()}>
            <CartIcon size={24} /> {pending ? "Đang thêm…" : "Thêm vào giỏ"}
          </button>
          <button type="button" className="product-detail-buy" disabled={pending || cannotAdd || promotionLoading}
            onClick={() => handleAddToCart(true)}>
            {promotionLoading ? "Đang kiểm tra ưu đãi…" : "Mua ngay"}
          </button>
        </div>
        {cannotAdd && <p className="product-detail-stock" role="status">
          {product.status !== "AVAILABLE" ? "Sản phẩm đang ngừng bán." : soldOut
            ? "Sản phẩm tạm hết hàng." : "Bạn đã chọn hết số lượng còn trong kho."}
        </p>}
        {addError && <Alert variant="danger" className="mt-3 mb-0" dismissible
          onClose={() => setAddError("")}>{addError}</Alert>}
        {addedQuantity !== null && <Alert variant="success" className="mt-3 mb-0" dismissible
          onClose={() => setAddedQuantity(null)}>
          Đã thêm {addedQuantity} phần {product.name} vào giỏ hàng. <Link to="/cart">Xem giỏ hàng</Link>
        </Alert>}

        <NutritionFacts nutrition={product.nutrition} />
      </div>
    </div>

    <section className="product-detail-information" aria-label="Thông tin sản phẩm">
      <div className="product-detail-tabs" role="tablist" aria-label="Nội dung sản phẩm">
        <button type="button" role="tab" id="product-description-tab"
          aria-selected={activeTab === "description"} aria-controls="product-detail-panel"
          className={activeTab === "description" ? "is-active" : ""}
          onClick={() => setActiveTab("description")}>Mô tả</button>
        <button type="button" role="tab" id="product-ingredients-tab"
          aria-selected={activeTab === "ingredients"} aria-controls="product-detail-panel"
          className={activeTab === "ingredients" ? "is-active" : ""}
          onClick={() => setActiveTab("ingredients")}>Thành phần</button>
      </div>
      <div className="product-detail-tab-panel" id="product-detail-panel" role="tabpanel"
        aria-labelledby={activeTab === "description" ? "product-description-tab" : "product-ingredients-tab"}>
        {activeTab === "description" ? <p>{product.description || "Chưa có mô tả sản phẩm."}</p>
          : product.ingredients.length ? <ul>{product.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
            : <p>Chưa có thông tin thành phần.</p>}
      </div>
    </section>
  </div>;
}

export function ProductDetailPage() {
  const { product, promotion, promotionError, promotionLoading, loading, error } = useProductDetail();
  if (loading) return <p role="status">Đang tải món ăn…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="warning">
    <h1 className="h4">Không tìm thấy món ăn</h1>
    <p>Món ăn này không có trong thực đơn hiện tại.</p>
    <Link to="/menu">Quay lại thực đơn</Link>
  </Alert>;
  return <ProductDetailContent key={product.id} product={product} promotion={promotion}
    promotionError={promotionError} promotionLoading={promotionLoading} />;
}
