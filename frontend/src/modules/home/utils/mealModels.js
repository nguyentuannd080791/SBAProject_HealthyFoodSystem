export class Money {
  constructor(amount, currency = "₫") {
    this.amount = amount;
    this.currency = currency;
  }

  format() {
    return `${this.amount.toLocaleString("vi-VN")} ${this.currency}`;
  }
}

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
