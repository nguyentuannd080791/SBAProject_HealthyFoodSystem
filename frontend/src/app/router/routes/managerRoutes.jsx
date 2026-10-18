import { Navigate } from 'react-router';
import { RequireRole } from '../RequireRole';
import { ManagerLayout } from '../../../modules/manager/components/ManagerLayout';
import { ProductListPage } from '../../../modules/manager/pages/ProductListPage';
import { ProductEditorPage } from '../../../modules/manager/pages/ProductEditorPage';
import { PromotionsPage } from '../../../modules/manager/pages/PromotionsPage';

export const managerRoutes = [{
  path: 'manager',
  element: <RequireRole roles={['manager']}><ManagerLayout /></RequireRole>,
  children: [
    { index: true, element: <Navigate to="products" replace /> },
    { path: 'products', element: <ProductListPage /> },
    { path: 'products/new', element: <ProductEditorPage /> },
    { path: 'products/:productId/edit', element: <ProductEditorPage /> },
    { path: 'promotions', element: <PromotionsPage /> },
    { path: '*', element: <Navigate to="/manager/products" replace /> },
  ],
}];
