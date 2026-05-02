import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { supabase } from '../../services/supabase'

interface Props { open: boolean; onClose: () => void }

export default function CheckoutModal({ open, onClose }: Props) {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [barrio, setBarrio] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  const handlePedido = async () => {
    if (!nombre || !telefono || !direccion) return setError('Completa nombre, telefono y direccion')
    if (telefono.length < 7) return setError('Telefono invalido')
    setLoading(true); setError('')
    const totalVal = total()
    const { data: pedido, error: pedidoError } = await supabase.from('pedidos').insert({
      nombre_cliente: nombre, telefono, direccion, barrio, total: totalVal, estado: 'pendiente'
    }).select().single()
    if (pedidoError || !pedido) { setError('Error al registrar, intenta de nuevo'); setLoading(false); return }
    await supabase.from('pedido_items').insert(items.map((i) => ({ pedido_id: pedido.id, producto_id: i.id, cantidad: i.cantidad, precio_unitario: i.precio })))
    const lista = items.map((i) => i.nombre + ' x' + i.cantidad + ' ($' + (i.precio * i.cantidad).toLocaleString('es-CO') + ')').join(', ')
    const msg = 'Hola! Soy ' + nombre + '. Pedido $' + totalVal.toLocaleString('es-CO') + '. Productos: ' + lista + '. Direccion: ' + direccion + (barrio ? ', Barrio ' + barrio : '') + '. Tel: ' + telefono
    window.open('https://wa.me/573226937375?text=' + encodeURIComponent(msg), '_blank')
    clearCart(); setExito(true); setLoading(false)
  }

  const cerrar = () => { setExito(false); onClose(); setNombre(''); setTelefono(''); setDireccion(''); setBarrio('') }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-md overflow-hidden">
        {exito ? (
          <div className="p-8 text-center flex flex-col gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-800">Pedido enviado!</h2>
            <p className="text-gray-500 text-sm">Te redirigimos a WhatsApp para confirmar tu pedido.</p>
            <button onClick={cerrar} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">Cerrar</button>
          </div>
        ) : (
          <>
            <div className="bg-red-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">Finalizar pedido</h2>
                <p className="text-red-200 text-xs">Total: {'$'}{total().toLocaleString('es-CO')}</p>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white text-xl">x</button>
            </div>
            <div className="p-5 flex flex-col gap-3 max-h-[80vh] overflow-auto">
              <div className="bg-gray-50 rounded-xl p-3 max-h-28 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-600 py-0.5">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span className="font-bold">{'$'}{(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-600 text-xs text-center bg-red-50 rounded-xl p-2">{error}</p>}
              <input type="text" placeholder="Tu nombre completo *" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
              <input type="tel" placeholder="Tu telefono *" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
              <input type="text" placeholder="Tu direccion *" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
              <input type="text" placeholder="Tu barrio (opcional)" value={barrio} onChange={(e) => setBarrio(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
              <button onClick={handlePedido} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
                {loading ? 'Enviando...' : 'Confirmar pedido'}
              </button>
              <button onClick={onClose} className="text-gray-400 text-xs text-center hover:text-gray-600">Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}