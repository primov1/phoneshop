import { useState } from 'react'
import { ordersApi, repairsApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { statusBadge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { Order, Repair } from '../../types'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n)
const STEPS = [
  'Qabul qilindi',
  'Diagnostika',
  'Ehtiyot qism kutilmoqda',
  "Ta'mirlanmoqda",
  'Tayyor / Tekshirilmoqda',
  'Mijozga berildi',
]

export function MyOrdersPage() {
  const { data, loading } = useQuery(() => ordersApi.getMy())
  const [repair, setRepair] = useState<Repair | null>(null)
  const [repairLoading, setRepairLoading] = useState(false)

  const orders = (data as Order[]) || []

  const viewRepair = async (orderId: number) => {
    setRepairLoading(true)
    try {
      const res = await repairsApi.getByOrder(orderId)
      setRepair(res.data)
    } catch { /* no repair yet */ } finally { setRepairLoading(false) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="page-title">Buyurtmalarim</div>
        <div className="page-sub">{orders.length} ta buyurtma</div>
      </div>

      <div>
        {orders.map((o) => (
          <div key={o.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--t4)', marginBottom: 4 }}>
                  #{o.id} · {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--w2)' }}>
                  {o.type === 'PRODUCT'
                    ? `${o.product?.emoji || '📦'} ${o.product?.name || 'Mahsulot'}`
                    : `${o.service?.emoji || '🔧'} ${o.service?.name || 'Xizmat'}`}
                </div>
                {o.master && (
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>Usta: {o.master.name}</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                {statusBadge(o.status)}
                <div style={{ fontWeight: 700, fontSize: 13 }}>{fmt(o.amount)} so'm</div>
              </div>
            </div>

            {o.type === 'SERVICE' && o.repair && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--brd)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Ta'mirlash bosqichi:</span>
                    <span className="badge badge-purple">{o.repair.currentStep}/6</span>
                  </div>
                  <button onClick={() => viewRepair(o.id)} className="btn btn-ghost btn-sm">Batafsil</button>
                </div>
                {/* Progress bar */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 3,
                      background: i < (o.repair?.currentStep || 0) ? 'var(--green)' : 'var(--brd2)',
                      transition: 'background .3s',
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>
            Buyurtmalar yo'q
          </div>
        )}
      </div>

      {/* Repair detail modal */}
      <Modal open={!!repair} onClose={() => setRepair(null)} title="Ta'mirlash holati" size="lg">
        {repairLoading ? <PageLoader /> : repair && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                Bosqich <strong style={{ color: 'var(--w2)' }}>{repair.currentStep}/6</strong>
              </span>
              <span className={`badge ${repair.completedAt ? 'badge-green' : 'badge-amber'}`}>
                {repair.completedAt ? 'Tugagan' : 'Jarayonda'}
              </span>
            </div>

            <div>
              {STEPS.map((label, i) => {
                const step = repair.steps?.find((s) => s.step === i + 1)
                const done = step?.status === 'done'
                const current = repair.currentStep === i + 1 && !done
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--r2)', marginBottom: 5, border: '1px solid',
                    borderColor: done ? 'rgba(74,222,128,.2)' : current ? 'rgba(251,191,36,.2)' : 'var(--brd)',
                    background: done ? 'rgba(74,222,128,.04)' : current ? 'rgba(251,191,36,.04)' : 'transparent',
                  }}>
                    <div className={`step-dot${done ? ' done' : current ? ' curr' : ''}`}
                      style={{ marginTop: 1 }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 12,
                        color: done ? 'var(--green)' : current ? 'var(--amber)' : 'var(--t3)',
                        fontWeight: done || current ? 600 : 400,
                      }}>{label}</div>
                      {step?.note && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{step.note}</div>}
                      {step?.completedAt && (
                        <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 2 }}>
                          {new Date(step.completedAt).toLocaleString('uz-UZ')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
