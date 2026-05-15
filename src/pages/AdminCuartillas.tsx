import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminCuartillas() {
  const [cuartillas, setCuartillas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [precioOferta, setPrecioOferta] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ texto: '', ok: true })
  const [editando, setEditando] = useState(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  const [editArchivo, setEditArchivo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { cargarCuartillas() }, [])

  const cargarCuartillas = async () => {
    const { data } = await supabase.from('cuartillas').select('*').order('created_at', { ascending: false })
    if (data) setCuartillas(data)
  }

  const subirImagen = async (file) => {
    const nombreArchivo = Date.now() + '-' + file.name
    const { error } = await supabase.storage.from('cuartillas').upload(nombreArchivo, file)
    if (error) return null
    const { data } = supabase.storage.from('cuartillas').getPublicUrl(nombreArchivo)
    return data.publicUrl
  }

  const handleSubir = async () => {
    if (!titulo || !archivo) return setMsg({ texto: 'Titulo e imagen son obligatorios', ok: false })
    setLoading(true)
    const url = await subirImagen(archivo)
    if (!url) { setMsg({ texto: 'Error al subir imagen', ok: false }); setLoading(false); return }
    await supabase.from('cuartillas').insert({ titulo, imagen_url: url, activa: true, precio_oferta: precioOferta ? parseFloat(precioOferta) : null })
    setTitulo(''); setPrecioOferta(''); setArchivo(null)
    setMsg({ texto: 'Cuartilla subida exitosamente', ok: true })
    cargarCuartillas(); setLoading(false)
  }

  const handleEditar = async (id) => {
    let imagen_url = undefined
    if (editArchivo) { imagen_url = await subirImagen(editArchivo) }
    const update: any = { titulo: editTitulo, precio_oferta: editPrecio ? parseFloat(editPrecio) : null }
    if (imagen_url) update.imagen_url = imagen_url
    await supabase.from('cuartillas').update(update).eq('id', id)
    setEditando(null); setEditArchivo(null); cargarCuartillas()
  }

  const handleEliminar = async (id, imagen_url) => {
    if (!confirm('Eliminar esta cuartilla?')) return
    const partes = imagen_url.split('/')
    await supabase.storage.from('cuartillas').remove([partes[partes.length - 1]])
    await supabase.from('cuartillas').delete().eq('id', id)
    cargarCuartillas()
  }

  const toggleActiva = async (id, activa) => {
    await supabase.from('cuartillas').update({ activa: !activa }).eq('id', id)
    cargarCuartillas()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 px-4 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10 w-auto" />
          <div>
            <h1 className="text-white font-extrabold text-sm">Cuartillas</h1>
            <p className="text-red-200 text-xs">{cuartillas.length} en total</p>
          </div>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="bg-white text-red-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">Volver</button>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h3 className="font-extrabold text-gray-800 text-sm mb-4">Subir nueva cuartilla</h3>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Titulo de la promocion *" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
            <input type="number" placeholder="Precio de oferta (opcional)" value={precioOferta} onChange={(e) => setPrecioOferta(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
            <label className="border border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-pointer hover:border-red-300 transition">
              {archivo ? archivo.name : 'Seleccionar imagen *'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
            </label>
          </div>
          {msg.texto && <p className={'text-xs mt-3 ' + (msg.ok ? 'text-green-600' : 'text-red-600')}>{msg.texto}</p>}
          <button onClick={handleSubir} disabled={loading} className="mt-4 bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm">
            {loading ? 'Subiendo...' : 'Subir cuartilla'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuartillas.map((c: any) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative">
                <img src={c.imagen_url} alt={c.titulo} className="w-full h-44 object-cover" />
                <span className={'absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ' + (c.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {c.activa ? 'Activa' : 'Inactiva'}
                </span>
                {c.precio_oferta && <span className="absolute bottom-2 left-2 bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-full">{'$'}{c.precio_oferta.toLocaleString('es-CO')}</span>}
              </div>
              <div className="p-4 flex flex-col gap-3">
                {editando === c.id ? (
                  <>
                    <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700" />
                    <input type="number" placeholder="Precio de oferta" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700" />
                    <label className="border border-dashed border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-400 cursor-pointer hover:border-red-300 transition">
                      {editArchivo ? editArchivo.name : 'Cambiar imagen (opcional)'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditArchivo(e.target.files?.[0] || null)} />
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditar(c.id)} className="flex-1 text-xs font-bold py-2 rounded-full bg-green-500 text-white hover:bg-green-400 transition">Guardar</button>
                      <button onClick={() => { setEditando(null); setEditArchivo(null) }} className="flex-1 text-xs font-bold py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-gray-800 text-sm leading-tight">{c.titulo}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditando(c.id); setEditTitulo(c.titulo); setEditPrecio(c.precio_oferta || '') }} className="flex-1 text-xs font-bold py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Editar</button>
                      <button onClick={() => toggleActiva(c.id, c.activa)} className={'flex-1 text-xs font-bold py-2 rounded-full transition ' + (c.activa ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200')}>
                        {c.activa ? 'Pausar' : 'Activar'}
                      </button>
                    </div>
                    <button onClick={() => handleEliminar(c.id, c.imagen_url)} className="w-full text-xs font-bold py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Eliminar</button>
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