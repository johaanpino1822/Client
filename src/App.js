import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Páginas públicas
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductsListPage from './pages/ProductsListPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentProcessingPage from './pages/PaymentProcessingPage'; // Nueva página
import PaymentResultPage from './pages/PaymentResultPage'; // Nueva página

// Componentes
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Panel de administración
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import ProductForm from './admin/ProductForm';
import ProductCreate from './admin/ProductCreate';
import UserList from './admin/UserList';
import AdminOrders from './admin/AdminOrders';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rutas públicas con Navbar y Footer */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/products" element={<ProductsListPage />} />
              <Route path="/products/:category" element={<ProductsListPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route 
                path="/checkout" 
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/order/:id" element={<OrderConfirmationPage />} />
              <Route path="/payment/processing" element={<PaymentProcessingPage />} />
              <Route path="/payment/result" element={<PaymentResultPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Rutas protegidas para administración */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductCreate />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="users" element={<UserList />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Manejo de rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;