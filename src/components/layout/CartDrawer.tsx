import { useState } from "react"
import { useCartStore } from "../../store/cartStore"
import CheckoutModal from "./CheckoutModal"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, restarItem, addItem, clearCart, total } = useCartStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const irACatalogo = () => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById("catalogo")
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 110
        window.scrollTo({ top, behavior: "smooth" })
      }
    }, 300)
  }

  const drawerClass = open
    ? "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 translate-x-0"
    : "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 translate-x-full"

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40" onClick={onClose} />
      )}
      <div className={drawerClass}>
        <div className="flex items-center justify-between px-6 bg-yellow-400 text-black h-[88px]">
          <div>
            <h2 className="text-lg font-extrabold">Tu Carrito</h2>
            {items.length > 0 && <p className="text-xs text-black/60">{items.length} producto{items.length > 1 ? "s" : ""}</p>}
          </div>
          <button onClick={onClose} className="text-2xl font-bold hover:text-red-700">x</button>
        </div>
        <div className="flex flex-col h-[calc(100%-88px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl">🛒</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                En el momento no tienes productos. Te invito a hacer tu compra al menor tiempo y al mejor precio!
              </p>
              <button onClick={irACatalogo} className="bg-red-700 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 transition">
                Ver Catalogo
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.nombre}</p>
                      <p className="text-red-700 font-bold text-sm">${item.precio.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Subtotal: ${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => restarItem(item.id)} className="w-7 h-7 rounded-full bg-gray-200 font-bold text-sm flex items-center justify-center hover:bg-red-200">-</button>
                      <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => addItem({ ...item, cantidad: 1 })} className="w-7 h-7 rounded-full bg-gray-200 font-bold text-sm flex items-center justify-center hover:bg-green-200">+</button>
                      <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center hover:bg-red-200 ml-1">X</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex flex-col gap-3 bg-gray-50">
                <div className="flex justify-between font-extrabold text-lg">
                  <span>Total:</span>
                  <span className="text-red-700">${total().toLocaleString()}</span>
                </div>
                <button onClick={() => { onClose(); setCheckoutOpen(true) }} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">
                  Finalizar pedido
                </button>
                <button onClick={clearCart} className="text-gray-400 text-sm text-center hover:text-red-600 transition">
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}