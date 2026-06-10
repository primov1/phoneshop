import { useState } from 'react'
import toast from 'react-hot-toast'
import { productsApi, cartApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { PageLoader } from '../../components/ui/Spinner'
import { Product, ProductType } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n)
const tabs: { label: string; value: ProductType | 'ALL' }[] = [
  { label: 'Barchasi',      value: 'ALL'  },
  { label: '📱 Yangi',      value: 'NEW'  },
  { label: '📦 Ishlatilgan', value: 'USED' },
  { label: '🔧 Ehtiyot qism', value: 'PART' },
]

export function ProductsPage() {
  const [tab, setTab] = useState<ProductType | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<number | null>(null)
  const { data, loading } = useQuery(() => productsApi.getAll(tab !== 'ALL' ? { type: tab } : {}), [tab])

  const products = ((data as Product[]) || []).filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = async (productId: number) => {
    setAdding(productId)
    try {
      await cartApi.add(productId, 1)
      toast.success("Savatga qo'shildi")
    } catch { toast.error('Xatolik') } finally { setAdding(null) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="page-title">Mahsulotlar</div>
        <div className="page-sub">Telefonlar va ehtiyot qismlar</div>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--s2)', border: '1px solid var(--brd)', borderRadius: 'var(--r2)', padding: '7px 12px', minWidth: 200 }}>
          <span style={{ color: 'var(--t4)', fontSize: 13 }}>🔍</span>
          <input
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--w2)', fontSize: 12, width: '100%' }}
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`btn ${tab === t.value ? 'btn-o' : 'btn-ghost'} btn-sm`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {products.map((p) => (
          <div key={p.id} className="pc" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="pc-emoji">{p.emoji || '📱'}</div>
            <div className="pc-name">{p.name}</div>
            <div className="pc-brand">{p.brand}{p.memory ? ` · ${p.memory}` : ''}</div>
            {p.condition && (
              <span className="badge badge-amber" style={{ marginBottom: 6, alignSelf: 'flex-start' }}>{p.condition}</span>
            )}
            {p.description && (
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8, flex: 1 }}>{p.description}</div>
            )}
            {p.shop && <div style={{ fontSize: 10, color: 'var(--t4)', marginBottom: 8 }}>{p.shop.name}</div>}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
              <div>
                <div className="pc-price">{fmt(p.price)} so'm</div>
                <div className="pc-stock">{p.stock} ta qoldi</div>
              </div>
              <button
                onClick={() => addToCart(p.id)}
                disabled={adding === p.id || p.stock === 0}
                className="btn btn-ghost btn-sm"
              >
                🛒
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>
            Mahsulotlar topilmadi
          </div>
        )}
      </div>
    </div>
  )
}
