import { useState } from 'react'
import toast from 'react-hot-toast'
import { servicesApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/Spinner'
import { Service } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n)
const emptyForm = { name: '', price: 0, duration: 60, emoji: '🔧', description: '', isActive: true }

export function MasterServices() {
  const { data, loading, refetch } = useQuery(() => servicesApi.getMy())
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const services = (data as Service[]) || []
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, price: +form.price, duration: +form.duration }
      if (editId) { await servicesApi.update(editId, payload); toast.success('Yangilandi') }
      else { await servicesApi.create(payload); toast.success("Qo'shildi") }
      setOpen(false); setEditId(null); setForm(emptyForm); refetch()
    } catch { toast.error('Xatolik') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirilsinmi?")) return
    try { await servicesApi.remove(id); toast.success("O'chirildi"); refetch() } catch { toast.error('Xatolik') }
  }

  const openEdit = (s: Service) => {
    setEditId(s.id)
    setForm({ name: s.name, price: s.price, duration: s.duration, emoji: s.emoji || '🔧', description: s.description || '', isActive: s.isActive })
    setOpen(true)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh" style={{ marginBottom: 16 }}>
        <div>
          <div className="page-title">Xizmatlarim</div>
          <div className="page-sub">{services.length} ta xizmat</div>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true) }} className="btn btn-p">
          ＋ Xizmat qo'shish
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {services.map((s) => (
          <div key={s.id} className="pc">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 26 }}>{s.emoji || '🔧'}</span>
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => openEdit(s)} className="btn btn-ghost btn-sm">✏️</button>
                <button onClick={() => handleDelete(s.id)} className="btn btn-red btn-sm">🗑</button>
              </div>
            </div>
            <div className="pc-name">{s.name}</div>
            {s.description && (
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, marginBottom: 6 }}>{s.description}</div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div className="pc-price">{fmt(s.price)} so'm</div>
              <span className={`badge ${s.isActive ? 'badge-green' : 'badge-gray'}`}>
                ⏱ {s.duration} daq
              </span>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>
            Xizmatlar yo'q
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Xizmat tahrirlash' : 'Yangi xizmat'}>
        <form onSubmit={handleSave}>
          <div className="fg"><label className="fl">Nomi</label><input className="fi" value={form.name} onChange={f('name')} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="fg"><label className="fl">Narxi (so'm)</label><input type="number" className="fi" value={form.price} onChange={f('price')} required /></div>
            <div className="fg"><label className="fl">Davomiyligi (daq)</label><input type="number" className="fi" value={form.duration} onChange={f('duration')} /></div>
          </div>
          <div className="fg"><label className="fl">Emoji</label><input className="fi" value={form.emoji} onChange={f('emoji')} /></div>
          <div className="fg"><label className="fl">Tavsif</label><textarea className="fi" style={{ resize: 'none' }} rows={2} value={form.description} onChange={f('description')} /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Bekor</button>
            <button type="submit" disabled={saving} className="btn btn-p" style={{ flex: 1, justifyContent: 'center' }}>{saving ? '...' : 'Saqlash'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
