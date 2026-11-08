import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification cần nằm trong NotificationProvider.");
  return context;
}
