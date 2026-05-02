import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import CheckoutModal from './CheckoutModal'

interface Props { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const items = useCartStore((s) => s.items)
  const incrementar = useCartStore((s) => s.incrementar)
  const decrementar = useCartStore((s) => s.decrementar)
  const removeItem = useCartStore((s) => s.removeItem)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const irACatalogo = () => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById('catalogo')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />}
      <div className={'fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ' + (open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between px-5 bg-yellow-400 text-black h-16 flex-shrink-0">
          <div>
            <h2 className="font-extrabold text-base">Tu Carrito</h2>
            {items.length > 0 && <p className="text-xs text-black/60">{items.length} producto{items.length > 1 ? 's' : ''}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 transition flex items-center justify-center font-bold">x</button>
        </div>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <p className="text-gray-500 text-sm">Tu carrito esta vacio</p>
            <button onClick={irACatalogo} className="bg-red-700 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 transition text-sm">Ver Catalogo</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-gray-50 pb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{item.nombre}</p>
                    <p className="text-red-700 font-bold text-sm">{'$'}{item.precio.toLocaleString('es-CO')}</p>
                    <p className="text-gray-400 text-xs">Subtotal: {'$'}{(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => decrementar(item.id)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 font-bold text-sm flex items-center justify-center transition">-</button>
                    <span className="text-sm font-bold w-5 text-center">{item.cantidad}</span>
                    <button onClick={() => incrementar(item.id)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-green-100 font-bold text-sm flex items-center justify-center transition">+</button>
                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 font-bold text-xs flex items-center justify-center transition ml-1">x</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-col gap-3 bg-gray-50 flex-shrink-0">
              <div className="flex justify-between font-extrabold text-base">
                <span>Total</span>
                <span className="text-red-700">{'$'}{total().toLocaleString('es-CO')}</span>
              </div>
              <button onClick={() => { onClose(); setTimeout(() => setCheckoutOpen(true), 300) }} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition text-sm">Finalizar pedido</button>
              <button onClick={clearCart} className="text-gray-400 text-xs text-center hover:text-red-600 transition">Vaciar carrito</button>
            </div>
          </>
        )}
      </div>
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}