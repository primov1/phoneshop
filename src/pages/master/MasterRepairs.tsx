import { useState } from 'react'
import toast from 'react-hot-toast'
import { repairsApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/Spinner'
import { Repair } from '../../types'

const STEPS = ['Qabul qilindi', 'Diagnostika', 'Ehtiyot qism kutilmoqda', "Ta'mirlanmoqda", 'Tayyor / Tekshirilmoqda', 'Mijozga berildi']

type RepairWithOrder = Repair & { order?: { user?: { name: string }; service?: { name: string } } }

export function MasterRepairs() {
  const { data, loading, refetch } = useQuery(() => repairsApi.getAll())
  const [selected, setSelected] = useState<Repair | null>(null)
  const [note, setNote] = useState('')
  const [advancing, setAdvancing] = useState(false)

  const repairs = (data as RepairWithOrder[]) || []

  const handleAdvance = async () => {
    if (!selected) return
    setAdvancing(true)
    try {
      await repairsApi.advance(selected.id, { stepNote: note || undefined })
      toast.success('Bosqich oldinga siljitildi')
      setSelected(null); setNote(''); refetch()
    } catch { toast.error('Xatolik') } finally { setAdvancing(false) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="page-title">Ta'mirlashlar</div>
        <div className="page-sub">{repairs.length} ta ta'mirlash</div>
      </div>

      <div>
        {repairs.map((r) => (
          <div key={r.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--w2)' }}>Ta'mirlash #{r.id}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                  {r.order?.user?.name} · {r.order?.service?.name}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${r.completedAt ? 'badge-green' : 'badge-amber'}`}>
                  {r.completedAt ? 'Tugagan' : 'Jarayonda'}
                </span>
                {!r.completedAt && (
                  <button onClick={() => setSelected(r)} className="btn btn-ghost btn-sm">
                    ▶ Oldinga
                  </button>
                )}
              </div>
            </div>

            {/* Step progress */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {STEPS.map((label, i) => {
                const stepNum = i + 1
                const isDone = r.steps?.find((s) => s.step === stepNum)?.status === 'done'
                const isCurrent = r.currentStep === stepNum
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div className={`step-dot${isDone ? ' done' : isCurrent ? ' curr' : ''}`}>
                        {isDone ? '✓' : stepNum}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--t4)', marginTop: 4, textAlign: 'center', lineHeight: 1.3 }}>
                        {label}
                      </div>
                    </div>
                    {i < 5 && (
                      <div className={`step-connector${isDone ? ' done' : ''}`} style={{ flex: 1 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {repairs.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>
            Ta'mirlashlar yo'q
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => { setSelected(null); setNote('') }} title="Bosqichni oldinga siljitish">
        {selected && (
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>
              Joriy bosqich:{' '}
              <strong style={{ color: 'var(--amber)' }}>{selected.currentStep}</strong>
              {' → '}
              <strong style={{ color: 'var(--green)' }}>{selected.currentStep + 1}</strong>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 14 }}>
              {STEPS[selected.currentStep] || 'Yakunlash'}
            </div>
            <div className="fg">
              <label className="fl">Izoh (ixtiyoriy)</label>
              <textarea
                className="fi"
                style={{ resize: 'none' }}
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bajardigan ish haqida qisqacha yozin..."
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => { setSelected(null); setNote('') }} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                Bekor
              </button>
              <button onClick={handleAdvance} disabled={advancing} className="btn btn-green" style={{ flex: 1, justifyContent: 'center' }}>
                {advancing ? '...' : '✓ Tasdiqlash'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
