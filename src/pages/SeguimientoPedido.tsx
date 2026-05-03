import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function SeguimientoPedido() {
  const [codigo, setCodigo] = useState('')
  const [pedido, setPedido] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const colorEstado = (estado: string) => {
    if (estado === 'pendiente') return { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Pendiente' }
    if (estado === 'en preparacion') return { bg: 'bg-blue-100', text: 'text-blue-600', label: 'En preparacion' }
    if (estado === 'en camino') return { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'En camino' }
    if (estado === 'entregado') return { bg: 'bg-green-100', text: 'text-green-600', label: 'Entregado' }
    if (estado === 'cancelado') return { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelado' }
    return { bg: 'bg-gray-100', text: 'text-gray-600', label: estado }
  }

  const pasos = ['pendiente', 'en preparacion', 'en camino', 'entregado']

  const buscar = async () => {
    if (!codigo) return setError('Ingresa tu codigo de pedido')
    setLoading(true); setError(''); setPedido(null)
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, pedido_items(*, productos(nombre))')
      .ilike('id', codigo.toLowerCase() + '%')
      .single()
    if (error || !data) { setError('No encontramos un pedido con ese codigo'); setLoading(false); return }
    setPedido(data)
    setItems(data.pedido_items || [])
    setLoading(false)
  }

  const c = pedido ? colorEstado(pedido.estado) : null
  const pasoActual = pedido ? pasos.indexOf(pedido.estado) : -1

  return (
    <div className="min-h-screen bg-gray-50" style={{ background: 'radial-gradient(ellipse at top, #7f1d1d10 0%, #f9fafb 50%)' }}>
      <div className="bg-red-700 px-4 py-4 flex items-center justify-between shadow">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <span className="text-white font-extrabold text-sm">La Economia Aya</span>
        </button>
        <button onClick={() => navigate('/')} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 transition">Volver</button>
      </div>
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800">Seguimiento de Pedido</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa el codigo de tu pedido</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Codigo de pedido (ej: A1B2C3D4)"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700 font-mono"
            />
            <button onClick={buscar} disabled={loading} className="bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm">
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-red-600 text-xs mt-3 text-center">{error}</p>}
        </div>
        {pedido && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-xs">Codigo</p>
                  <p className="font-extrabold text-gray-800 font-mono">#{pedido.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className={'text-xs font-bold px-3 py-1.5 rounded-full ' + c.bg + ' ' + c.text}>{c.label}</span>
              </div>
              {pedido.estado !== 'cancelado' && (
                <div className="flex items-center gap-0 mb-4">
                  {pasos.map((paso, i) => (
                    <div key={paso} className="flex items-center flex-1">
                      <div className={'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ' + (i <= pasoActual ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-400')}>
                        {i < pasoActual ? '✓' : i + 1}
                      </div>
                      {i < pasos.length - 1 && <div className={'flex-1 h-0.5 ' + (i < pasoActual ? 'bg-red-700' : 'bg-gray-200')} />}
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-gray-400">Cliente</p><p className="font-semibold text-gray-800">{pedido.nombre_cliente}</p></div>
                <div><p className="text-gray-400">Telefono</p><p className="font-semibold text-gray-800">{pedido.telefono}</p></div>
                <div className="col-span-2"><p className="text-gray-400">Direccion</p><p className="font-semibold text-gray-800">{pedido.direccion}{pedido.barrio ? ', ' + pedido.barrio : ''}</p></div>
                <div><p className="text-gray-400">Fecha</p><p className="font-semibold text-gray-800">{new Date(pedido.created_at).toLocaleDateString('es-CO')}</p></div>
                <div><p className="text-gray-400">Total</p><p className="font-extrabold text-red-700">{'$'}{pedido.total.toLocaleString('es-CO')}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-extrabold text-gray-800 text-sm mb-3">Productos</h3>
              <div className="flex flex-col gap-2">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.productos?.nombre} x{item.cantidad}</span>
                    <span className="font-bold">{'$'}{(item.precio_unitario * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            </div>
            <a href="https://wa.me/573226937375" target="_blank" className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-2xl hover:bg-green-400 transition text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}