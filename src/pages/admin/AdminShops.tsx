import { useState } from 'react'
import toast from 'react-hot-toast'
import { shopsApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { statusBadge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { Shop } from '../../types'

export function AdminShops() {
  const { data, loading, refetch } = useQuery(() => shopsApi.getAll())
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', tel: '', email: '', address: '', type: 'retail' })
  const [saving, setSaving] = useState(false)
  const shops = (data as Shop[]) || []

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try { await shopsApi.create(form); toast.success("Do'kon qo'shildi"); setOpen(false); setForm({ name: '', tel: '', email: '', address: '', type: 'retail' }); refetch() }
    catch { toast.error('Xatolik') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirilsinmi?")) return
    try { await shopsApi.remove(id); toast.success("O'chirildi"); refetch() } catch { toast.error('Xatolik') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh">
        <span className="st">Barcha do'konlar ({shops.length})</span>
        <button className="btn btn-p" onClick={() => setOpen(true)}>＋ Qo'shish</button>
      </div>

      <div className="tw">
        <table>
          <thead><tr><th>Do'kon nomi</th><th>Egasi</th><th>Telefon</th><th>Mahsulotlar</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {shops.map((s) => (
              <tr key={s.id}>
                <td><div style={{ fontWeight: 600, color: 'var(--w2)' }}>{s.name}</div><div style={{ fontSize: 10, color: 'var(--t4)' }}>{s.address}</div></td>
                <td>{s.owner?.name || '—'}</td>
                <td>{s.tel}</td>
                <td>{s._count?.products || 0}</td>
                <td>{statusBadge(s.status)}</td>
                <td><button className="btn btn-red btn-sm" onClick={() => handleDelete(s.id)}>🗑</button></td>
              </tr>
            ))}
            {shops.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--t4)', padding: 32 }}>Do'konlar yo'q</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Yangi do'kon qo'shish">
        <form onSubmit={handleCreate}>
          <div className="fg"><label className="fl">Do'kon nomi</label><input className="fi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="fg"><label className="fl">Telefon</label><input className="fi" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} required /></div>
          <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="fg"><label className="fl">Manzil</label><input className="fi" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>Bekor</button>
            <button type="submit" className="btn btn-p" style={{ flex: 1 }} disabled={saving}>{saving ? '...' : 'Saqlash'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
