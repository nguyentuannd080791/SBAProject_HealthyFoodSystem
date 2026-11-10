import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router";
import { CheckIcon, PlusIcon, TagIcon } from "../../../shared/components/Icons";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../../cart/hooks/useCart";

export function ProductCard({ product, promotion, cartItem, onAdded }) {
  const { addToCart } = useCart();
  const [pending, setPending] = useState(false);
  const [addError, setAddError] = useState("");
  const inCart = Boolean(cartItem);
  const availableQuantity = product.availableQuantity ?? 0;
  const soldOut = product.status !== "AVAILABLE" || availableQuantity === 0;
  const lowStock = !soldOut && availableQuantity <= 5;
  const saving = promotion ? Math.max(0, Number(product.price) - Number(promotion.price)) : 0;
  const hasPromotion = saving > 0 && Boolean(promotion?.promotion?.code);
  const discountPercent = hasPromotion && product.price > 0
    ? Math.round(saving / product.price * 100) : 0;
  const discountLabel = promotion?.promotion?.type === "percentage"
    ? `-${Number(promotion.promotion.value).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`
    : discountPercent > 0 ? `-${discountPercent}%` : "<1%";

  async function handleAddToCart() {
    if (pending || soldOut) return;
    setPending(true);
    setAddError("");
    try {
      const result = await addToCart(product, 1);
      if (result.error) setAddError(result.error);
      else onAdded(product, 1);
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={`menu-product-card${inCart ? " is-in-cart" : ""}${soldOut ? " is-sold-out" : ""}${hasPromotion ? " has-promotion" : ""}`}>
      <Link to={`/products/${product.id}`} className="menu-product-image-link" aria-label={`Xem chi tiết ${product.name}`}>
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="menu-product-image" />
          : <span className="menu-product-image menu-product-image-empty">Chưa có ảnh</span>}
        {hasPromotion && <span className="menu-discount-flag">
          <TagIcon size={19} />
          <span>{discountLabel}</span>
        </span>}
      </Link>
      <div className="menu-product-content">
        <div className="menu-product-meta">
          <span className="menu-product-category">{product.categoryName}</span>
          <span className="menu-product-calories">🔥 {product.nutrition.calories} kcal</span>
        </div>
        <h3 className="menu-product-title"><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
        {!hasPromotion && <p className="menu-product-description">{product.description}</p>}
        <p className={`menu-product-stock${soldOut ? " is-unavailable" : lowStock ? " is-low" : " is-available"}`}>
          <span className="menu-product-stock-dot" aria-hidden="true" />
          {product.status !== 'AVAILABLE' ? 'Ngừng bán' : soldOut ? "Tạm hết hàng" : lowStock
            ? `Chỉ còn ${availableQuantity} combo` : `Còn ${availableQuantity} combo`}
        </p>
        {hasPromotion && <p className="menu-product-code">
          <TagIcon size={18} />
          <span>Nhập mã <strong>{promotion.promotion.code}</strong> để giảm giá</span>
        </p>}
        <div className="menu-product-footer">
          <div className="menu-product-price-group">
            {hasPromotion && <span className="menu-product-original-price">{formatCurrency(product.price)}</span>}
            <div className="menu-product-current-price">
              <strong className="menu-product-price">{formatCurrency(hasPromotion ? promotion.price : product.price)}</strong>
              {hasPromotion && <span className="menu-product-saving">Tiết kiệm {formatCurrency(saving)}</span>}
            </div>
          </div>
          {soldOut ? (
            <button type="button" className="menu-product-add is-sold-out" disabled>{product.status !== 'AVAILABLE' ? 'Ngừng bán' : 'Hết hàng'}</button>
          ) : inCart ? (
            <Link to="/cart" className="menu-product-add is-added" aria-label={`${product.name} đã có trong giỏ. Xem giỏ hàng`}>
              <CheckIcon size={23} />
            </Link>
          ) : (
            <button type="button" className="menu-product-add" onClick={handleAddToCart}
              disabled={pending}
              aria-label={`Thêm ${product.name} vào giỏ hàng`}
              title="Thêm vào giỏ">
              {pending ? <span className="menu-add-spinner" aria-hidden="true" /> : <PlusIcon size={25} />}
            </button>
          )}
        </div>
        {addError && <Alert variant="danger" className="small mt-3 mb-0" dismissible
          onClose={() => setAddError("")}>{addError}</Alert>}
      </div>
    </article>
  );
}
