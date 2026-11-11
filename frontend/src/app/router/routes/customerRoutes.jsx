import { ProfilePage } from "../../../modules/profile/pages/ProfilePage";
import { RequireAuth } from "../RequireAuth";
import { RequireRole } from "../RequireRole";
import { CartPage } from "../../../modules/cart/pages/CartPage";
import { MenuPage } from "../../../modules/menu/pages/MenuPage";
import { ProductDetailPage } from "../../../modules/menu/pages/ProductDetailPage";
import { CheckoutPage } from "../../../modules/orders/pages/CheckoutPage";
import { OrderHistoryPage } from "../../../modules/orders/pages/OrderHistoryPage";
import { OrderDetailPage } from "../../../modules/orders/pages/OrderDetailPage";
import { NutritionMetricsPage } from "../../../modules/nutrition/pages/NutritionMetricsPage";
import { MealPlanPage } from "../../../modules/nutrition/pages/MealPlanPage";

export const customerRoutes = [
  { path: "menu", element: <RequireAuth><MenuPage /></RequireAuth> },
  {
    path: "nutrition",
    element: (
      <RequireAuth>
        <NutritionMetricsPage />
      </RequireAuth>
    ),
  },
  {
    path: "nutrition/plan",
    element: (
      <RequireAuth>
        <MealPlanPage />
      </RequireAuth>
    ),
  },
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
