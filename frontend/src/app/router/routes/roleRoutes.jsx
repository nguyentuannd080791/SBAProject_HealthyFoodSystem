import { RequireRole } from "../RequireRole";
import { AdminPage } from "../../../modules/admin/pages/AdminPage";

export const roleRoutes = [
  { path: "staff", element: <h1 className="h3">Khu vực nhân viên</h1> },
  { path: "manager", element: <h1 className="h3">Khu vực quản lý</h1> },
  {
    path: "admin",
    element: (
      <RequireRole roles={["administrator"]}>
        <AdminPage />
      </RequireRole>
    ),
  },
  { path: "delivery", element: <h1 className="h3">Khu vực giao hàng</h1> },
];

