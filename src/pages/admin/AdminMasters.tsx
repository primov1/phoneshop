import toast from 'react-hot-toast'
import { mastersApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { statusBadge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { Master } from '../../types'

export function AdminMasters() {
  const { data, loading, refetch } = useQuery(() => mastersApi.getAll())
  const masters = (data as Master[]) || []

  const del = async (id: number) => {
    if (!confirm("O'chirilsinmi?")) return
    try { await mastersApi.remove(id); toast.success("O'chirildi"); refetch() } catch { toast.error('Xatolik') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh"><span className="st">Ustalar ({masters.length})</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {masters.map((m) => (
          <div key={m.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--w2)' }}>{m.name}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{m.specialty}</div>
              </div>
              <button className="btn btn-red btn-sm" onClick={() => del(m.id)}>🗑</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ color: 'var(--amber)' }}>⭐</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.rating}</span>
              <span style={{ fontSize: 10, color: 'var(--t4)' }}>({m._count?.reviews || 0} sharh)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {statusBadge(m.status)}
              <span style={{ fontSize: 10, color: 'var(--t4)' }}>{m._count?.orders || 0} buyurtma</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 8 }}>{m.tel}</div>
          </div>
        ))}
        {masters.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--t4)', padding: 40, gridColumn: 'span 3' }}>Ustalar yo'q</div>}
      </div>
    </div>
  )
}
