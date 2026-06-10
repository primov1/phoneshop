import { create } from 'zustand'
import { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  total: number
  count: number
  setCart: (items: CartItem[], total: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  count: 0,
  setCart: (items, total) => set({ items, total, count: items.length }),
  clear: () => set({ items: [], total: 0, count: 0 }),
}))
