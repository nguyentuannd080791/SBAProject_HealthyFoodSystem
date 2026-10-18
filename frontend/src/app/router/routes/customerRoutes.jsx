import { ProfilePage } from "../../../modules/profile/pages/ProfilePage";
import { RequireRole } from "../RequireRole";
import { CartPage } from "../../../modules/cart/pages/CartPage";
import { MenuPage } from "../../../modules/menu/pages/MenuPage";
import { ProductDetailPage } from "../../../modules/menu/pages/ProductDetailPage";
import { CheckoutPage } from "../../../modules/orders/pages/CheckoutPage";
import { OrderHistoryPage } from "../../../modules/orders/pages/OrderHistoryPage";
import { OrderDetailPage } from "../../../modules/orders/pages/OrderDetailPage";

export const customerRoutes = [
  { path: "menu", element: <MenuPage /> },
  { path: "products/:id", element: <ProductDetailPage /> },
  { path: "cart", element: <CartPage /> },
  {
    path: "checkout",
    element: (
      <RequireRole roles={["customer"]}>
        <CheckoutPage />
      </RequireRole>
    ),
  },
  {
    path: "orders",
    element: (
      <RequireRole roles={["customer"]}>
        <OrderHistoryPage />
      </RequireRole>
    ),
  },
  {
    path: "orders/:orderId",
    element: (
      <RequireRole roles={["customer"]}>
        <OrderDetailPage />
      </RequireRole>
    ),
  },
  {
    path: "profile",
    element: (
      <RequireRole roles={["customer"]}>
        <ProfilePage />
      </RequireRole>
    ),
  },
];
