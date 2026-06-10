import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

interface NavItem { label: string; path: string; icon: string }

const adminNav: NavItem[] = [
  { label: 'Dashboard',        path: '/admin',         icon: '⬡' },
  { label: "Do'konlar",        path: '/admin/shops',   icon: '🏪' },
  { label: 'Ustalar',          path: '/admin/masters', icon: '🔧' },
  { label: 'Foydalanuvchilar', path: '/admin/users',   icon: '👥' },
  { label: 'Buyurtmalar',      path: '/admin/orders',  icon: '📋' },
  { label: 'Promo Kodlar',     path: '/admin/promo',   icon: '🏷' },
]
const shopNav: NavItem[] = [
  { label: 'Dashboard',   path: '/shop',          icon: '⬡' },
  { label: 'Mahsulotlar', path: '/shop/products', icon: '📦' },
  { label: 'Buyurtmalar', path: '/shop/orders',   icon: '📋' },
]
const masterNav: NavItem[] = [
  { label: 'Dashboard',      path: '/master',          icon: '⬡' },
  { label: 'Xizmatlarim',    path: '/master/services', icon: '🔧' },
  { label: "Ta'mirlashlar",  path: '/master/repairs',  icon: '⚙️' },
  { label: 'Buyurtmalar',    path: '/master/orders',   icon: '📋' },
]
const userNav: NavItem[] = [
  { label: 'Mahsulotlar',   path: '/home',      icon: '📱' },
  { label: 'Xizmatlar',     path: '/services',  icon: '🔧' },
  { label: 'Savat',         path: '/cart',      icon: '🛒' },
  { label: 'Buyurtmalarim', path: '/my-orders', icon: '📋' },
  { label: 'Ustalar',       path: '/masters',   icon: '⭐' },
]

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SHOP_ADMIN:  "Do'kon Admin",
  MASTER:      'Usta',
  USER:        'Foydalanuvchi',
}
const roleTagClass: Record<string, string> = {
  SUPER_ADMIN: 'rt-super',
  SHOP_ADMIN:  'rt-shop',
  MASTER:      'rt-master',
  USER:        'rt-user',
}
const avClass: Record<string, string> = {
  SUPER_ADMIN: 'av-super',
  SHOP_ADMIN:  'av-shop',
  MASTER:      'av-master',
  USER:        'av-user',
}

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const navItems = {
    SUPER_ADMIN: adminNav,
    SHOP_ADMIN:  shopNav,
    MASTER:      masterNav,
    USER:        userNav,
  }[user?.role || 'USER'] || userNav

  const role = user?.role || 'USER'

  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-logo-wrap">
          <div className="sb-logo-icon">📱</div>
          <div>
            <div className="sb-logo-name">TexMaster</div>
            <div className="sb-logo-sub">Platform</div>
          </div>
        </div>
      </div>

      <span className={`role-tag ${roleTagClass[role]}`}>
        {roleLabels[role]}
      </span>

      <nav className="sb-nav">
        <div className="sn-lbl">Menyu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length <= 2}
            className={({ isActive }) => `ni${isActive ? ' on' : ''}`}
          >
            <span className="ni-ic">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="uc">
          <div className={`av ${avClass[role]}`}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="uc-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div className="uc-role">{user?.email}</div>
          </div>
          <button
            className="logout-btn"
            onClick={() => { logout(); navigate('/login') }}
            title="Chiqish"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  )
}
