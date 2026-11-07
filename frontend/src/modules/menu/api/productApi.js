import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";
import { categoryApi } from "../../category/api/categoryApi";
import { mapProduct } from "../utils/mapProduct";

export const productApi = {
  async list() {
    const [products, categoryResult] = await Promise.all([
      callApi(() => httpClient.get("/api/products")),
      categoryApi.list(),
    ]);
    if (products.error) return products;
    if (categoryResult.error) return categoryResult;
    const categoryNames = new Map(categoryResult.data.map(({ id, name }) => [id, name]));
    return {
      data: products.data.map((product) => mapProduct(product, categoryNames)),
      categories: categoryResult.data.map(({ id, name }) => ({ id, name })),
    };
  },

  async get(id) {
    const [product, categoryResult] = await Promise.all([
      callApi(() => httpClient.get(`/api/products/${id}`)),
      categoryApi.list(),
    ]);
    if (product.error) return product;
    if (categoryResult.error) return categoryResult;
    const categoryNames = new Map(categoryResult.data.map(({ id: categoryId, name }) => [categoryId, name]));
    return { data: mapProduct(product.data, categoryNames) };
  },
};
