import { httpClient } from "../../../shared/api/httpClient";

function imageUrl(value) {
  return value ? new URL(value, httpClient.defaults.baseURL).href : "";
}

export function mapProduct(product, categoryNames = new Map()) {
  return {
    id: product.id,
    categoryId: product.categoryId,
    categoryName: categoryNames.get(product.categoryId) ?? "Món ăn",
    name: product.name,
    description: product.description ?? "",
    image: imageUrl(product.imageUrl),
    price: Number(product.price),
    status: product.status,
    ingredients: product.ingredientsText?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    tags: [],
    nutrition: {
      calories: product.caloriesKcal ?? 0,
      protein: Number(product.proteinG ?? 0),
      carbs: Number(product.carbohydrateG ?? 0),
      fat: Number(product.fatG ?? 0),
    },
  };
}

export function mapCartItem(item) {
  return {
    ...item,
    image: imageUrl(item.image),
    price: Number(item.price),
    nutrition: {
      calories: item.nutrition?.calories ?? 0,
      protein: Number(item.nutrition?.protein ?? 0),
      carbs: Number(item.nutrition?.carbs ?? 0),
      fat: Number(item.nutrition?.fat ?? 0),
    },
  };
}
