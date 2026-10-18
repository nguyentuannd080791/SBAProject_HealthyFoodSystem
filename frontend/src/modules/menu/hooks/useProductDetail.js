import { useParams } from "react-router";
import { mockProducts } from "../data/mockProducts";

export function useProductDetail() {
  const { id } = useParams();
  const product = mockProducts.find((item) => String(item.id) === id);
  return { product };
}
