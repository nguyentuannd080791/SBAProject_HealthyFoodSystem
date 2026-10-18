import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/theme.css";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./provider/AuthProvider";
import { router } from "./router/router";
import { CartProvider } from "../modules/cart/context/CartProvider";

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
