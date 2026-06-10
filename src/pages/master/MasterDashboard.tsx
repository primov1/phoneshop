import { useQuery } from '../../hooks/useQuery'
import { mastersApi } from '../../api'
import { StatCard } from '../../components/ui/StatCard'
import { PageLoader } from '../../components/ui/Spinner'
import { statusBadge } from '../../components/ui/Badge'
import { Order } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m'

export function MasterDashboard() {
  const { data, loading } = useQuery(() => mastersApi.getDashboard())
  if (loading) return <PageLoader />

  const d = data as {
    master: { name: string; specialty: string; rating: number }
    stats: { totalOrders: number; pendingOrders: number; doneOrders: number; activeRepairs: number }
    recentOrders: Order[]
  } | null
  if (!d) return null

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div className="page-title">{d.master.name}</div>
        <div className="page-sub">{d.master.specialty} · ⭐ {d.master.rating}</div>
      </div>

      <div className="sg sg-4">
        <StatCard label="Jami buyurtmalar" value={d.stats.totalOrders}   icon="🔧" />
        <StatCard label="Kutilmoqda"        value={d.stats.pendingOrders} icon="⏳" />
        <StatCard label="Bajarildi"         value={d.stats.doneOrders}    icon="✅" />
        <StatCard label="Faol ta'mirlash"   value={d.stats.activeRepairs} icon="⚙️" />
      </div>

      <div className="sh"><span className="st">So'nggi buyurtmalar</span></div>
      <div className="tw">
        <table>
          <thead><tr><th>#</th><th>Mijoz</th><th>Xizmat</th><th>Summa</th><th>Status</th></tr></thead>
          <tbody>
            {d.recentOrders.map((o) => (
              <tr key={o.id}>
                <td style={{ color: 'var(--t4)' }}>#{o.id}</td>
                <td><div style={{ fontWeight: 600, color: 'var(--w2)' }}>{o.user?.name}</div><div style={{ fontSize: 10, color: 'var(--t4)' }}>{o.user?.tel}</div></td>
                <td style={{ color: 'var(--t3)' }}>{o.service?.emoji} {o.service?.name}</td>
                <td style={{ fontWeight: 600, color: 'var(--w2)' }}>{fmt(o.amount)}</td>
                <td>{statusBadge(o.status)}</td>
              </tr>
            ))}
            {d.recentOrders.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--t4)', padding: 28 }}>Buyurtmalar yo'q</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
