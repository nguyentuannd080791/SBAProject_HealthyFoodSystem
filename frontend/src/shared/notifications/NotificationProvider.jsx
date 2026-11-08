import { useCallback, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router";
import { NotificationContext } from "./NotificationContext";
import "./notifications.css";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const notify = useCallback((notification) => {
    const id = notification.id ?? crypto.randomUUID();
    setNotifications((current) => current.some((item) => item.id === id)
      ? current : [...current, { ...notification, id }].slice(-5));
  }, []);

  function dismiss(id) {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }

  return <NotificationContext.Provider value={{ notify }}>
    {children}
    <ToastContainer position="top-end" containerPosition="fixed"
      className="notification-container p-3" aria-label="Thông báo giao dịch">
      {notifications.map((item) => <Toast key={item.id} onClose={() => dismiss(item.id)}
        autohide delay={12000} role="status" aria-live="polite" aria-atomic="true">
        <Toast.Header closeLabel="Đóng thông báo">
          <span className="notification-check me-2" aria-hidden="true">✓</span>
          <strong className="me-auto">{item.title}</strong>
        </Toast.Header>
        <Toast.Body><p className="mb-2">{item.message}</p>
          {item.to && <Link to={item.to} onClick={() => dismiss(item.id)}>Xem đơn hàng →</Link>}
        </Toast.Body>
      </Toast>)}
    </ToastContainer>
  </NotificationContext.Provider>;
}
