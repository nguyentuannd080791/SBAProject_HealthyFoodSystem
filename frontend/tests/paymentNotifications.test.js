import assert from "node:assert/strict";
import { test } from "node:test";
import { collectPaymentNotifications, rememberPendingPayment } from "../src/modules/orders/utils/paymentNotifications.js";

function storage() {
  const values = new Map();
  return { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
}
const order = (id, paymentStatus) => ({ id, paymentStatus, total: 2000 });

test("historic paid orders do not show a new payment popup", () => {
  assert.deepEqual(collectPaymentNotifications("historic", [order("a", "paid")], storage()), []);
});

test("an expired payment accepted by a manager is announced exactly once", () => {
  const saved = storage();
  collectPaymentNotifications("late-accepted", [order("a", "pending")], saved);
  collectPaymentNotifications("late-accepted", [order("a", "expired")], saved);
  assert.equal(collectPaymentNotifications("late-accepted", [order("a", "paid")], saved).length, 1);
  collectPaymentNotifications("late-accepted", [order("a", "expired")], saved);
  assert.deepEqual(collectPaymentNotifications("late-accepted", [order("a", "paid")], saved), []);
});

test("a pending payment confirmed by the server is announced only once", () => {
  const saved = storage();
  collectPaymentNotifications("live", [order("a", "pending")], saved);
  assert.equal(collectPaymentNotifications("live", [order("a", "paid")], saved).length, 1);
  assert.deepEqual(collectPaymentNotifications("live", [order("a", "paid")], saved), []);
});

test("a pending payment saved before reload is still announced", () => {
  const saved = storage();
  saved.setItem("hf_payment_notifications:reload", JSON.stringify({ a: "pending" }));
  assert.equal(collectPaymentNotifications("reload", [order("a", "paid")], saved).length, 1);
});

test("payment observations from one customer do not affect another", () => {
  const saved = storage();
  collectPaymentNotifications("customer-a", [order("a", "pending")], saved);
  assert.deepEqual(collectPaymentNotifications("customer-b", [order("a", "paid")], saved), []);
  assert.equal(collectPaymentNotifications("customer-a", [order("a", "paid")], saved).length, 1);
});

test("cancelled or failed requests cannot be treated as a successful payment", () => {
  const saved = storage();
  collectPaymentNotifications("cancelled", [order("a", "pending")], saved);
  assert.deepEqual(collectPaymentNotifications("cancelled", [], saved), []);
  assert.deepEqual(collectPaymentNotifications("cancelled", [order("a", "cancelled")], saved), []);
});

test("blocked storage still deduplicates repeated successful responses", () => {
  const saved = { getItem: () => '{"a":"pending"}', setItem: () => { throw new Error("blocked"); } };
  assert.equal(collectPaymentNotifications("blocked", [order("a", "paid")], saved).length, 1);
  assert.deepEqual(collectPaymentNotifications("blocked", [order("a", "paid")], saved), []);
});

test("checkout remembers a pending order before the first background poll", () => {
  rememberPendingPayment("checkout", order("new", "pending"));
  assert.equal(collectPaymentNotifications("checkout", [order("new", "paid")]).length, 1);
});

test("a delayed pending response cannot re-arm a payment already announced", () => {
  const saved = storage();
  collectPaymentNotifications("stale", [order("a", "pending")], saved);
  assert.equal(collectPaymentNotifications("stale", [order("a", "paid")], saved).length, 1);
  collectPaymentNotifications("stale", [order("a", "pending")], saved);
  assert.deepEqual(collectPaymentNotifications("stale", [order("a", "paid")], saved), []);
});
