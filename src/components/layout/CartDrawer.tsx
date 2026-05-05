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
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />}
      <div className={'fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ' + (open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <h2 className="font-extrabold text-gray-800 text-base">Mi Carrito</h2>
              {items.length > 0 && <p className="text-xs text-gray-400">{items.length} producto{items.length > 1 ? 's' : ''}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p className="font-bold text-gray-800">Tu carrito esta vacio</p>
              <p className="text-gray-400 text-sm mt-1">Agrega productos del catalogo</p>
            </div>
            <button onClick={irACatalogo} className="bg-red-700 text-white font-bold px-6 py-2.5 rounded-full hover:bg-red-600 transition text-sm">Ver Catalogo</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              {items.map((item, idx) => (
                <div key={item.id} className={'flex gap-3 p-4 ' + (idx < items.length - 1 ? 'border-b border-gray-50' : '')}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                    {item.imagen_url ? (
                      <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{item.nombre}</p>
                    <p className="text-red-700 font-extrabold text-sm mt-0.5">{'$'}{item.precio.toLocaleString('es-CO')}</p>
                    <p className="text-gray-400 text-xs">Subtotal: {'$'}{(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-1 py-0.5 border border-gray-100">
                      <button onClick={() => decrementar(item.id)} className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center font-bold text-gray-600 transition text-sm">-</button>
                      <span className="text-sm font-bold w-5 text-center text-gray-800">{item.cantidad}</span>
                      <button onClick={() => incrementar(item.id)} className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center font-bold text-gray-600 transition text-sm">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex flex-col gap-3 bg-white flex-shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total del pedido</span>
                <span className="font-extrabold text-xl text-gray-800">{'$'}{total().toLocaleString('es-CO')}</span>
              </div>
              <button onClick={() => { onClose(); setTimeout(() => setCheckoutOpen(true), 300) }} className="bg-red-700 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition text-sm flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Finalizar pedido
              </button>
              <button onClick={clearCart} className="text-gray-400 text-xs text-center hover:text-red-600 transition">Vaciar carrito</button>
            </div>
          </>
        )}
      </div>
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}