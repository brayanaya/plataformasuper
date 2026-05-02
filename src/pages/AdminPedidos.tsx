import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    cargarPedidos()
    const canal = supabase.channel('pedidos-admin')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pedidos' }, () => cargarPedidos())
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [])

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

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideFiltro = filtro === 'todos' || p.estado === filtro
    const coincideBusqueda = p.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) || p.telefono.includes(busqueda)
    return coincideFiltro && coincideBusqueda
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <div>
            <h1 className="text-white font-extrabold text-base">Pedidos</h1>
            <p className="text-red-200 text-xs">{pedidos.length} pedidos en total</p>
          </div>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-white text-red-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">Volver</button>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-5 flex flex-col md:flex-row gap-3">
          <input type="text" placeholder="Buscar por nombre o telefono..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-700" />
          <div className="flex gap-2 flex-wrap">
            {['todos', ...estados].map((e) => (
              <button key={e} onClick={() => setFiltro(e)} className={filtro === e ? 'px-3 py-1.5 rounded-full text-xs font-bold bg-red-700 text-white' : 'px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition'}>{e}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando pedidos...</div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No hay pedidos</div>
        ) : (
          <div className="flex flex-col gap-3">
            {pedidosFiltrados.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-sm">{p.nombre_cliente}</h3>
                    <p className="text-gray-500 text-xs">{p.telefono} — {p.direccion}{p.barrio ? ', ' + p.barrio : ''}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(p.created_at).toLocaleString('es-CO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-red-700">{'$'}{p.total.toLocaleString('es-CO')}</p>
                    <span className={'text-xs font-bold px-2 py-0.5 rounded-full ' + colorEstado(p.estado)}>{p.estado}</span>
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-3 mb-3">
                  {p.pedido_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-gray-600 py-0.5">
                      <span>{item.productos?.nombre} x{item.cantidad}</span>
                      <span className="font-semibold">{'$'}{(item.precio_unitario * item.cantidad).toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {estados.map((e) => (
                    <button key={e} onClick={() => cambiarEstado(p.id, e)} className={p.estado === e ? 'text-xs font-bold px-3 py-1 rounded-full bg-red-700 text-white' : 'text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition'}>{e}</button>
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