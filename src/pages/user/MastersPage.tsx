import { useState } from 'react'
import toast from 'react-hot-toast'
import { mastersApi, reviewsApi } from '../../api'
import { useQuery } from '../../hooks/useQuery'
import { Modal } from '../../components/ui/Modal'
import { statusBadge } from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'
import { Master } from '../../types'

export function MastersPage() {
  const { data, loading } = useQuery(() => mastersApi.getAll())
  const [selected, setSelected] = useState<Master | null>(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const masters = (data as Master[]) || []

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    try {
      await reviewsApi.create({ masterId: selected.id, ...reviewForm })
      toast.success('Sharh qoldirildi!')
      setSelected(null)
      setReviewForm({ rating: 5, comment: '' })
    } catch { toast.error('Xatolik') } finally { setSubmitting(false) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="page-title">Ustalar</div>
        <div className="page-sub">Ta'mirlash ustalarimiz</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {masters.map((m) => (
          <div key={m.id} className="pc">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--r2)',
                background: 'rgba(192,132,252,.08)', border: '1px solid rgba(192,132,252,.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>🔧</div>
              {statusBadge(m.status)}
            </div>
            <div className="pc-name">{m.name}</div>
            <div className="pc-brand">{m.specialty}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '6px 0 3px' }}>
              <span style={{ color: 'var(--amber)', fontSize: 12 }}>⭐</span>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{m.rating}</span>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>({m._count?.reviews || 0} sharh)</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 12 }}>
              {m._count?.orders || 0} ta buyurtma bajarildi
            </div>
            <button onClick={() => setSelected(m)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}>
              ✍ Sharh qoldirish
            </button>
          </div>
        ))}
        {masters.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--t3)' }}>
            Ustalar topilmadi
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`${selected?.name} uchun sharh`}>
        <form onSubmit={handleReview}>
          <div style={{ marginBottom: 14 }}>
            <div className="fl">Reyting</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r} type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                  style={{
                    width: 34, height: 34, borderRadius: 'var(--r2)',
                    background: reviewForm.rating >= r ? 'rgba(251,191,36,.12)' : 'var(--s3)',
                    border: `1px solid ${reviewForm.rating >= r ? 'rgba(251,191,36,.3)' : 'var(--brd)'}`,
                    cursor: 'pointer', fontSize: 16, transition: 'all .15s',
                  }}
                >⭐</button>
              ))}
            </div>
          </div>
          <div className="fg">
            <label className="fl">Izoh</label>
            <textarea
              className="fi"
              style={{ resize: 'none' }}
              rows={3}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Usta haqida fikringiz..."
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" onClick={() => setSelected(null)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              Bekor
            </button>
            <button type="submit" disabled={submitting} className="btn btn-p" style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? '...' : 'Sharh yuborish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
