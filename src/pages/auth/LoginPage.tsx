import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../../api'
import { useAuthStore } from '../../store/auth.store'
import { User } from '../../types'

const DEMOS = [
  { label: '🔴 Super Admin', email: 'admin@texmaster.uz', pass: 'admin123' },
  { label: "🏪 Do'kon",      email: 'shop@tm.uz',         pass: 'shop123'  },
  { label: '🔧 Usta',        email: 'master@tm.uz',       pass: 'master123'},
  { label: '👤 Foydalanuvchi', email: 'user@tm.uz',       pass: 'user123'  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'login' | 'demo'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form.email, form.password)
      setAuth(res.data.user as User, res.data.access_token)
      toast.success('Xush kelibsiz!')
      const role = res.data.user.role
      if      (role === 'SUPER_ADMIN') navigate('/admin')
      else if (role === 'SHOP_ADMIN')  navigate('/shop')
      else if (role === 'MASTER')      navigate('/master')
      else                             navigate('/home')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(typeof msg === 'string' ? msg : 'Email yoki parol noto\'g\'ri')
    } finally { setLoading(false) }
  }

  const quickLogin = async (email: string, pass: string) => {
    setLoading(true)
    try {
      const res = await authApi.login(email, pass)
      setAuth(res.data.user as User, res.data.access_token)
      toast.success('Xush kelibsiz!')
      const role = res.data.user.role
      if      (role === 'SUPER_ADMIN') navigate('/admin')
      else if (role === 'SHOP_ADMIN')  navigate('/shop')
      else if (role === 'MASTER')      navigate('/master')
      else                             navigate('/home')
    } catch { toast.error("Xatolik (seed ma'lumotlari kiritilganmi?)") }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-screen">
      <div className="auth-wrap">
        <div className="auth-logo">
          <div className="auth-logo-icon">📱</div>
          <div className="auth-logo-name">TexMaster</div>
          <div className="auth-logo-sub">Telefon do'koni & ta'mirlash</div>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <div className={`auth-tab${tab === 'login' ? ' on' : ''}`} onClick={() => setTab('login')}>
              Kirish
            </div>
            <div className={`auth-tab${tab === 'demo' ? ' on' : ''}`} onClick={() => setTab('demo')}>
              Demo kirish
            </div>
          </div>

          {tab === 'login' ? (
            <>
              <div className="auth-title">Tizimga kirish</div>
              <div className="auth-sub">Akkauntingizga kiring</div>
              <form onSubmit={handleSubmit}>
                <div className="fg">
                  <label className="fl">Email manzil</label>
                  <input className="fi" type="email" placeholder="email@example.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="fg">
                  <label className="fl">Parol</label>
                  <input className="fi" type="password" placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? 'Kirish...' : 'Kirish →'}
                </button>
              </form>
              <div className="auth-divider">yoki</div>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)' }}>
                Akkaunt yo'qmi?{' '}
                <Link to="/register" style={{ color: 'var(--w3)' }}>Ro'yxatdan o'tish</Link>
              </p>
            </>
          ) : (
            <>
              <div className="auth-title">Demo kirish</div>
              <div className="auth-sub">Rol tanlang va bir bosishda kiring</div>
              <div className="demo-btns">
                {DEMOS.map((d) => (
                  <button key={d.label} className="demo-btn" onClick={() => quickLogin(d.email, d.pass)} disabled={loading}>
                    {d.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 7, flexWrap: 'wrap' as const }}>
                {DEMOS.map((d) => (
                  <div key={d.label} style={{ flex: '1 1 80px', padding: '9px 7px', background: 'var(--s2)', borderRadius: 'var(--r3)', textAlign: 'center', border: '1px solid var(--brd)' }}>
                    <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 600 }}>{d.email}</div>
                    <div style={{ fontSize: 9, color: 'var(--t4)', marginTop: 2 }}>{d.pass}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
