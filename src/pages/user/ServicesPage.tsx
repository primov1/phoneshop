import { useState } from 'react'
import toast from 'react-hot-toast'
import { servicesApi, ordersApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/Spinner'
import { Service } from '../../types'
import { useNavigate } from 'react-router-dom'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n)

export function ServicesPage() {
  const { data, loading } = useQuery(() => servicesApi.getAll())
  const [selected, setSelected] = useState<Service | null>(null)
  const [ordering, setOrdering] = useState(false)
  const navigate = useNavigate()

  const services = (data as Service[]) || []

  const handleOrder = async () => {
    if (!selected) return
    setOrdering(true)
    try {
      await ordersApi.create({ type: 'SERVICE', serviceId: selected.id, masterId: selected.masterId, amount: selected.price })
      toast.success('Xizmat buyurtmasi berildi!')
      setSelected(null)
      navigate('/my-orders')
    } catch { toast.error('Xatolik yuz berdi') } finally { setOrdering(false) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="page-title">Xizmatlar</div>
        <div className="page-sub">Telefon ta'mirlash xizmatlari</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {services.map((s) => (
          <div key={s.id} className="pc" onClick={() => setSelected(s)}>
            <div className="pc-emoji">{s.emoji || '🔧'}</div>
            <div className="pc-name">{s.name}</div>
            {s.description && (
              <div style={{ fontSize: 11, color: 'var(--t3)', margin: '4px 0 8px', lineHeight: 1.4 }}>{s.description}</div>
            )}
            {s.master && (
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 10 }}>
                ⭐ {s.master.rating} · {s.master.name}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <div className="pc-price">{fmt(s.price)} so'm</div>
              <div style={{ fontSize: 10, color: 'var(--t4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                ⏱ {s.duration} daq
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>
            Xizmatlar topilmadi
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Xizmat buyurtmasi">
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>{selected.emoji || '🔧'}</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--w2)', marginBottom: 3 }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>{selected.description}</div>
              </div>
            </div>
            <div className="card-sm" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: 'var(--t3)' }}>Narxi</span>
                <span style={{ fontWeight: 600, color: 'var(--w2)' }}>{fmt(selected.price)} so'm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: selected.master ? 8 : 0 }}>
                <span style={{ color: 'var(--t3)' }}>Davomiyligi</span>
                <span>{selected.duration} daqiqa</span>
              </div>
              {selected.master && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--t3)' }}>Usta</span>
                  <span>{selected.master.name} (⭐ {selected.master.rating})</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSelected(null)} className="btn btn-ghost" style={{ flex: 1 }}>Bekor</button>
              <button onClick={handleOrder} disabled={ordering} className="btn btn-p" style={{ flex: 1 }}>
                {ordering ? '...' : 'Buyurtma berish'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
