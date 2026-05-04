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
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [pedidoId, setPedidoId] = useState('')
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)

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
    const codigo = pedido.id.slice(0, 8).toUpperCase()
    const lista = items.map((i) => '%0A• ' + i.nombre + ' x' + i.cantidad + ' ($' + (i.precio * i.cantidad).toLocaleString('es-CO') + ')').join('')
    const msg = '%F0%9F%9B%92 *PEDIDO - La Economia Aya*%0A' +
      '%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%0A' +
      '%F0%9F%93%8B *Codigo:* %23' + codigo + '%0A' +
      '%F0%9F%91%A4 *Cliente:* ' + encodeURIComponent(nombre) + '%0A' +
      '%F0%9F%93%9E *Tel:* ' + telefono + '%0A' +
      '%F0%9F%93%8D *Direccion:* ' + encodeURIComponent(direccion) + (barrio ? ', Barrio ' + encodeURIComponent(barrio) : '') + '%0A' +
      (notas ? '%F0%9F%93%9D *Notas:* ' + encodeURIComponent(notas) + '%0A' : '') +
      '%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%0A' +
      '*Productos:*' + lista + '%0A' +
      '%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%0A' +
      '*Total: $' + totalVal.toLocaleString('es-CO') + '*'
    window.open('https://wa.me/573226937375?text=' + msg, '_blank')
    clearCart()
    setPedidoId(codigo)
    setLoading(false)
  }

  const copiarCodigo = () => {
    navigator.clipboard.writeText(pedidoId)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const cerrar = () => { setPedidoId(''); onClose(); setNombre(''); setTelefono(''); setDireccion(''); setBarrio(''); setNotas('') }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-sm overflow-hidden">
        {pedidoId ? (
          <div className="p-6 text-center flex flex-col gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-800">Pedido confirmado!</h2>
              <p className="text-gray-500 text-xs mt-1">Te contactaremos pronto para coordinar el domicilio</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-gray-400 text-xs mb-1">Codigo de seguimiento</p>
              <p className="text-2xl font-extrabold text-red-700 tracking-widest font-mono">#{pedidoId}</p>
              <button onClick={copiarCodigo} className="mt-2 text-xs text-gray-500 hover:text-red-700 transition flex items-center gap-1 mx-auto">
                {copiado ? ('✓ Copiado') : ('Copiar codigo')}
              </button>
            </div>
            <a href={'/pedido?codigo=' + pedidoId} target="_blank" className="bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:border-red-300 transition text-sm flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Ver estado del pedido
            </a>
            <button onClick={cerrar} className="bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition text-sm">Cerrar</button>
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
              <textarea placeholder="Notas adicionales (opcional)" value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 resize-none" />
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