import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminShops } from './pages/admin/AdminShops'
import { AdminMasters } from './pages/admin/AdminMasters'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminOrders } from './pages/admin/AdminOrders'
import { AdminPromo } from './pages/admin/AdminPromo'
import { ShopDashboard } from './pages/shop/ShopDashboard'
import { ShopProducts } from './pages/shop/ShopProducts'
import { AdminOrders as ShopOrders } from './pages/admin/AdminOrders'
import { MasterDashboard } from './pages/master/MasterDashboard'
import { MasterServices } from './pages/master/MasterServices'
import { MasterRepairs } from './pages/master/MasterRepairs'
import { AdminOrders as MasterOrders } from './pages/admin/AdminOrders'
import { ProductsPage } from './pages/user/ProductsPage'
import { ServicesPage } from './pages/user/ServicesPage'
import { CartPage } from './pages/user/CartPage'
import { MyOrdersPage } from './pages/user/MyOrdersPage'
import { MastersPage } from './pages/user/MastersPage'
import { Toaster } from 'react-hot-toast'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

function HomeRedirect() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'SUPER_ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'SHOP_ADMIN') return <Navigate to="/shop" replace />
  if (user.role === 'MASTER') return <Navigate to="/master" replace />
  return <Navigate to="/home" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e1e1e', color: '#faf9f6', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px' },
        success: { iconTheme: { primary: '#4ade80', secondary: '#1e1e1e' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#1e1e1e' } },
      }} />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin */}
        <Route element={<ProtectedRoute roles={['SUPER_ADMIN']}><AppLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/shops" element={<AdminShops />} />
          <Route path="/admin/masters" element={<AdminMasters />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/promo" element={<AdminPromo />} />
        </Route>

        {/* Shop */}
        <Route element={<ProtectedRoute roles={['SHOP_ADMIN']}><AppLayout /></ProtectedRoute>}>
          <Route path="/shop" element={<ShopDashboard />} />
          <Route path="/shop/products" element={<ShopProducts />} />
          <Route path="/shop/orders" element={<ShopOrders />} />
        </Route>

        {/* Master */}
        <Route element={<ProtectedRoute roles={['MASTER']}><AppLayout /></ProtectedRoute>}>
          <Route path="/master" element={<MasterDashboard />} />
          <Route path="/master/services" element={<MasterServices />} />
          <Route path="/master/repairs" element={<MasterRepairs />} />
          <Route path="/master/orders" element={<MasterOrders />} />
        </Route>

        {/* User */}
        <Route element={<ProtectedRoute roles={['USER']}><AppLayout /></ProtectedRoute>}>
          <Route path="/home" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/masters" element={<MastersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
