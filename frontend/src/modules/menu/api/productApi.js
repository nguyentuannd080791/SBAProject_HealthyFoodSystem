import { callApi } from "../../../shared/api/callApi";
import { httpClient } from "../../../shared/api/httpClient";
import { mapProduct } from "../utils/mapProduct";

async function categories() {
  return callApi(() => httpClient.get("/api/products/categories"));
}

export const productApi = {
  async list() {
    const [products, categoryResult] = await Promise.all([
      callApi(() => httpClient.get("/api/products")),
      categories(),
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
      categories(),
    ]);
    if (product.error) return product;
    if (categoryResult.error) return categoryResult;
    const categoryNames = new Map(categoryResult.data.map(({ id: categoryId, name }) => [categoryId, name]));
    return { data: mapProduct(product.data, categoryNames) };
  },
};
