import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { productApi } from "../api/productApi";

export function useProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    productApi.get(id).then((result) => {
      if (!active) return;
      if (result.error) setError(result.error);
      else {
        setProduct(result.data);
        setError("");
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  return { product, loading, error };
}
