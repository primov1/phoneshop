import { ordersApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { statusBadge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { Order } from '../../types'
import toast from 'react-hot-toast'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m'
const ALL_STATUSES = ['PENDING','CONFIRMED','SHIPPING','IN_PROGRESS','DONE','DELIVERED','CANCELLED']

export function AdminOrders() {
  const { data, loading, refetch } = useQuery(() => ordersApi.getAll())
  const orders = (data as Order[]) || []

  const upd = async (id: number, status: string) => {
    try { await ordersApi.updateStatus(id, status); toast.success('Yangilandi'); refetch() }
    catch { toast.error('Xatolik') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh"><span className="st">Buyurtmalar ({orders.length})</span></div>
      <div className="tw">
        <table>
          <thead><tr><th>#</th><th>Mijoz</th><th>Turi</th><th>Summa</th><th>Status</th><th>Sana</th><th>Amal</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ color: 'var(--t4)' }}>#{o.id}</td>
                <td><div style={{ fontWeight: 600, color: 'var(--w2)' }}>{o.user?.name}</div><div style={{ fontSize: 10, color: 'var(--t4)' }}>{o.user?.tel}</div></td>
                <td style={{ fontSize: 11 }}>{o.type === 'PRODUCT' ? '📦 Mahsulot' : '🔧 Xizmat'}</td>
                <td style={{ fontWeight: 600, color: 'var(--w2)' }}>{fmt(o.amount)}</td>
                <td>{statusBadge(o.status)}</td>
                <td style={{ fontSize: 10, color: 'var(--t4)' }}>{new Date(o.createdAt).toLocaleDateString('uz-UZ')}</td>
                <td>
                  <select value={o.status} onChange={(e) => upd(o.id, e.target.value)}
                    style={{ background: 'var(--s3)', border: '1px solid var(--brd)', borderRadius: 'var(--r3)', color: 'var(--t2)', fontSize: 10, padding: '3px 6px', outline: 'none' }}>
                    {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--t4)', padding: 32 }}>Buyurtmalar yo'q</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
