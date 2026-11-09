import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router";
import { CheckIcon, PlusIcon } from "../../../shared/components/Icons";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { useCart } from "../../cart/hooks/useCart";

export function ProductCard({ product, cartItem, onAdded }) {
  const { addToCart } = useCart();
  const [pending, setPending] = useState(false);
  const [addError, setAddError] = useState("");
  const inCart = Boolean(cartItem);
  const stockQuantity = product.stockQuantity;
  const soldOut = product.status !== "AVAILABLE" || stockQuantity === 0;
  const lowStock = !soldOut && stockQuantity != null && stockQuantity <= 5;

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
    <article className={`menu-product-card${inCart ? " is-in-cart" : ""}${soldOut ? " is-sold-out" : ""}`}>
      <Link to={`/products/${product.id}`} className="menu-product-image-link" aria-label={`Xem chi tiết ${product.name}`}>
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="menu-product-image" />
          : <span className="menu-product-image menu-product-image-empty">Chưa có ảnh</span>}
      </Link>
      <div className="menu-product-content">
        <div className="menu-product-meta">
          <span className="menu-product-category">{product.categoryName}</span>
          <span className="menu-product-calories">🔥 {product.nutrition.calories} kcal</span>
        </div>
        <h3 className="menu-product-title"><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
        <p className="menu-product-description">{product.description}</p>
        <p className={`menu-product-stock${soldOut ? " is-unavailable" : stockQuantity == null ? " is-unknown" : lowStock ? " is-low" : " is-available"}`}>
          <span className="menu-product-stock-dot" aria-hidden="true" />
          {soldOut ? "Tạm hết hàng" : stockQuantity == null ? "Chưa cập nhật tồn kho" : lowStock
            ? `Chỉ còn ${stockQuantity} sản phẩm` : `Còn ${stockQuantity} sản phẩm`}
        </p>
        <div className="menu-product-footer">
          <strong className="menu-product-price">{formatCurrency(product.price)}</strong>
          {soldOut ? (
            <button type="button" className="menu-product-add is-sold-out" disabled>Hết hàng</button>
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
