import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Toaster } from 'react-hot-toast'

const titles: Record<string, string> = {
  '/admin':          'Dashboard',
  '/admin/shops':    "Do'konlar",
  '/admin/masters':  'Ustalar',
  '/admin/users':    'Foydalanuvchilar',
  '/admin/orders':   'Buyurtmalar',
  '/admin/promo':    'Promo Kodlar',
  '/shop':           'Dashboard',
  '/shop/products':  'Mahsulotlar',
  '/shop/orders':    'Buyurtmalar',
  '/master':         'Dashboard',
  '/master/services':'Xizmatlarim',
  '/master/repairs': "Ta'mirlashlar",
  '/master/orders':  'Buyurtmalar',
  '/home':           'Mahsulotlar',
  '/services':       'Xizmatlar',
  '/cart':           'Savat',
  '/my-orders':      'Buyurtmalarim',
  '/masters':        'Ustalar',
}

export function AppLayout() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'TexMaster'

  return (
    <div className="main-app">
      <Sidebar />
      <div className="main-area">
        <div className="topbar">
          <span className="tb-title">{title}</span>
          <div className="tb-srch">
            <span style={{ color: 'var(--t4)', fontSize: 13 }}>🔍</span>
            <input placeholder="Qidirish..." />
          </div>
          <div className="tb-acts">
            <div className="ibtn" title="Bildirishnomalar">🔔</div>
            <div className="ibtn" title="Sozlamalar">⚙️</div>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--s2)',
            color: 'var(--w2)',
            border: '1px solid var(--brd2)',
            borderRadius: 'var(--r2)',
            fontSize: 12,
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#141414' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#141414' } },
        }}
      />
    </div>
  )
}
