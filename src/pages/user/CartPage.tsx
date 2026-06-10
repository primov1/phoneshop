import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { cartApi, ordersApi, promoApi } from '../../api'
import { useCartStore } from '../../store/cart.store'
import { PageLoader } from '../../components/ui/Spinner'
import { CartItem } from '../../types'
import { useNavigate } from 'react-router-dom'

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(Math.round(n))

export function CartPage() {
  const { items, total, setCart, clear } = useCartStore()
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [promoData, setPromoData] = useState<{ discount: number; finalAmount: number } | null>(null)
  const [ordering, setOrdering] = useState(false)
  const navigate = useNavigate()

  const loadCart = async () => {
    try {
      const res = await cartApi.get()
      setCart(res.data.items, res.data.total)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadCart() }, [])

  const handleRemove = async (id: number) => {
    try { await cartApi.remove(id); loadCart() } catch { toast.error('Xatolik') }
  }

  const handleQty = async (id: number, qty: number) => {
    if (qty < 1) return
    try { await cartApi.update(id, qty); loadCart() } catch { toast.error('Xatolik') }
  }

  const handleClear = async () => {
    try { await cartApi.clear(); clear(); toast.success('Savat tozalandi') } catch { toast.error('Xatolik') }
  }

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    try {
      const res = await promoApi.apply(promoCode.trim(), promoData ? promoData.finalAmount : total)
      setPromoData(res.data)
      toast.success(`${res.data.discount}% chegirma qo'llanildi!`)
    } catch { toast.error('Promo kod yaroqsiz') }
  }

  const handleOrder = async () => {
    if (items.length === 0) return
    setOrdering(true)
    try {
      for (const item of items) {
        await ordersApi.create({
          type: 'PRODUCT',
          productId: item.product.id,
          shopId: undefined,
          amount: item.product.price * item.quantity * (promoData ? (1 - promoData.discount / 100) : 1),
          promoCode: promoCode || undefined,
        })
      }
      await cartApi.clear()
      clear()
      toast.success('Buyurtma muvaffaqiyatli yuborildi!')
      navigate('/my-orders')
    } catch { toast.error('Xatolik yuz berdi') } finally { setOrdering(false) }
  }

  if (loading) return <PageLoader />

  const finalTotal = promoData ? promoData.finalAmount : total

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div className="page-title">Savat</div>
          <div className="page-sub">{items.length} ta mahsulot</div>
        </div>
        {items.length > 0 && (
          <button onClick={handleClear} className="btn btn-red btn-sm">🗑 Tozalash</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
          <div style={{ color: 'var(--t3)', fontSize: 13 }}>Savat bo'sh</div>
        </div>
      ) : (
        <>
          {/* Items */}
          <div style={{ marginBottom: 12 }}>
            {items.map((item: CartItem) => (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <span style={{ fontSize: 26 }}>{item.product.emoji || '📱'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--w2)' }}>{item.product.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>{item.product.brand}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginTop: 3 }}>{fmt(item.product.price * item.quantity)} so'm</div>
                </div>
                {/* Qty controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => handleQty(item.id, item.quantity - 1)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '4px 8px' }}
                  >−</button>
                  <span style={{ fontSize: 13, width: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => handleQty(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '4px 8px' }}
                  >+</button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="btn btn-red btn-sm" style={{ padding: '5px 8px' }}>✕</button>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="fl" style={{ marginBottom: 8 }}>Promo kod</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="fi"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="TEXMASTER10"
              />
              <button onClick={applyPromo} className="btn btn-ghost" style={{ whiteSpace: 'nowrap' }}>Qo'llash</button>
            </div>
            {promoData && (
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 8 }}>
                ✓ {promoData.discount}% chegirma qo'llanildi
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>
              <span>Jami ({items.length} mahsulot)</span>
              <span>{fmt(total)} so'm</span>
            </div>
            {promoData && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--green)', marginBottom: 8 }}>
                <span>Chegirma ({promoData.discount}%)</span>
                <span>−{fmt(total - promoData.finalAmount)} so'm</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--brd)', paddingTop: 10, marginBottom: 14 }}>
              <span>To'lash kerak</span>
              <span style={{ color: 'var(--w1)', fontSize: 16 }}>{fmt(finalTotal)} so'm</span>
            </div>
            <button onClick={handleOrder} disabled={ordering} className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }}>
              {ordering ? 'Buyurtma berilmoqda...' : '✓ Buyurtma berish'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
