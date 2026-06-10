import { useState } from 'react'
import toast from 'react-hot-toast'
import { productsApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { useAuthStore } from '../../store/auth.store'
import { Modal } from '../../components/ui/Modal'

import { PageLoader } from '../../components/ui/Spinner'
import { Product, ProductType } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n)
const TABS: { label: string; value: ProductType | 'ALL' }[] = [
  { label: 'Barchasi', value: 'ALL' },
  { label: '📱 Yangi', value: 'NEW' },
  { label: '📦 Ishlatilgan', value: 'USED' },
  { label: '🔩 Ehtiyot qism', value: 'PART' },
]
const EMPTY = { name: '', brand: '', price: 0, stock: 1, type: 'NEW' as ProductType, memory: '', emoji: '📱', color: '', description: '', condition: '' }

export function ShopProducts() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<ProductType | 'ALL'>('ALL')
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const shopId = user?.shop?.id
  const { data, loading, refetch } = useQuery(() => productsApi.getShopProducts(shopId!), [shopId])
  const all = (data as Product[]) || []
  const products = all.filter((p) => tab === 'ALL' || p.type === tab)

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value })

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, price: +form.price, stock: +form.stock }
      if (editId) { await productsApi.update(editId, payload); toast.success('Yangilandi') }
      else        { await productsApi.create(payload);         toast.success("Qo'shildi") }
      setOpen(false); setEditId(null); setForm(EMPTY); refetch()
    } catch { toast.error('Xatolik') } finally { setSaving(false) }
  }

  const openEdit = (p: Product) => {
    setEditId(p.id)
    setForm({ name: p.name, brand: p.brand, price: p.price, stock: p.stock, type: p.type, memory: p.memory || '', emoji: p.emoji || '📱', color: p.color || '', description: p.description || '', condition: p.condition || '' })
    setOpen(true)
  }

  const del = async (id: number) => {
    if (!confirm("O'chirilsinmi?")) return
    try { await productsApi.remove(id); toast.success("O'chirildi"); refetch() } catch { toast.error('Xatolik') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh">
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map((t) => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`btn btn-sm ${tab === t.value ? 'btn-p' : 'btn-ghost'}`}>{t.label}</button>
          ))}
        </div>
        <button className="btn btn-p" onClick={() => { setEditId(null); setForm(EMPTY); setOpen(true) }}>＋ Qo'shish</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {products.map((p) => (
          <div key={p.id} className="pc">
            <div className="pc-emoji">{p.emoji}</div>
            <div className="pc-name">{p.name}</div>
            <div className="pc-brand">{p.brand}{p.memory ? ` · ${p.memory}` : ''}</div>
            {p.condition && <span className="badge badge-amber" style={{ marginBottom: 6 }}>{p.condition}</span>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div>
                <div className="pc-price">{fmt(p.price)} so'm</div>
                <div className="pc-stock">{p.stock} ta qoldi</div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                <button className="btn btn-red btn-sm" onClick={() => del(p.id)}>🗑</button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--t4)', padding: 40, gridColumn: 'span 4' }}>Mahsulotlar yo'q</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Tahrirlash' : 'Yangi mahsulot'} size="lg">
        <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="fg" style={{ gridColumn: 'span 2' }}><label className="fl">Nomi</label><input className="fi" value={form.name} onChange={f('name')} required /></div>
          <div className="fg"><label className="fl">Brand</label><input className="fi" value={form.brand} onChange={f('brand')} required /></div>
          <div className="fg"><label className="fl">Turi</label><select className="fi" value={form.type} onChange={f('type')}><option value="NEW">Yangi</option><option value="USED">Ishlatilgan</option><option value="PART">Ehtiyot qism</option></select></div>
          <div className="fg"><label className="fl">Narxi (so'm)</label><input type="number" className="fi" value={form.price} onChange={f('price')} required /></div>
          <div className="fg"><label className="fl">Stok</label><input type="number" className="fi" value={form.stock} onChange={f('stock')} /></div>
          <div className="fg"><label className="fl">Xotira</label><input className="fi" placeholder="256GB" value={form.memory} onChange={f('memory')} /></div>
          <div className="fg"><label className="fl">Rang</label><input className="fi" value={form.color} onChange={f('color')} /></div>
          <div className="fg"><label className="fl">Emoji</label><input className="fi" value={form.emoji} onChange={f('emoji')} /></div>
          {form.type === 'USED' && <div className="fg"><label className="fl">Holati</label><input className="fi" placeholder="A, A+, B..." value={form.condition} onChange={f('condition')} /></div>}
          <div className="fg" style={{ gridColumn: 'span 2' }}><label className="fl">Tavsif</label><textarea className="fi" rows={2} value={form.description} onChange={f('description')} /></div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>Bekor</button>
            <button type="submit" className="btn btn-p" style={{ flex: 1 }} disabled={saving}>{saving ? '...' : 'Saqlash'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
