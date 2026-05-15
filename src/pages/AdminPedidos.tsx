import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [expandido, setExpandido] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    cargarPedidos()
    const canal = supabase.channel('pedidos-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => cargarPedidos())
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

  const eliminarPedido = async (id) => {
    if (!confirm('Eliminar este pedido?')) return
    await supabase.from('pedido_items').delete().eq('pedido_id', id)
    await supabase.from('pedidos').delete().eq('id', id)
    cargarPedidos()
  }

  const estados = ['pendiente', 'en preparacion', 'en camino', 'entregado', 'cancelado']

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return 'bg-orange-100 text-orange-700'
    if (estado === 'en preparacion') return 'bg-blue-100 text-blue-700'
    if (estado === 'en camino') return 'bg-yellow-100 text-yellow-700'
    if (estado === 'entregado') return 'bg-green-100 text-green-700'
    if (estado === 'cancelado') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const pedidosFiltrados = pedidos.filter((p: any) => {
    const coincideFiltro = filtro === 'todos' || p.estado === filtro
    const coincideBusqueda = p.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) || p.telefono.includes(busqueda)
    return coincideFiltro && coincideBusqueda
  })

  const conteos = estados.reduce((acc, e) => {
    acc[e] = pedidos.filter((p: any) => p.estado === e).length
    return acc
  }, {} as any)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-4 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <div>
            <h1 className="text-white font-extrabold text-sm">Pedidos</h1>
            <p className="text-red-200 text-xs">{pedidos.length} en total · {conteos['pendiente'] || 0} pendientes</p>
          </div>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-white text-red-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">Volver</button>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto mb-5 pb-1" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setFiltro('todos')} className={'px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 transition ' + (filtro === 'todos' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400')}>
            Todos ({pedidos.length})
          </button>
          {estados.map((e) => (
            <button key={e} onClick={() => setFiltro(e)} className={'px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 transition capitalize ' + (filtro === e ? 'bg-red-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300')}>
              {e} {conteos[e] > 0 && <span className="ml-1 bg-red-100 text-red-700 px-1.5 rounded-full">{conteos[e]}</span>}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-5">
          <input type="text" placeholder="Buscar por nombre o telefono..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-700" />
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando pedidos...</div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No hay pedidos</div>
        ) : (
          <div className="flex flex-col gap-3">
            {pedidosFiltrados.map((p: any) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpandido(expandido === p.id ? null : p.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-gray-800 text-sm">{p.nombre_cliente}</p>
                      <span className={'text-xs font-bold px-2 py-0.5 rounded-full ' + colorEstado(p.estado)}>{p.estado}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{p.telefono} · {p.direccion}</p>
                    <p className="text-gray-400 text-xs">{new Date(p.created_at).toLocaleString('es-CO')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-red-700">{'$'}{p.total.toLocaleString('es-CO')}</p>
                    <p className="text-gray-400 text-xs">#{p.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={'w-4 h-4 text-gray-300 transition-transform flex-shrink-0 ' + (expandido === p.id ? 'rotate-180' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                {expandido === p.id && (
                  <div className="border-t border-gray-50 px-4 pb-4">
                    <div className="py-3 flex flex-col gap-1">
                      {p.pedido_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-xs text-gray-600">
                          <span>{item.productos?.nombre} x{item.cantidad}</span>
                          <span className="font-semibold">{'$'}{(item.precio_unitario * item.cantidad).toLocaleString('es-CO')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-3 border-t border-gray-50">
                      <p className="w-full text-xs text-gray-400 mb-1">Cambiar estado:</p>
                      {estados.map((e) => (
                        <button key={e} onClick={() => cambiarEstado(p.id, e)} className={'text-xs font-bold px-3 py-1.5 rounded-full transition capitalize ' + (p.estado === e ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{e}</button>
                      ))}
                      <button onClick={() => eliminarPedido(p.id)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition ml-auto">Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}