import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

interface Props {
  open: boolean
  onClose: () => void
}

interface Pedido {
  id: string
  nombre_cliente: string
  telefono: string
  direccion: string
  barrio: string
  total: number
  estado: string
  created_at: string
}

const ESTADOS = [
  { key: 'pendiente', label: 'Pedido recibido', icon: '📋', desc: 'Tu pedido fue recibido y esta siendo revisado' },
  { key: 'preparando', label: 'Preparando', icon: '🛒', desc: 'Estamos alistando tus productos' },
  { key: 'en camino', label: 'En camino', icon: '🛵', desc: 'Tu pedido va en camino a tu direccion' },
  { key: 'entregado', label: 'Entregado', icon: '✅', desc: 'Tu pedido fue entregado. Gracias por tu compra!' },
]

export default function SeguirPedidoModal({ open, onClose }: Props) {
  const [codigo, setCodigo] = useState('')
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) { setCodigo(''); setPedido(null); setError('') }
  }, [open])

  useEffect(() => {
    if (!pedido) return
    const channel = supabase
      .channel('pedido-' + pedido.id)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pedidos',
        filter: 'id=eq.' + pedido.id
      }, (payload) => {
        setPedido(payload.new as Pedido)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [pedido?.id])

  const buscarPedido = async () => {
    if (!codigo.trim()) return
    setLoading(true)
    setError('')
    setPedido(null)
    const termino = codigo.trim().replace('#', '').toLowerCase()
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .ilike('id', termino + '%')
      .limit(1)
      .single()
    if (error || !data) {
      setError('No encontramos un pedido con ese codigo. Verificalo e intentalo de nuevo.')
    } else {
      setPedido(data)
    }
    setLoading(false)
  }

  const getEstadoIndex = (estado: string) => ESTADOS.findIndex(e => e.key === estado)

  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'>
        <div className='bg-red-700 px-6 py-4 flex items-center justify-between'>
          <div>
            <h2 className='text-white font-bold text-lg'>Seguir Pedido</h2>
            <p className='text-red-200 text-xs'>Ingresa tu codigo de pedido</p>
          </div>
          <button onClick={onClose} className='text-white text-2xl font-bold hover:text-yellow-400 transition'>x</button>
        </div>

        <div className='p-6'>
          <div className='flex gap-2 mb-6'>
            <input
              type='text'
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarPedido()}
              placeholder='Ej: #E881BF26'
              className='flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-700 transition'
            />
            <button
              onClick={buscarPedido}
              disabled={loading}
              className='bg-red-700 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-600 transition disabled:opacity-50'
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm text-center mb-4'>
              {error}
            </div>
          )}

          {pedido && (
            <div>
              <div className='bg-gray-50 rounded-xl p-4 mb-6'>
                <p className='font-bold text-gray-800'>{pedido.nombre_cliente}</p>
                <p className='text-gray-500 text-sm'>{pedido.direccion}{pedido.barrio ? ', ' + pedido.barrio : ''}</p>
                <p className='text-red-700 font-bold mt-1'></p>
              </div>

              <div className='flex flex-col gap-4'>
                {ESTADOS.map((estado, i) => {
                  const estadoActual = getEstadoIndex(pedido.estado)
                  const completado = i <= estadoActual
                  const activo = i === estadoActual
                  return (
                    <div key={estado.key} className='flex items-start gap-4'>
                      <div className='flex flex-col items-center'>
                        <div className={'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ' + (activo ? 'bg-red-700 shadow-lg scale-110' : completado ? 'bg-green-500' : 'bg-gray-200')}>
                          {estado.icon}
                        </div>
                        {i < ESTADOS.length - 1 && (
                          <div className={'w-0.5 h-8 mt-1 ' + (i < estadoActual ? 'bg-green-500' : 'bg-gray-200')} />
                        )}
                      </div>
                      <div className='pt-1'>
                        <p className={'font-bold text-sm ' + (activo ? 'text-red-700' : completado ? 'text-green-600' : 'text-gray-400')}>
                          {estado.label}
                        </p>
                        {activo && <p className='text-gray-500 text-xs mt-0.5'>{estado.desc}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}