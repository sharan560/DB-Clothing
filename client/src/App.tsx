import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Auth from './pages/Auth';
import Account from './pages/Account';
import WishlistPage from './pages/WishlistPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="collections" element={<Shop />} />
          <Route path="collections/:slug" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="account" element={<Account />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
