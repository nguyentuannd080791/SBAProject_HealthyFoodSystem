import { Navigate } from 'react-router';
import { RequireRole } from '../RequireRole';
import { ManagerLayout } from '../../../modules/manager/components/ManagerLayout';
import { DatabaseProductListPage } from '../../../modules/manager/pages/DatabaseProductListPage';
import { ProductEditorPage } from '../../../modules/manager/pages/ProductEditorPage';
import { AddProductPage } from '../../../modules/manager/pages/AddProductPage';
import { PromotionsPage } from '../../../modules/manager/pages/PromotionsPage';
import { ManagerOrderListPage } from '../../../modules/manager/pages/ManagerOrderListPage';
import { ManagerOrderDetailPage } from '../../../modules/manager/pages/ManagerOrderDetailPage';

export const managerRoutes = [{
  path: 'manager',
  element: <RequireRole roles={['manager']}><ManagerLayout /></RequireRole>,
  children: [
    { index: true, element: <Navigate to="products" replace /> },
    { path: 'products', element: <DatabaseProductListPage /> },
    { path: 'products/new', element: <AddProductPage /> },
    { path: 'products/:productId/edit', element: <ProductEditorPage /> },
    { path: 'promotions', element: <PromotionsPage /> },
    { path: 'orders', element: <ManagerOrderListPage /> },
    { path: 'orders/:orderId', element: <ManagerOrderDetailPage /> },
    { path: '*', element: <Navigate to="/manager/products" replace /> },
  ],
}];
