import { useState, useEffect } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminCuartillas() {
  const [cuartillas, setCuartillas] = useState([])
  const [titulo, setTitulo] = useState("")
  const [precioOferta, setPrecioOferta] = useState("")
  const [archivo, setArchivo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [editando, setEditando] = useState(null)
  const [editTitulo, setEditTitulo] = useState("")
  const [editPrecio, setEditPrecio] = useState("")
  const navigate = useNavigate()

  useEffect(() => { cargarCuartillas() }, [])

  const cargarCuartillas = async () => {
    const { data } = await supabase.from("cuartillas").select("*").order("created_at", { ascending: false })
    if (data) setCuartillas(data)
  }

  const handleSubir = async () => {
    if (!titulo || !archivo) return setMensaje("Completa todos los campos")
    setLoading(true)
    const nombreArchivo = Date.now() + "-" + archivo.name
    const { error: uploadError } = await supabase.storage.from("cuartillas").upload(nombreArchivo, archivo)
    if (uploadError) { setMensaje("Error al subir imagen"); setLoading(false); return }
    const { data: urlData } = supabase.storage.from("cuartillas").getPublicUrl(nombreArchivo)
    await supabase.from("cuartillas").insert({ titulo, imagen_url: urlData.publicUrl, activa: true, precio_oferta: precioOferta ? parseFloat(precioOferta) : null })
    setTitulo("")
    setPrecioOferta("")
    setArchivo(null)
    setMensaje("Cuartilla subida exitosamente")
    cargarCuartillas()
    setLoading(false)
  }

  const handleEliminar = async (id, imagen_url) => {
    if (!confirm("Seguro que quieres eliminar esta cuartilla?")) return
    const partes = imagen_url.split("/")
    const nombreArchivo = partes[partes.length - 1]
    await supabase.storage.from("cuartillas").remove([nombreArchivo])
    await supabase.from("cuartillas").delete().eq("id", id)
    cargarCuartillas()
  }

  const toggleActiva = async (id, activa) => {
    await supabase.from("cuartillas").update({ activa: !activa }).eq("id", id)
    cargarCuartillas()
  }

  const handleEditar = async (id) => {
    await supabase.from("cuartillas").update({ titulo: editTitulo, precio_oferta: editPrecio ? parseFloat(editPrecio) : null }).eq("id", id)
    setEditando(null)
    cargarCuartillas()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="La Economia Aya" className="h-12 w-auto" />
          <span className="font-bold text-lg">Gestionar Cuartillas</span>
        </div>
        <button onClick={() => navigate("/admin/dashboard")} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition">Volver</button>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h3 className="font-extrabold text-gray-800 text-xl mb-6">Subir nueva cuartilla</h3>
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Titulo de la promocion" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="number" placeholder="Precio de oferta (opcional)" value={precioOferta} onChange={(e) => setPrecioOferta(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}
            <button onClick={handleSubir} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
              {loading ? "Subiendo..." : "Subir cuartilla"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cuartillas.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img src={c.imagen_url} alt={c.titulo} className="w-full h-48 object-cover" />
              <div className="p-4 flex flex-col gap-3">
                {editando === c.id ? (
                  <>
                    <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700" />
                    <input type="number" placeholder="Precio de oferta" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700" />
                    <div className="flex gap-2">
                      <button onClick={() => handleEditar(c.id)} className="flex-1 text-xs font-bold py-2 rounded-full bg-green-500 text-white hover:bg-green-400 transition">Guardar</button>
                      <button onClick={() => setEditando(null)} className="flex-1 text-xs font-bold py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-800">{c.titulo}</h3>
                    {c.precio_oferta && <p className="text-red-700 font-extrabold">${c.precio_oferta.toLocaleString()}</p>}
                    <div className="flex gap-2">
                      <button onClick={() => { setEditando(c.id); setEditTitulo(c.titulo); setEditPrecio(c.precio_oferta || "") }} className="flex-1 text-xs font-bold py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Editar</button>
                      <button onClick={() => toggleActiva(c.id, c.activa)} className={c.activa ? "flex-1 text-xs font-bold py-2 rounded-full bg-green-100 text-green-700" : "flex-1 text-xs font-bold py-2 rounded-full bg-gray-100 text-gray-500"}>
                        {c.activa ? "Activa" : "Inactiva"}
                      </button>
                    </div>
                    <button onClick={() => handleEliminar(c.id, c.imagen_url)} className="w-full text-xs font-bold py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition">
                      Eliminar
                    </button>
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