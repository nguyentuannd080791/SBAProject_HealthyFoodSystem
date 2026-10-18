// Replace this catalog with productApi when the product service is available.
// Stable IDs allow saved carts to survive a page reload.
function dishImage(emoji, background) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="${background}"/><circle cx="320" cy="200" r="145" fill="white" fill-opacity=".7"/><text x="320" y="250" text-anchor="middle" font-size="150" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const mockProducts = [
  {
    id: "chicken-salad", name: "Salad ức gà", categoryId: "salad", categoryName: "Salad",
    price: 69000, image: dishImage("🥗", "#e1f2e9"),
    description: "Ức gà áp chảo mềm, rau xanh giòn và sốt sữa chua chanh thanh nhẹ. Một phần ăn cân bằng cho bữa trưa bận rộn.",
    ingredients: ["Ức gà", "Xà lách", "Cà chua bi", "Dưa leo", "Sữa chua", "Chanh"],
    nutrition: { calories: 320, protein: 32, carbs: 18, fat: 13 }, tags: ["Giàu đạm", "Rau xanh"],
  },
  {
    id: "salmon-poke", name: "Salmon Poke Bowl", categoryId: "poke-bowl", categoryName: "Poke Bowl",
    price: 109000, image: dishImage("🍣", "#fde8df"),
    description: "Cá hồi áp chảo kết hợp cơm gạo lứt, bơ và đậu nành Nhật. Sốt mè rang mang lại hương vị béo thơm cho từng miếng ăn.",
    ingredients: ["Cá hồi", "Gạo lứt", "Bơ", "Đậu nành Nhật", "Rong biển", "Sốt mè rang"],
    nutrition: { calories: 520, protein: 34, carbs: 51, fat: 20 }, tags: ["Giàu đạm", "Bán chạy"],
  },
  {
    id: "beef-brown-rice-noodles", name: "Bún gạo lứt bò", categoryId: "balanced", categoryName: "Bữa ăn cân bằng",
    price: 75000, image: dishImage("🍜", "#fcf0d8"),
    description: "Bún gạo lứt trộn cùng thịt bò xào, rau củ và nước sốt chanh tỏi. Hương vị quen thuộc với khẩu phần rau phong phú.",
    ingredients: ["Bún gạo lứt", "Thịt bò", "Cà rốt", "Dưa leo", "Rau thơm", "Chanh", "Tỏi"],
    nutrition: { calories: 430, protein: 30, carbs: 50, fat: 12 }, tags: ["Gạo lứt"],
  },
  {
    id: "keto-beef-bowl", name: "Keto Beef Bowl", categoryId: "keto", categoryName: "Keto",
    price: 99000, image: dishImage("🥩", "#f5e6dd"),
    description: "Thịt bò áp chảo dùng cùng cơm súp lơ, bơ và trứng. Khẩu phần ít tinh bột, đậm vị với dầu ô liu và tiêu đen.",
    ingredients: ["Thịt bò", "Súp lơ", "Bơ", "Trứng", "Dầu ô liu", "Tiêu đen"],
    nutrition: { calories: 480, protein: 38, carbs: 12, fat: 31 }, tags: ["Ít tinh bột", "Giàu đạm"],
  },
  {
    id: "sample-avocado-smoothie", name: "Sinh tố bơ chuối", categoryId: "drinks", categoryName: "Đồ uống healthy",
    price: 45000, image: dishImage("🥑", "#edf1d4"),
    description: "Bơ sáp xay cùng chuối chín và sữa hạt, vị ngọt tự nhiên từ trái cây. Thức uống sánh mịn không thêm đường.",
    ingredients: ["Bơ", "Chuối", "Sữa hạnh nhân", "Đá"],
    nutrition: { calories: 290, protein: 6, carbs: 32, fat: 15 }, tags: ["Không thêm đường"],
  },
  {
    id: "quinoa-salad", name: "Salad quinoa rau củ", categoryId: "salad", categoryName: "Salad",
    price: 65000, image: dishImage("🥙", "#e9efd9"),
    description: "Hạt quinoa trộn rau củ nhiều màu và đậu gà, thêm sốt chanh dầu ô liu. Một lựa chọn thuần chay tươi mát.",
    ingredients: ["Quinoa", "Đậu gà", "Ớt chuông", "Dưa leo", "Cà chua", "Dầu ô liu"],
    nutrition: { calories: 350, protein: 14, carbs: 46, fat: 12 }, tags: ["Thuần chay", "Giàu chất xơ"],
  },
  {
    id: "sample-chicken-rice", name: "Cơm gạo lứt ức gà", categoryId: "balanced", categoryName: "Bữa ăn cân bằng",
    price: 65000, image: dishImage("🍱", "#e5f1df"),
    description: "Ức gà áp chảo, cơm gạo lứt và rau củ hấp theo mùa. Bữa ăn đơn giản với nguồn đạm và tinh bột cân đối.",
    ingredients: ["Ức gà", "Gạo lứt", "Bông cải xanh", "Cà rốt", "Dầu ô liu"],
    nutrition: { calories: 450, protein: 35, carbs: 48, fat: 13 }, tags: ["Giàu đạm", "Gạo lứt"],
  },
  {
    id: "green-juice", name: "Nước ép táo cần tây", categoryId: "drinks", categoryName: "Đồ uống healthy",
    price: 39000, image: dishImage("🥤", "#e0f0e7"),
    description: "Táo xanh, cần tây và dưa leo ép tươi cùng chút chanh. Vị thanh mát, không thêm đường.",
    ingredients: ["Táo xanh", "Cần tây", "Dưa leo", "Chanh"],
    nutrition: { calories: 110, protein: 1, carbs: 26, fat: 0 }, tags: ["Không thêm đường", "Thuần chay"],
  },
];

export const productCategories = Array.from(
  new Map(mockProducts.map(({ categoryId, categoryName }) => [
    categoryId, { id: categoryId, name: categoryName },
  ])).values(),
);
