import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

export function PaymentCountdown({ expiresAt }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!expiresAt) return null;
  const seconds = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
  return <Alert variant={seconds <= 30 ? "danger" : "warning"} role="status">
    {seconds > 0 ? <>Thanh toán còn <strong>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</strong>.
      Quá hạn, đơn tự hủy và hoàn kho.</> : <>Đã hết thời gian thanh toán. Không tiếp tục chuyển tiền; hệ thống đang cập nhật đơn và hoàn kho.</>}
  </Alert>;
}
