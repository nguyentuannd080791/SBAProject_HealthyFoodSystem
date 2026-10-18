import { ProfilePage } from "../../../modules/profile/pages/ProfilePage";
import { RequireRole } from "../RequireRole";
import { CartPage } from "../../../modules/cart/pages/CartPage";
import { MenuPage } from "../../../modules/menu/pages/MenuPage";
import { ProductDetailPage } from "../../../modules/menu/pages/ProductDetailPage";

export const customerRoutes = [
  { path: "menu", element: <MenuPage /> },
  { path: "products/:id", element: <ProductDetailPage /> },
  { path: "cart", element: <CartPage /> },
  {
    path: "profile",
    element: (
      <RequireRole roles={["customer"]}>
        <ProfilePage />
      </RequireRole>
    ),
  },
];
