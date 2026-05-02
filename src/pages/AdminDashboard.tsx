import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ productos: 0, cuartillas: 0, pedidos: 0, pendientes: 0 })
  const [pedidosRecientes, setPedidosRecientes] = useState([])
  const [nuevoPedido, setNuevoPedido] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    cargarStats()
    const canal = supabase.channel('pedidos-nuevos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pedidos' }, () => {
        setNuevoPedido(true)
        cargarStats()
      })
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [])

  const cargarStats = async () => {
    const [{ count: productos }, { count: cuartillas }, { count: pedidos }, { count: pendientes }, { data: recientes }] = await Promise.all([
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('disponible', true),
      supabase.from('cuartillas').select('*', { count: 'exact', head: true }).eq('activa', true),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }).limit(5),
    ])
    setStats({ productos: productos || 0, cuartillas: cuartillas || 0, pedidos: pedidos || 0, pendientes: pendientes || 0 })
    if (recientes) setPedidosRecientes(recientes)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/admin') }

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return 'bg-orange-100 text-orange-600'
    if (estado === 'entregado') return 'bg-green-100 text-green-600'
    if (estado === 'cancelado') return 'bg-red-100 text-red-600'
    return 'bg-blue-100 text-blue-600'
  }

  const menus = [
    { label: 'Productos', sub: stats.productos + ' activos', path: '/admin/productos', color: 'border-yellow-400' },
    { label: 'Cuartillas', sub: stats.cuartillas + ' activas', path: '/admin/cuartillas', color: 'border-red-700' },
    { label: 'Pedidos', sub: stats.pedidos + ' total', path: '/admin/pedidos', color: 'border-green-500' },
    { label: 'Categorias', sub: 'Organizar catalogo', path: '/admin/categorias', color: 'border-gray-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-4 md:px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <div>
            <h1 className="text-white font-extrabold text-sm">Panel Admin</h1>
            <p className="text-red-200 text-xs">La Economia Aya</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/')} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 transition">Ver tienda</button>
          <button onClick={handleLogout} className="bg-white text-red-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-100 transition">Salir</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {nuevoPedido && (
          <div className="bg-green-500 text-white rounded-2xl p-4 mb-4 flex items-center gap-3 shadow">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <p className="font-bold text-sm flex-1">Nuevo pedido recibido!</p>
            <button onClick={() => { setNuevoPedido(false); navigate('/admin/pedidos') }} className="bg-white text-green-600 font-bold px-3 py-1 rounded-full text-xs">Ver</button>
            <button onClick={() => setNuevoPedido(false)} className="text-white/70 hover:text-white font-bold ml-1">x</button>
          </div>
        )}
        {stats.pendientes > 0 && (
          <div onClick={() => navigate('/admin/pedidos')} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4 flex items-center gap-3 cursor-pointer hover:bg-orange-100 transition">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <p className="font-bold text-orange-700 text-sm flex-1">{stats.pendientes} pedido{stats.pendientes > 1 ? 's' : ''} pendiente{stats.pendientes > 1 ? 's' : ''} por atender</p>
            <span className="text-orange-500 font-bold text-sm">Ver</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Productos', value: stats.productos, color: 'text-yellow-500' },
            { label: 'Cuartillas', value: stats.cuartillas, color: 'text-red-700' },
            { label: 'Pedidos', value: stats.pedidos, color: 'text-green-600' },
            { label: 'Pendientes', value: stats.pendientes, color: 'text-orange-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center border border-gray-100">
              <p className={'text-2xl font-extrabold ' + s.color}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {menus.map((m) => (
            <button key={m.label} onClick={() => navigate(m.path)} className={'bg-white rounded-2xl p-4 shadow-sm border-l-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center justify-between ' + m.color}>
              <div>
                <p className="font-extrabold text-gray-800 text-sm">{m.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{m.sub}</p>
              </div>
              <span className="text-gray-300 text-xl">›</span>
            </button>
          ))}
        </div>

        {pedidosRecientes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-extrabold text-gray-800 text-sm">Pedidos Recientes</h2>
              <button onClick={() => navigate('/admin/pedidos')} className="text-red-700 text-xs font-semibold hover:underline">Ver todos</button>
            </div>
            <div className="divide-y divide-gray-50">
              {pedidosRecientes.map((p: any) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">{p.nombre_cliente}</p>
                    <p className="text-gray-400 text-xs">{p.telefono}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-red-700 font-bold text-xs">{'$'}{p.total?.toLocaleString('es-CO')}</p>
                    <span className={'text-xs px-2 py-0.5 rounded-full font-semibold ' + colorEstado(p.estado)}>{p.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}