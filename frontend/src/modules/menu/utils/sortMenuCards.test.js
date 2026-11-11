import test from "node:test";
import assert from "node:assert/strict";
import { sortMenuCards } from "./sortMenuCards.js";

const card = (id, { promotion = false, availableQuantity = 5, status = "AVAILABLE" } = {}) => ({
  product: { id, availableQuantity, status },
  promotion: promotion ? { price: 80 } : null,
});

test("ưu tiên món còn hàng có mã, để mọi món hết hàng ở cuối", () => {
  const original = [
    card(1, { availableQuantity: 0, promotion: true }),
    card(2),
    card(3, { promotion: true }),
    card(4, { status: "UNAVAILABLE", promotion: true }),
    card(5, { promotion: true }),
    card(6),
  ];

  assert.deepEqual(sortMenuCards(original).map(({ product }) => product.id), [3, 5, 2, 6, 1, 4]);
  assert.equal(original[0].product.id, 1);
});

test("giữ thứ tự giá hoặc calories đã chọn, kể cả khi có mã giảm giá", () => {
  const sortedByPrice = [card(1), card(2, { promotion: true }), card(3, { availableQuantity: 0 })];
  assert.deepEqual(sortMenuCards(sortedByPrice, "price-asc").map(({ product }) => product.id), [1, 2, 3]);
  assert.deepEqual(sortMenuCards(sortedByPrice, "calories-desc").map(({ product }) => product.id), [1, 2, 3]);
  assert.notStrictEqual(sortMenuCards(sortedByPrice, "price-asc"), sortedByPrice);
});
