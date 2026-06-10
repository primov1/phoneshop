import toast from 'react-hot-toast'
import { usersApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Badge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { User } from '../../types'

const roleMap: Record<string, { label: string; variant: 'green' | 'blue' | 'purple' | 'amber' }> = {
  SUPER_ADMIN: { label: 'Super Admin', variant: 'green'  },
  SHOP_ADMIN:  { label: "Do'kon",      variant: 'blue'   },
  MASTER:      { label: 'Usta',        variant: 'purple' },
  USER:        { label: 'User',        variant: 'amber'  },
}

export function AdminUsers() {
  const { data, loading, refetch } = useQuery(() => usersApi.getAll())
  const users = (data as User[]) || []

  const del = async (id: number) => {
    if (!confirm("O'chirilsinmi?")) return
    try { await usersApi.remove(id); toast.success("O'chirildi"); refetch() } catch { toast.error('Xatolik') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="sh"><span className="st">Foydalanuvchilar ({users.length})</span></div>
      <div className="tw">
        <table>
          <thead><tr><th>Ism</th><th>Telefon</th><th>Rol</th><th>Buyurtmalar</th><th>Sana</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => {
              const r = roleMap[u.role] || { label: u.role, variant: 'amber' as const }
              return (
                <tr key={u.id}>
                  <td><div style={{ fontWeight: 600, color: 'var(--w2)' }}>{u.name}</div><div style={{ fontSize: 10, color: 'var(--t4)' }}>{u.email}</div></td>
                  <td>{u.tel}</td>
                  <td><Badge variant={r.variant}>{r.label}</Badge></td>
                  <td>{(u as unknown as { _count?: { orders: number } })._count?.orders || 0}</td>
                  <td style={{ fontSize: 10, color: 'var(--t4)' }}>{new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
                  <td><button className="btn btn-red btn-sm" onClick={() => del(u.id)}>🗑</button></td>
                </tr>
              )
            })}
            {users.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--t4)', padding: 32 }}>Foydalanuvchilar yo'q</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
