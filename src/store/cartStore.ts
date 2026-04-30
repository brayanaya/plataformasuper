import { create } from 'zustand'

export interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen_url?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  incrementar: (id: string) => void
  decrementar: (id: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const exists = get().items.find((i) => i.id === item.id)
    if (exists) {
      set({ items: get().items.map((i) => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i) })
    } else {
      set({ items: [...get().items, { ...item, cantidad: 1 }] })
    }
  },
  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  incrementar: (id) => set({ items: get().items.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i) }),
  decrementar: (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item) return
    if (item.cantidad === 1) {
      set({ items: get().items.filter((i) => i.id !== id) })
    } else {
      set({ items: get().items.map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i) })
    }
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
}))