const memory = new Map();

// Remember observed states per customer so old payments are not announced as new.
export function collectPaymentNotifications(userId, orders, storage) {
  const key = `hf_payment_notifications:${userId}`;
  let states = memory.get(key) ?? {};
  try {
    const raw = storage?.getItem(key);
    if (raw && !memory.has(key)) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) states = parsed;
    }
  } catch { /* In-memory deduplication still works when browser storage is unavailable. */ }
  const next = { ...states };
  const notifications = [];
  for (const order of orders) {
    if (!order?.id || !order.paymentStatus) continue;
    const previous = states[order.id];
    // Ignore stale pending responses that arrive after a successful confirmation.
    if (previous === "paid") continue;
    if (order.paymentStatus === "paid" && (previous === "pending" || previous === "unpaid")) {
      notifications.push(order);
    }
    next[order.id] = order.paymentStatus;
  }
  memory.set(key, next);
  try { storage?.setItem(key, JSON.stringify(next)); } catch { /* Storage is optional. */ }
  return notifications;
}

export function rememberPendingPayment(userId, order) {
  if (!userId || !["pending", "unpaid"].includes(order?.paymentStatus)) return;
  let storage;
  try { storage = globalThis.sessionStorage; } catch { /* Storage is optional. */ }
  collectPaymentNotifications(userId, [order], storage);
}
