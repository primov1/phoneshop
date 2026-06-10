import { useState } from 'react'
import toast from 'react-hot-toast'
import { promoApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { PromoCode } from '../../types'

export function AdminPromo() {
  const { data, loading, refetch } = useQuery(() => promoApi.getAll())
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ code: '', discount: 10, maxUses: 100, expiresAt: '' })
  const [saving, setSaving] = useState(false)
  const promos = (data as PromoCode[]) || []

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try { await promoApi.create({ ...form, code: form.code.toUpperCase(), discount: +form.discount, maxUses: +form.maxUses }); toast.success('Yaratildi'); setOpen(false); setForm({ code: '', discount: 10, maxUses: 100, expiresAt: '' }); refetch() }
    catch { toast.error('Xatolik') } finally { setSaving(false) }
  }
  const toggle = async (id: number) => { try { await promoApi.toggle(id); refetch() } catch { toast.error('Xatolik') } }
  const del = async (id: number) => {
    if (!confirm("O'chirilsinmi?")) return
    try { await promoApi.remove(id); refetch(); toast.success("O'chirildi") } catch { toast.error('Xatolik') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh">
        <span className="st">Promo Kodlar ({promos.length})</span>
        <button className="btn btn-p" onClick={() => setOpen(true)}>＋ Yaratish</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {promos.map((p) => (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2, color: 'var(--amber)', fontSize: 13 }}>{p.code}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{p.discount}% chegirma</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span onClick={() => toggle(p.id)} style={{ cursor: 'pointer' }}>
                  <Badge variant={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'Faol' : 'Nofaol'}</Badge>
                </span>
                <button className="btn btn-red btn-sm" onClick={() => del(p.id)}>🗑</button>
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--t4)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ishlatilgan: {p.usedCount}/{p.maxUses}</span>
              {p.expiresAt && <span>Tugaydi: {new Date(p.expiresAt).toLocaleDateString('uz-UZ')}</span>}
            </div>
            <div style={{ marginTop: 8, background: 'var(--s3)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((p.usedCount / p.maxUses) * 100, 100)}%`, height: '100%', background: 'var(--green)', borderRadius: 4 }} />
            </div>
          </div>
        ))}
        {promos.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--t4)', padding: 40, gridColumn: 'span 3' }}>Promo kodlar yo'q</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Yangi promo kod">
        <form onSubmit={save}>
          <div className="fg"><label className="fl">Kod</label><input className="fi" style={{ textTransform: 'uppercase' }} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="fg"><label className="fl">Chegirma (%)</label><input type="number" min={1} max={100} className="fi" value={form.discount} onChange={(e) => setForm({ ...form, discount: +e.target.value })} required /></div>
            <div className="fg"><label className="fl">Max foydalanish</label><input type="number" min={1} className="fi" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: +e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Tugash sanasi</label><input type="date" className="fi" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>Bekor</button>
            <button type="submit" className="btn btn-p" style={{ flex: 1 }} disabled={saving}>{saving ? '...' : 'Yaratish'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
