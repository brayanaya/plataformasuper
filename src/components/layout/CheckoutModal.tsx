import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { supabase } from '../../services/supabase'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CheckoutModal({ open, onClose }: Props) {
  const { items, total, clearCart } = useCartStore()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [barrio, setBarrio] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  const handlePedido = async () => {
    if (!nombre || !telefono || !direccion) return
    setLoading(true)
    const { data: pedido, error } = await supabase.from('pedidos').insert({
      nombre_cliente: nombre,
      telefono,
      direccion,
      barrio,
      total: total(),
      estado: 'pendiente'
    }).select().single()

    if (error || !pedido) { setLoading(false); return }

    const itemsParaInsertar = items.map((i) => ({
      pedido_id: pedido.id,
      producto_id: i.id,
      cantidad: i.cantidad,
      precio_unitario: i.precio
    }))

    await supabase.from('pedido_items').insert(itemsParaInsertar)
    clearCart()
    setExito(true)
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-5">
        {exito ? (
          <div className="text-center flex flex-col gap-4 py-6">
            <span className="text-6xl">✅</span>
            <h2 className="text-2xl font-extrabold text-red-700">Pedido recibido</h2>
            <p className="text-gray-600 text-sm">Tu pedido ha sido recibido exitosamente. Nos comunicaremos contigo pronto.</p>
            <button onClick={() => { setExito(false); onClose() }} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-red-700">Finalizar pedido</h2>
              <p className="text-gray-500 text-sm mt-1">Total: </p>
            </div>
            <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="tel" placeholder="Tu telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="text" placeholder="Tu direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="text" placeholder="Tu barrio" value={barrio} onChange={(e) => setBarrio(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <button onClick={handlePedido} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
              {loading ? 'Enviando pedido...' : 'Confirmar pedido'}
            </button>
            <button onClick={onClose} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">Cancelar</button>
          </>
        )}
      </div>
    </div>
  )
}
