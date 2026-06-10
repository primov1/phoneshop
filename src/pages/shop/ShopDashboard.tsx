import { useQuery } from '../../hooks/useQuery'
import { shopsApi } from '../../api'
import { StatCard } from '../../components/ui/StatCard'
import { PageLoader } from '../../components/ui/Spinner'
import { statusBadge } from '../../components/ui/Badge'
import { Order } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m'

export function ShopDashboard() {
  const { data, loading } = useQuery(() => shopsApi.getDashboard())
  if (loading) return <PageLoader />
  const d = data as { shop: { name: string; address: string }; stats: { newCount: number; usedCount: number; partsCount: number }; orders: Order[] } | null
  if (!d) return null

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div className="page-title">{d.shop.name}</div>
        <div className="page-sub">{d.shop.address}</div>
      </div>
      <div className="sg sg-3">
        <StatCard label="Yangi telefonlar" value={d.stats.newCount}   icon="📱" />
        <StatCard label="Ishlatilgan"       value={d.stats.usedCount}  icon="📦" />
        <StatCard label="Ehtiyot qismlar"   value={d.stats.partsCount} icon="🔩" />
      </div>
      <div className="sh"><span className="st">So'nggi buyurtmalar</span></div>
      <div className="tw">
        <table>
          <thead><tr><th>#</th><th>Mijoz</th><th>Summa</th><th>Status</th><th>Sana</th></tr></thead>
          <tbody>
            {d.orders.map((o) => (
              <tr key={o.id}>
                <td style={{ color: 'var(--t4)' }}>#{o.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--w2)' }}>{o.user?.name}</td>
                <td>{fmt(o.amount)}</td>
                <td>{statusBadge(o.status)}</td>
                <td style={{ fontSize: 10, color: 'var(--t4)' }}>{new Date(o.createdAt).toLocaleDateString('uz-UZ')}</td>
              </tr>
            ))}
            {d.orders.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--t4)', padding: 28 }}>Buyurtmalar yo'q</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
