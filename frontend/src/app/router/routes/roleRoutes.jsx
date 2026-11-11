import { RequireRole } from "../RequireRole";
import { AdminPage } from "../../../modules/admin/pages/AdminPage";
import { managerRoutes } from './managerRoutes';
import { StaffLayout } from '../../../modules/staff/components/StaffLayout';
import { StaffOrdersPage } from '../../../modules/staff/pages/StaffOrdersPage';
import { StaffInvoicePage } from '../../../modules/staff/pages/StaffInvoicePage';
import { ChangePasswordPage } from '../../../modules/auth/pages/ChangePasswordPage';
import { DeliveryOrdersPage } from '../../../modules/delivery/pages/DeliveryOrdersPage';

export const roleRoutes = [
  {
    path: "staff",
    element: (
      <RequireRole roles={["staff"]}>
        <StaffLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <StaffOrdersPage /> },
      { path: "password", element: <ChangePasswordPage /> },
      { path: "orders/:orderId/invoice", element: <StaffInvoicePage /> },
    ],
  },
  { path: "delivery", element: <RequireRole roles={["delivery_partner"]}><DeliveryOrdersPage /></RequireRole> },
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
