import { useEffect, useState } from "react";
import { Alert, Badge } from "react-bootstrap";
import { formatOrderDate } from "../../orders/utils/orderFormatting";
import { deliveryApi } from "../api/deliveryApi";

const TRACKING_META = {
  WAITING_PICKUP: {
    variant: "warning",
    badgeVariant: "warning",
    badgeText: "Chờ đối tác đến nhận",
    description: "Cửa hàng đã đóng gói xong và gửi yêu cầu giao hàng.",
  },
  DRIVER_ARRIVED: {
    variant: "info",
    badgeVariant: "info",
    badgeText: "Đối tác đã đến quán",
    description: "Đối tác giao hàng đã tới nhận đơn và đang chờ nhân viên Confirm bàn giao.",
  },
  SHIPPING: {
    variant: "primary",
    badgeVariant: "primary",
    badgeText: "Đã bàn giao · Đang giao",
    description: "Nhân viên cửa hàng đã xác nhận bàn giao cho đối tác giao hàng.",
  },
  DELIVERED: {
    variant: "success",
    badgeVariant: "success",
    badgeText: "Giao hàng hoàn tất",
    description: "Đối tác giao hàng đã xác nhận giao đơn thành công.",
  },
};

export function HandoverTrackingBadge({ orderId, orderStatus }) {
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    deliveryApi.getOrderTracking(orderId).then((res) => {
      if (active && !res.error && res.data?.dispatched) {
        setTracking(res.data);
      } else if (active && !res.error && !res.data?.dispatched) {
        setTracking(null);
      }
    });
    return () => {
      active = false;
    };
  }, [orderId, orderStatus]);

  if (!tracking?.dispatched) return null;

  const meta = TRACKING_META[tracking.handoverStatus] || {
    variant: "secondary",
    badgeVariant: "secondary",
    badgeText: tracking.handoverStatus,
    description: "",
  };

  return (
    <Alert variant={meta.variant} className="mb-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
        <strong>Thông tin bàn giao vận chuyển</strong>
        <Badge bg={meta.badgeVariant}>{meta.badgeText}</Badge>
      </div>
      <div className="small">{meta.description}</div>
      <div className="small mt-1">
        Mã bàn giao:{" "}
        <Badge bg="dark" className="font-monospace">
          {tracking.handoverCode}
        </Badge>
        {tracking.deliveryPartnerName && (
          <span className="ms-2">
            · Đối tác: <strong>{tracking.deliveryPartnerName}</strong>
            {tracking.deliveryPartnerPhone
              ? ` (${tracking.deliveryPartnerPhone})`
              : ""}
          </span>
        )}
      </div>
      {(tracking.confirmedAt || tracking.deliveredAt) && (
        <div className="small text-muted mt-1">
          {tracking.confirmedAt &&
            `Bàn giao lúc ${formatOrderDate(tracking.confirmedAt)}`}
          {tracking.confirmedAt && tracking.deliveredAt && " · "}
          {tracking.deliveredAt &&
            `Hoàn tất lúc ${formatOrderDate(tracking.deliveredAt)}`}
        </div>
      )}
    </Alert>
  );
}
