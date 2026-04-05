import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { cargarPedidos() }, [])

  const cargarPedidos = async () => {
    const { data } = await supabase.from('pedidos').select('*, pedido_items(*, productos(nombre))').order('created_at', { ascending: false })
    if (data) setPedidos(data)
    setLoading(false)
  }

  const cambiarEstado = async (id, estado) => {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    cargarPedidos()
  }

  const estados = ['pendiente', 'en preparacion', 'en camino', 'entregado', 'cancelado']

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return 'bg-yellow-100 text-yellow-700'
    if (estado === 'en preparacion') return 'bg-blue-100 text-blue-700'
    if (estado === 'en camino') return 'bg-orange-100 text-orange-700'
    if (estado === 'entregado') return 'bg-green-100 text-green-700'
    if (estado === 'cancelado') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="La Economia Aya" className="h-12 w-auto" />
          <span className="font-bold text-lg">Gestionar Pedidos</span>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition">Volver</button>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No hay pedidos aun</div>
        ) : (
          <div className="flex flex-col gap-6">
            {pedidos.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-800">{p.nombre_cliente}</h3>
                    <p className="text-gray-500 text-sm">{p.telefono} — {p.direccion}</p>
                    {p.barrio && <p className="text-gray-500 text-sm">Barrio: {p.barrio}</p>}
                    <p className="text-gray-400 text-xs mt-1">{new Date(p.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-red-700 text-lg"></p>
                    <span className={"text-xs font-bold px-3 py-1 rounded-full " + colorEstado(p.estado)}>{p.estado}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mb-4">
                  {p.pedido_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600 py-1">
                      <span>{item.productos?.nombre} x{item.cantidad}</span>
                      <span></span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {estados.map((e) => (
                    <button key={e} onClick={() => cambiarEstado(p.id, e)} className={p.estado === e ? 'text-xs font-bold px-3 py-1 rounded-full bg-red-700 text-white' : 'text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition'}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
