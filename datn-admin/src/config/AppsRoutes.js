import { Routes, Route } from 'react-router-dom';
import NotFound from '../components/NotFound';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../page/Home';
import Test from '../page/Test';
import CategoryPage from '../page/CategoryPage';
import Login from '../page/Login';
import SupplierPage from '../page/SupplierPage';
import SizePage from '../page/SizePage';
import ColorPage from '../page/ColorPage';
import VoucherPage from '../page/VoucherPage';
import ProductPage from '../page/ProductPage';
import OrderPage from '../page/OrderPage';
import ChangePassword from '../page/ChangePassword';
import ProductImportPage from '../page/ProductImportPage';
import { useEffect } from 'react';
import ProductImportListPage from '../page/ProductImportListPage';
import AccountPage from '../page/AccountPage';
import AccountRolePage from '../page/AccountRolePage';
import RoleManagement from '../page/RoleManagement';
import { ro } from 'date-fns/locale';
import UnauthorizedPage from '../page/UnauthorizedPage';
import OrderDetailPage from '../page/OrderDetailPage';

export const RouteConfig = [
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/category',
    element: <CategoryPage />,
    roles: ['/category', 'admin'],
  },
  {
    path: '/category/supplier',
    element: <SupplierPage />,
    roles: ['/category/supplier', 'admin']
  },
  {
    path: '/category/sizes',
    element: <SizePage />,
    roles: ['/category/sizes', 'admin']
  },
  {
    path: '/category/colors',
    element: <ColorPage />,
    roles: ['/category/colors', 'admin']
  },
  {
    path: '/product/voucher',
    element: <VoucherPage />,
    roles: ['/product/voucher', 'admin']
  },
  {
    path: '/product',
    element: <ProductPage />,
    roles: ['/product', 'admin']
  },
  {
    path: '/product/import',
    element: <ProductImportPage />,
    roles: ['/product/import', 'admin']
  },
  {
    path: '/import/list',
    element: <ProductImportListPage />,
    roles: ['/import/list', 'admin']
  },
  {
    path: '/order',
    element: <OrderPage />,
    roles: ['/order', 'admin']
  },
  {
    path: '/order-detail/:id',
    element: <OrderDetailPage />,
    roles: ['/order-detail', 'admin']
  },
  {
    path: '/account',
    element: <AccountPage />,
    roles: ['/account', 'admin']
  },
  {
    path: '/account/role',
    element: <AccountRolePage />,
    roles: ['/account/role', 'admin']
  },
  {
    path: '/account/role-management',
    element: <RoleManagement />,
    roles: ['/account/role-management', 'admin']
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/Unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/dashboard',
    element: <Home />,
    roles: ['/dashboard', 'admin'],
  },
];

const AppsRoutes = () => {
  useEffect(() => {
    document.title = 'Kidi Admin';
  }, []);
  return (
    <Routes>
      {RouteConfig.map((route) =>
        route.roles ? (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute roles={route.roles}>{route.element}</PrivateRoute>
            }
          />
        ) : (
          <Route key={route.path} path={route.path} element={route.element} />
        ),
      )}
      <Route path='/*' element={<NotFound />} />
    </Routes>
  );
};

export default AppsRoutes;
