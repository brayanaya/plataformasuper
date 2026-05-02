import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [conteos, setConteos] = useState({})
  const navigate = useNavigate()

  useEffect(() => { cargarCategorias() }, [])

  const cargarCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    if (data) {
      setCategorias(data)
      const conteoObj = {}
      await Promise.all(data.map(async (c) => {
        const { count } = await supabase.from('productos').select('*', { count: 'exact', head: true }).eq('categoria_id', c.id)
        conteoObj[c.id] = count || 0
      }))
      setConteos(conteoObj)
    }
  }

  const handleAgregar = async () => {
    if (!nombre) return setMensaje({ texto: 'Escribe un nombre', tipo: 'error' })
    await supabase.from('categorias').insert({ nombre })
    setNombre('')
    setMensaje({ texto: 'Categoria agregada', tipo: 'ok' })
    cargarCategorias()
  }

  const handleEliminar = async (id, nom) => {
    if (conteos[id] > 0) return setMensaje({ texto: 'No puedes eliminar una categoria con productos', tipo: 'error' })
    if (!confirm('Eliminar categoria ' + nom + '?')) return
    await supabase.from('categorias').delete().eq('id', id)
    setMensaje({ texto: 'Categoria eliminada', tipo: 'ok' })
    cargarCategorias()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <div>
            <h1 className="text-white font-extrabold text-base">Categorias</h1>
            <p className="text-red-200 text-xs">{categorias.length} categorias</p>
          </div>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-white text-red-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">Volver</button>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-5 border border-gray-100">
          <h3 className="font-extrabold text-gray-800 text-sm mb-3">Nueva categoria</h3>
          <div className="flex gap-3">
            <input type="text" placeholder="Nombre de la categoria" value={nombre} onChange={(e) => setNombre(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAgregar()} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
            <button onClick={handleAgregar} className="bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-600 transition text-sm">Agregar</button>
          </div>
          {mensaje.texto && <p className={'text-xs mt-2 ' + (mensaje.tipo === 'ok' ? 'text-green-600' : 'text-red-600')}>{mensaje.texto}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-extrabold text-gray-800 text-sm">Categorias actuales</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {categorias.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{c.nombre}</p>
                  <p className="text-gray-400 text-xs">{conteos[c.id] || 0} productos</p>
                </div>
                <button onClick={() => handleEliminar(c.id, c.nombre)} className={conteos[c.id] > 0 ? 'text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-300 cursor-not-allowed' : 'text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition'}>Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}