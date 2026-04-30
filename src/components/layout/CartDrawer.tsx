import { useCartStore } from '../../store/cartStore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const items = useCartStore((s) => s.items)
  const incrementar = useCartStore((s) => s.incrementar)
  const decrementar = useCartStore((s) => s.decrementar)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalCalc = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

  return (
    <>
      {open && (<div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40" onClick={onClose} />)}
      <div className={"fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 " + (open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between px-6 bg-yellow-400 text-black h-[88px]">
          <h2 className="text-lg font-bold">Tu Carrito</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:text-red-700">x</button>
        </div>
        <div className="p-4 h-full flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-gray-600 text-sm leading-relaxed">No tienes productos. Agrega algo del catalogo!</p>
              <button onClick={() => { onClose(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) }} className="bg-red-700 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 transition">Ver Catalogo</button>
            </div>
          ) : (
            <div className="flex-1 overflow-auto flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.nombre}</p>
                    <p className="text-red-700 font-bold text-sm">{'$'}{item.precio.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decrementar(item.id)} className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-700 hover:text-white text-xs font-bold transition">-</button>
                    <span className="text-sm font-semibold">{item.cantidad}</span>
                    <button onClick={() => incrementar(item.id)} className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-700 hover:text-white text-xs font-bold transition">+</button>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-700 text-xs ml-1">x</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {items.length > 0 && (
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between font-bold text-base mb-3">
                <span>Total</span>
                <span className="text-red-700">{'$'}{totalCalc.toLocaleString('es-CO')}</span>
              </div>
              <button className="w-full bg-red-700 text-white font-bold py-3 rounded-full hover:bg-red-600 transition">Finalizar Pedido</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}