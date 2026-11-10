import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { bestActivePromotion } from "../../promotion/utils/promotionPricing";
import { publicPromotionApi } from "../api/publicPromotionApi";
import { productApi } from "../api/productApi";

export function useProductDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState({ id: null, product: null, error: "" });
  const [promotions, setPromotions] = useState([]);
  const [promotionError, setPromotionError] = useState("");
  const [promotionLoading, setPromotionLoading] = useState(true);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    let active = true;
    productApi.get(id).then((result) => {
      if (!active) return;
      setDetail({ id, product: result.error ? null : result.data, error: result.error ?? "" });
    });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    let active = true;
    publicPromotionApi.listActive().then((result) => {
      if (!active) return;
      if (result.error) setPromotionError(result.error);
      else {
        setPromotions(result.data);
        setPromotionError("");
      }
      setPromotionLoading(false);
    });
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const loading = detail.id !== id;
  const product = loading ? null : detail.product;
  return {
    product,
    promotion: product ? bestActivePromotion(product, promotions, now) : null,
    promotionError,
    promotionLoading,
    loading,
    error: loading ? "" : detail.error,
  };
}
