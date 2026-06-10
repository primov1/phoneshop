import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../../api'
import { useAuthStore } from '../../store/auth.store'
import { User } from '../../types'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ name: '', tel: '', email: '', password: '', address: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.register(form)
      setAuth(res.data.user as User, res.data.access_token)
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!")
      navigate('/home')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(typeof msg === 'string' ? msg : 'Xatolik yuz berdi')
    } finally { setLoading(false) }
  }

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="auth-screen">
      <div className="auth-wrap">
        <div className="auth-logo">
          <div className="auth-logo-icon">📱</div>
          <div className="auth-logo-name">TexMaster</div>
          <div className="auth-logo-sub">Yangi akkaunt</div>
        </div>

        <div className="auth-card">
          <div className="auth-title">Ro'yxatdan o'tish</div>
          <div className="auth-sub">Yangi akkaunt yarating</div>
          <form onSubmit={handleSubmit}>
            <div className="fg"><label className="fl">Ism familiya</label><input className="fi" placeholder="Dilnoza Karimova" value={form.name} onChange={f('name')} required /></div>
            <div className="fg"><label className="fl">Telefon</label><input className="fi" placeholder="+998901234567" value={form.tel} onChange={f('tel')} required /></div>
            <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="email@example.com" value={form.email} onChange={f('email')} required /></div>
            <div className="fg"><label className="fl">Parol</label><input className="fi" type="password" placeholder="Kamida 6 ta belgi" value={form.password} onChange={f('password')} required /></div>
            <div className="fg"><label className="fl">Manzil</label><input className="fi" placeholder="Toshkent, Chilonzor" value={form.address} onChange={f('address')} /></div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Yaratilmoqda...' : 'Akkaunt yaratish →'}
            </button>
          </form>
          <div className="auth-divider">yoki</div>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)' }}>
            Akkaunt bormi?{' '}
            <Link to="/login" style={{ color: 'var(--w3)' }}>Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
