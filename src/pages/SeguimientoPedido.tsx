import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function SeguimientoPedido() {
  const [codigo, setCodigo] = useState('')
  const [pedido, setPedido] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cod = params.get('codigo')
    if (cod) { setCodigo(cod); buscarConCodigo(cod) }
  }, [])

  useEffect(() => {
    if (!pedido) return
    const canal = supabase.channel('seguimiento-' + pedido.id)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: 'id=eq.' + pedido.id }, (payload) => {
        setPedido((prev) => ({ ...prev, ...payload.new }))
      })
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [pedido?.id])

  const colorEstado = (estado: string) => {
    if (estado === 'pendiente') return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', label: 'Pendiente', icon: '⏳' }
    if (estado === 'en preparacion') return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', label: 'En preparacion', icon: '👨‍🍳' }
    if (estado === 'en camino') return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'En camino', icon: '🛵' }
    if (estado === 'entregado') return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', label: 'Entregado', icon: '✅' }
    if (estado === 'cancelado') return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', label: 'Cancelado', icon: '❌' }
    return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', label: estado, icon: '📦' }
  }

  const pasos = [
    { key: 'pendiente', label: 'Recibido', icon: '📋' },
    { key: 'en preparacion', label: 'Preparando', icon: '📦' },
    { key: 'en camino', label: 'En camino', icon: '🛵' },
    { key: 'entregado', label: 'Entregado', icon: '✅' },
  ]

  const buscarConCodigo = async (cod: string) => {
    setLoading(true); setError(''); setPedido(null)
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, pedido_items(*, productos(nombre))')
      .ilike('id', cod.toLowerCase() + '%')
      .single()
    if (error || !data) { setError('No encontramos un pedido con ese codigo'); setLoading(false); return }
    setPedido(data)
    setItems(data.pedido_items || [])
    setLoading(false)
  }

  const buscar = () => { if (codigo) buscarConCodigo(codigo) }
  const c = pedido ? colorEstado(pedido.estado) : null
  const pasoActual = pedido ? pasos.findIndex(p => p.key === pedido.estado) : -1

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-4 py-4 flex items-center justify-between shadow">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <span className="text-white font-extrabold text-sm hidden sm:block">La Economia Aya</span>
        </button>
        <button onClick={() => navigate('/')} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 transition">Volver a la tienda</button>
      </div>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-gray-800">Seguimiento de Pedido</h1>
          <p className="text-gray-500 text-sm mt-1">Consulta el estado de tu domicilio en tiempo real</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
          <div className="flex gap-3">
            <input type="text" placeholder="Ej: A1B2C3D4" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && buscar()} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 font-mono tracking-widest" />
            <button onClick={buscar} disabled={loading} className="bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm flex-shrink-0">
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
        </div>
        {pedido && c && (
          <div className="flex flex-col gap-4">
            <div className={'rounded-2xl border p-5 ' + c.bg + ' ' + c.border}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-xs text-gray-500">Estado actual</p>
                  <p className={'font-extrabold text-lg ' + c.text}>{c.label}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-400">Codigo</p>
                  <p className="font-mono font-extrabold text-gray-700">#{pedido.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Se actualiza en tiempo real automaticamente</p>
            </div>
            {pedido.estado !== 'cancelado' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start">
                  {pasos.map((paso, i) => (
                    <div key={paso.key} className="flex items-start flex-1">
                      <div className="flex flex-col items-center">
                        <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500 ' + (i <= pasoActual ? 'bg-red-700 text-white shadow-md shadow-red-200' : 'bg-gray-100 text-gray-300')}>
                          {i < pasoActual ? '✓' : paso.icon}
                        </div>
                        <p className={'text-xs mt-1.5 font-semibold text-center leading-tight ' + (i <= pasoActual ? 'text-red-700' : 'text-gray-300')}>{paso.label}</p>
                      </div>
                      {i < pasos.length - 1 && <div className={'flex-1 h-0.5 mt-4 mx-1 transition-all duration-500 ' + (i < pasoActual ? 'bg-red-700' : 'bg-gray-100')} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-extrabold text-gray-800 text-sm mb-3">Informacion del pedido</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-gray-400">Cliente</p><p className="font-semibold text-gray-800">{pedido.nombre_cliente}</p></div>
                <div><p className="text-gray-400">Telefono</p><p className="font-semibold text-gray-800">{pedido.telefono}</p></div>
                <div className="col-span-2"><p className="text-gray-400">Direccion</p><p className="font-semibold text-gray-800">{pedido.direccion}{pedido.barrio ? ', Barrio ' + pedido.barrio : ''}</p></div>
                <div><p className="text-gray-400">Fecha</p><p className="font-semibold text-gray-800">{new Date(pedido.created_at).toLocaleDateString('es-CO')}</p></div>
                <div><p className="text-gray-400">Total</p><p className="font-extrabold text-red-700">{'$'}{pedido.total.toLocaleString('es-CO')}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-extrabold text-gray-800 text-sm mb-3">Productos</h3>
              <div className="flex flex-col divide-y divide-gray-50">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-600 py-2">
                    <span>{item.productos?.nombre} x{item.cantidad}</span>
                    <span className="font-bold text-gray-800">{'$'}{(item.precio_unitario * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-extrabold text-gray-800 pt-3">
                  <span>Total</span>
                  <span className="text-red-700">{'$'}{pedido.total.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
            <a href="https://wa.me/573226937375" target="_blank" className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3.5 rounded-2xl hover:bg-green-400 transition text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}