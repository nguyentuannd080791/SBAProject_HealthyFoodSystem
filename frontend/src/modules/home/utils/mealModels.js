// src/modules/home/utils/mealModels.js

export class Money {
  constructor(amount, currency = "₫") {
    this.amount = amount;
    this.currency = currency;
  }

  format() {
    return `${this.amount.toLocaleString("vi-VN")} ${this.currency}`;
  }
}

export class MacroNutrients {
  constructor(calories, proteinGrams, carbsGrams, fatGrams) {
    this.calories = calories;
    this.proteinGrams = proteinGrams;
    this.carbsGrams = carbsGrams;
    this.fatGrams = fatGrams;
  }

  formatCalories() {
    return `${this.calories} kcal`;
  }
}

export class Meal {
  constructor({
    id,
    title,
    description,
    category,
    weightGrams,
    macros,
    price,
    imageUrl,
    isBestSeller = false,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.weightGrams = weightGrams;
    this.macros = macros;
    this.price = price;
    this.imageUrl = imageUrl;
    this.isBestSeller = isBestSeller;
  }

  matchesFilter(category, keyword) {
    const matchesCategory = category === "ALL" || this.category === category;
    const normalizedKeyword = keyword.trim().toLowerCase();
    const matchesKeyword =
      !normalizedKeyword ||
      this.title.toLowerCase().includes(normalizedKeyword) ||
      this.description.toLowerCase().includes(normalizedKeyword);

    return matchesCategory && matchesKeyword;
  }
}

// First-Class Collection quản lý danh sách món ăn
export class MealCatalog {
  constructor(meals = []) {
    this.meals = meals;
  }

  filterBy(category, keyword = "") {
    return this.meals.filter((meal) => meal.matchesFilter(category, keyword));
  }
}

export const NUTRITION_CATEGORIES = [
  { id: "ALL", label: "Tất cả món" },
  { id: "LOW_CARB", label: "Giảm mỡ (Low Carb)" },
  { id: "HIGH_PROTEIN", label: "Tăng cơ (High Protein)" },
  { id: "EAT_CLEAN", label: "Cân bằng (Eat Clean)" },
  { id: "PLANT_BASED", label: "Thuần chay (Vegan)" },
];

export const DEFAULT_MEAL_CATALOG = new MealCatalog([
  new Meal({
    id: "meal-1",
    title: "Ức Gà Áp Chảo Sốt Chanh Dây & Quinoa",
    description:
      "Ức gà phi lê mềm mọng ăn kèm hạt diêm mạch, bông cải xanh hấp và cà chua bi.",
    category: "HIGH_PROTEIN",
    weightGrams: 380,
    macros: new MacroNutrients(420, 42, 35, 11),
    price: new Money(75000),
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    isBestSeller: true,
  }),
  new Meal({
    id: "meal-2",
    title: "Cá Hồi Na Uy Nướng Măng Tây & Khoai Lang",
    description:
      "Cá hồi giàu Omega-3 áp chảo nguyên bản, măng tây xanh giòn và khoai lang mật nướng.",
    category: "EAT_CLEAN",
    weightGrams: 400,
    macros: new MacroNutrients(510, 36, 40, 22),
    price: new Money(115000),
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    isBestSeller: true,
  }),
  new Meal({
    id: "meal-3",
    title: "Salad Bò Úc Nướng & Trứng Lòng Đào",
    description:
      "Thăn nội bò Úc nướng medium, xà lách Romaine, bơ sáp, trứng gà ta và sốt mè rang ít béo.",
    category: "LOW_CARB",
    weightGrams: 350,
    macros: new MacroNutrients(360, 34, 14, 18),
    price: new Money(89000),
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    isBestSeller: false,
  }),
  new Meal({
    id: "meal-4",
    title: "Cơm Gạo Lứt Tôm Hùm Đất & Đậu Hà Lan",
    description:
      "Gạo lứt huyết rồng nấu mềm, tôm tươi áp chảo tỏi đen, đậu Hà Lan và cà rốt baby.",
    category: "HIGH_PROTEIN",
    weightGrams: 410,
    macros: new MacroNutrients(450, 38, 48, 9),
    price: new Money(85000),
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    isBestSeller: false,
  }),
  new Meal({
    id: "meal-5",
    title: "Bún Gạo Lứt Đậu Hũ Non & Nấm Đông Cô",
    description:
      "Đạm thực vật thanh đạm từ đậu hũ non hữu cơ, nấm hương rừng, hạt điều và rau theo mùa.",
    category: "PLANT_BASED",
    weightGrams: 360,
    macros: new MacroNutrients(330, 18, 42, 9),
    price: new Money(65000),
    imageUrl:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=600&q=80",
    isBestSeller: false,
  }),
  new Meal({
    id: "meal-6",
    title: "Salad Cá Ngừ Ngâm Dầu Ô Liu & Bơ Tươi",
    description:
      "Cá ngừ đại dương giàu đạm kết hợp bơ tươi, ngô ngọt, dưa leo và sốt dầu giấm táo.",
    category: "LOW_CARB",
    weightGrams: 340,
    macros: new MacroNutrients(340, 31, 16, 16),
    price: new Money(72000),
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
    isBestSeller: true,
  }),
]);

export const MEAL_PLANS = [
  {
    id: "plan-7",
    name: "Gói Khởi Đầu (7 Ngày)",
    subtitle: "Làm quen chế độ ăn kiểm soát Calo",
    mealsCount: "14 bữa (Trưa & Tối)",
    caloriesRange: "1.100 - 1.300 kcal / ngày",
    price: new Money(980000),
    savingNote: "Tiết kiệm 10% so với đặt lẻ",
    isPopular: false,
  },
  {
    id: "plan-14",
    name: "Gói Chuyển Hóa (14 Ngày)",
    subtitle: "Đốt mỡ thừa & siết gọn vóc dáng",
    mealsCount: "28 bữa (Trưa & Tối)",
    caloriesRange: "1.200 - 1.500 kcal / ngày",
    price: new Money(1850000),
    savingNote: "Tiết kiệm 15% + Miễn phí ship",
    isPopular: true,
  },
  {
    id: "plan-30",
    name: "Gói Toàn Diện (30 Ngày)",
    subtitle: "Thiết lập lối sống khỏe & duy trì cơ bắp",
    mealsCount: "60 bữa (Trưa & Tối)",
    caloriesRange: "Cá nhân hóa theo TDEE",
    price: new Money(3690000),
    savingNote: "Tiết kiệm 22% + Tư vấn thực đơn 1-1",
    isPopular: false,
  },
];
