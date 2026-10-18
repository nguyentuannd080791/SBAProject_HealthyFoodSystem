function normalizeKeyword(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").toLocaleLowerCase("vi-VN").trim();
}

const comparators = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "calories-asc": (a, b) => a.nutrition.calories - b.nutrition.calories,
  "calories-desc": (a, b) => b.nutrition.calories - a.nutrition.calories,
};

export function filterProducts(products, {
  searchKeyword = "", selectedCategory = "all", maxCalories = "", sortBy = "default",
} = {}) {
  const keyword = normalizeKeyword(searchKeyword);
  const calorieLimit = maxCalories === "" || maxCalories == null ? Infinity : Number(maxCalories);
  const filtered = products.filter((product) =>
    normalizeKeyword(product.name).includes(keyword) &&
    (selectedCategory === "all" || product.categoryId === selectedCategory) &&
    product.nutrition.calories <= calorieLimit,
  );
  return Object.hasOwn(comparators, sortBy) ? filtered.sort(comparators[sortBy]) : filtered;
}
