import { useQuery } from '../../hooks/useQuery'
import { ordersApi, usersApi, shopsApi, mastersApi } from '../../api'
import { StatCard } from '../../components/ui/StatCard'
import { PageLoader } from '../../components/ui/Spinner'
import { statusBadge } from '../../components/ui/Badge'
import { Shop, Master, Order } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m'

export function AdminDashboard() {
  const { data: stats,   loading } = useQuery(() => ordersApi.getStats())
  const { data: uStats }           = useQuery(() => usersApi.getStats())
  const { data: shops }            = useQuery(() => shopsApi.getAll())
  const { data: masters }          = useQuery(() => mastersApi.getAll())
  const { data: orders }           = useQuery(() => ordersApi.getAll())

  if (loading) return <PageLoader />

  const s  = stats  as { total: number; pending: number; done: number; delivered: number; revenue: number } | null
  const us = uStats as { total: number } | null

  return (
    <div>
      <div className="sg sg-4">
        <StatCard label="Jami do'konlar"    value={(shops as Shop[])?.length || 0}   icon="🏪" />
        <StatCard label="Jami ustalar"      value={(masters as Master[])?.length || 0} icon="🔧" />
        <StatCard label="Foydalanuvchilar"  value={us?.total || 0}                   icon="👥" />
        <StatCard label="Jami buyurtmalar"  value={s?.total || 0}                    icon="📋" />
      </div>

      <div className="sg sg-4" style={{ marginBottom: 20 }}>
        <StatCard label="Kutilmoqda"   value={s?.pending || 0}   icon="⏳" />
        <StatCard label="Bajarildi"    value={s?.done || 0}      icon="✅" change="yangi" up />
        <StatCard label="Yetkazildi"   value={s?.delivered || 0} icon="🚚" />
        <StatCard label="Daromad"      value={fmt(s?.revenue || 0)} icon="💰" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Do'konlar */}
        <div className="card">
          <div className="sh"><span className="st">So'nggi do'konlar</span></div>
          <table>
            <thead>
              <tr><th>Do'kon</th><th>Manzil</th><th>Status</th></tr>
            </thead>
            <tbody>
              {(shops as Shop[])?.slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--w2)' }}>{s.name}</td>
                  <td>{s.address}</td>
                  <td>{statusBadge(s.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buyurtmalar */}
        <div className="card">
          <div className="sh"><span className="st">So'nggi buyurtmalar</span></div>
          <table>
            <thead>
              <tr><th>#</th><th>Mijoz</th><th>Summa</th><th>Status</th></tr>
            </thead>
            <tbody>
              {(orders as Order[])?.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td style={{ color: 'var(--t4)' }}>#{o.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--w2)' }}>{o.user?.name}</td>
                  <td>{fmt(o.amount)}</td>
                  <td>{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
