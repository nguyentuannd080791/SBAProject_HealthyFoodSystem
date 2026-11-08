import { useEffect } from "react";
import { useAuth } from "../../../app/provider/useAuth";
import { useNotification } from "../../../shared/notifications/useNotification";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { orderStore } from "../api/orderStore";
import { collectPaymentNotifications } from "../utils/paymentNotifications";

export function PaymentNotificationWatcher() {
  const { user } = useAuth();
  const { notify } = useNotification();

  useEffect(() => {
    if (!user?.id || user.role?.toLowerCase() !== "customer") return;
    let active = true;
    let timer;
    let pending = false;

    async function checkPayments() {
      if (!active || pending || document.visibilityState === "hidden") return;
      clearTimeout(timer);
      pending = true;
      try {
        const result = await orderStore.list();
        if (!active || document.visibilityState === "hidden" || result.error) return;
        let storage;
        try { storage = window.sessionStorage; } catch { /* Browser storage may be blocked. */ }
        const paidOrders = collectPaymentNotifications(user.id, result.data, storage);
        for (const order of paidOrders) {
          notify({
            id: `payment:${user.id}:${order.id}`,
            title: "Thanh toán thành công!",
            message: `Đã nhận ${formatCurrency(order.total)} cho đơn #${String(order.id).slice(-8)}. Cảm ơn bạn đã đặt hàng!`,
            to: `/orders/${encodeURIComponent(order.id)}`,
          });
        }
      } catch {
        // Retry later; a request failure must never announce a successful payment.
      } finally {
        pending = false;
        if (active) timer = setTimeout(checkPayments, 10000);
      }
    }

    checkPayments();
    window.addEventListener("focus", checkPayments);
    document.addEventListener("visibilitychange", checkPayments);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener("focus", checkPayments);
      document.removeEventListener("visibilitychange", checkPayments);
    };
  }, [user?.id, user?.role, notify]);

  return null;
}
