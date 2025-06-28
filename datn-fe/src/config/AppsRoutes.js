import { Routes, Route } from 'react-router-dom';
import Login from '../page/Login';
import NotFound from '../components/NotFound';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../page/Home';
import SingleProduct, { singleProductLoader } from '../page/SingleProduct';
import Cart from '../page/Cart';
import Checkout from '../page/Checkout';
import Order from '../page/Order';
import PaymentFailed from '../page/PaymentFailed';
import Register from '../page/Register';
import AddressPage from '../page/Address';
import Test from '../page/Test';
import OrderDetails from '../page/OrderDetails';

export const RouteConfig = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/product/:id',
    element: <SingleProduct />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/order',
    element: <Order />,
  },
  {
    path: '/order-detail/:id',
    element: <OrderDetails />,
  },
  {
    path: '/address',
    element: <AddressPage />,
  },
  {
    path: '/payment-failed',
    element: <PaymentFailed />,
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/',
    element: <Home />,
  },
];

const AppsRoutes = () => {
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
