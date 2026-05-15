import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ texto: '', ok: true })
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  const [editArchivo, setEditArchivo] = useState(null)
  const [destacado, setDestacado] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { cargarProductos(); cargarCategorias() }, [])

  const cargarProductos = async () => {
    const { data } = await supabase.from('productos').select('*, categorias(nombre)').order('created_at', { ascending: false })
    if (data) setProductos(data)
  }

  const cargarCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    if (data) setCategorias(data)
  }

  const subirImagen = async (file, bucket) => {
    const nombreArchivo = Date.now() + '-' + file.name
    const { error } = await supabase.storage.from(bucket).upload(nombreArchivo, file)
    if (error) return null
    const { data } = supabase.storage.from(bucket).getPublicUrl(nombreArchivo)
    return data.publicUrl
  }

  const handleAgregar = async () => {
    if (!nombre || !precio || !categoriaId) return setMsg({ texto: 'Nombre, precio y categoria son obligatorios', ok: false })
    setLoading(true)
    let imagen_url = null
    if (archivo) { imagen_url = await subirImagen(archivo, 'productos'); if (!imagen_url) { setMsg({ texto: 'Error al subir imagen', ok: false }); setLoading(false); return } }
    await supabase.from('productos').insert({ nombre, precio: parseFloat(precio), imagen_url, categoria_id: categoriaId, disponible: true, destacado })
    setNombre(''); setPrecio(''); setCategoriaId(''); setArchivo(null); setDestacado(false)
    setMsg({ texto: 'Producto agregado', ok: true })
    cargarProductos(); setLoading(false)
  }

  const handleEditar = async (id) => {
    if (!editNombre || !editPrecio) return
    let imagen_url = undefined
    if (editArchivo) { imagen_url = await subirImagen(editArchivo, 'productos') }
    const update: any = { nombre: editNombre, precio: parseFloat(editPrecio) }
    if (imagen_url) update.imagen_url = imagen_url
    await supabase.from('productos').update(update).eq('id', id)
    setEditando(null); setEditArchivo(null); cargarProductos()
  }

  const handleEliminar = async (id) => {
    if (!confirm('Eliminar este producto?')) return
    await supabase.from('productos').delete().eq('id', id)
    cargarProductos()
  }

  const toggleDisponible = async (id, disponible) => {
    await supabase.from('productos').update({ disponible: !disponible }).eq('id', id)
    cargarProductos()
  }

  const productosFiltrados = productos.filter((p: any) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-4 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <div>
            <h1 className="text-white font-extrabold text-sm">Productos</h1>
            <p className="text-red-200 text-xs">{productos.length} en total</p>
          </div>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-white text-red-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">Volver</button>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h3 className="font-extrabold text-gray-800 text-sm mb-4">Agregar producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Nombre del producto *" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
            <input type="number" placeholder="Precio *" value={precio} onChange={(e) => setPrecio(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700">
              <option value="" disabled>Selecciona una categoria *</option>
              {categorias.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <div className="flex items-center gap-3">
              <label className="flex-1 border border-dashed border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-pointer hover:border-red-300 transition truncate">
                {archivo ? archivo.name : 'Imagen (opcional)'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer flex-shrink-0">
                <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} className="w-4 h-4 accent-red-700" />
                Destacado
              </label>
            </div>
          </div>
          {msg.texto && <p className={'text-xs mt-3 ' + (msg.ok ? 'text-green-600' : 'text-red-600')}>{msg.texto}</p>}
          <button onClick={handleAgregar} disabled={loading} className="mt-4 bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm">
            {loading ? 'Guardando...' : 'Agregar producto'}
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
          <input type="text" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
          <p className="text-gray-400 text-xs mt-2">{productosFiltrados.length} productos encontrados</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {productosFiltrados.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative">
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.nombre} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gray-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span className={'absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ' + (p.disponible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {p.disponible ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {editando === p.id ? (
                  <>
                    <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-red-700" />
                    <input type="number" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-red-700" />
                    <label className="border border-dashed border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-400 cursor-pointer hover:border-red-300 transition truncate">
                      {editArchivo ? editArchivo.name : 'Cambiar imagen (opcional)'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditArchivo(e.target.files?.[0] || null)} />
                    </label>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditar(p.id)} className="flex-1 text-xs font-bold py-1.5 rounded-full bg-green-500 text-white hover:bg-green-400 transition">Guardar</button>
                      <button onClick={() => { setEditando(null); setEditArchivo(null) }} className="flex-1 text-xs font-bold py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-gray-800 text-xs leading-tight line-clamp-2">{p.nombre}</p>
                    <p className="text-red-700 font-extrabold text-sm">{'$'}{p.precio.toLocaleString('es-CO')}</p>
                    {p.categorias && <p className="text-gray-400 text-xs">{p.categorias.nombre}</p>}
                    <div className="flex gap-1">
                      <button onClick={() => { setEditando(p.id); setEditNombre(p.nombre); setEditPrecio(p.precio) }} className="flex-1 text-xs font-bold py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Editar</button>
                      <button onClick={() => toggleDisponible(p.id, p.disponible)} className={'flex-1 text-xs font-bold py-1.5 rounded-full transition ' + (p.disponible ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200')}>
                        {p.disponible ? 'Pausar' : 'Activar'}
                      </button>
                    </div>
                    <button onClick={() => handleEliminar(p.id)} className="w-full text-xs font-bold py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Eliminar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}