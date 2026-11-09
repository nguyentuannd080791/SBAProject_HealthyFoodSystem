import { Navigate } from 'react-router';
import { RequireRole } from '../RequireRole';
import { ManagerLayout } from '../../../modules/manager/components/ManagerLayout';
import { DatabaseProductListPage } from '../../../modules/product/pages/DatabaseProductListPage';
import { ProductEditorPage } from '../../../modules/product/pages/ProductEditorPage';
import { AddProductPage } from '../../../modules/product/pages/AddProductPage';
import { PromotionsPage } from '../../../modules/promotion/pages/PromotionsPage';
import { CreatePromotionPage } from '../../../modules/promotion/pages/CreatePromotionPage';
import { ManagerOrderListPage } from '../../../modules/manager/pages/ManagerOrderListPage';
import { ManagerOrderDetailPage } from '../../../modules/manager/pages/ManagerOrderDetailPage';
import { CategoryManagementPage } from '../../../modules/category/pages/CategoryManagementPage';

import { ReconciliationPage } from '../../../modules/manager/pages/ReconciliationPage';

export const managerRoutes = [{
  path: 'manager',
  element: <RequireRole roles={['manager']}><ManagerLayout /></RequireRole>,
  children: [
    { index: true, element: <Navigate to="products" replace /> },
    { path: 'products', element: <DatabaseProductListPage /> },
    { path: 'products/new', element: <AddProductPage /> },
    { path: 'products/:productId/edit', element: <ProductEditorPage /> },
    { path: 'categories', element: <CategoryManagementPage /> },
    { path: 'promotions', element: <PromotionsPage /> },
    { path: 'promotions/new', element: <CreatePromotionPage /> },
    { path: 'reconciliation', element: <ReconciliationPage /> },
    { path: 'orders', element: <ManagerOrderListPage /> },
    { path: 'orders/:orderId', element: <ManagerOrderDetailPage /> },
    { path: '*', element: <Navigate to="/manager/products" replace /> },
  ],
}];
