import { RequireRole } from "../RequireRole";
import { AdminPage } from "../../../modules/admin/pages/AdminPage";
import { managerRoutes } from './managerRoutes';
import { StaffOrdersPage } from '../../../modules/staff/pages/StaffOrdersPage';
import { StaffInvoicePage } from '../../../modules/staff/pages/StaffInvoicePage';

export const roleRoutes = [
  { path: "staff", element: <RequireRole roles={["staff"]}><StaffOrdersPage /></RequireRole> },
  { path: "staff/orders/:orderId/invoice", element: <RequireRole roles={["staff"]}><StaffInvoicePage /></RequireRole> },
  ...managerRoutes,
  {
    path: "admin",
    element: (
      <RequireRole roles={["administrator"]}>
        <AdminPage />
      </RequireRole>
    ),
  },
];

