import { useEffect, useRef } from "react";
import { useAuth } from "../../../app/provider/useAuth";
import { useNotification } from "../../../shared/notifications/useNotification";
import { staffOrderApi } from "../api/staffOrderApi";

export function StaffHandoverNotificationWatcher() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const seenKeysRef = useRef(new Set());

  useEffect(() => {
    if (!user?.id || user.role?.toLowerCase() !== "staff") return;
    let active = true;
    let timer;
    let pending = false;

    async function checkArrivedDrivers() {
      if (!active || pending || document.visibilityState === "hidden") return;
      clearTimeout(timer);
      pending = true;
      try {
        const res = await staffOrderApi.getArrivedHandovers();
        if (!active || document.visibilityState === "hidden" || res.error) return;
        const arrivedList = res.data || [];
        for (const item of arrivedList) {
          const eventKey = `${item.orderId}:${item.arrivedAt || item.handoverCode}`;
          if (seenKeysRef.current.has(eventKey)) continue;
          seenKeysRef.current.add(eventKey);
          notify({
            id: `handover:${eventKey}`,
            title: "Đối tác giao hàng đã đến nhận đơn!",
            message: `${item.deliveryPartnerName || "Tài xế"} đã tới nhận đơn #${String(item.orderId).slice(-8)} (Mã: ${item.handoverCode}). Vui lòng Confirm bàn giao.`,
            to: "/staff",
          });
        }
      } catch {
        // Retry silently on next poll
      } finally {
        pending = false;
        if (active) timer = setTimeout(checkArrivedDrivers, 5000);
      }
    }

    checkArrivedDrivers();
    window.addEventListener("focus", checkArrivedDrivers);
    document.addEventListener("visibilitychange", checkArrivedDrivers);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener("focus", checkArrivedDrivers);
      document.removeEventListener("visibilitychange", checkArrivedDrivers);
    };
  }, [user?.id, user?.role, notify]);

  return null;
}
