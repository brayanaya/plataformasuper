import { useState, useEffect } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [archivo, setArchivo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [editando, setEditando] = useState(null)
  const [editNombre, setEditNombre] = useState("")
  const [editPrecio, setEditPrecio] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    cargarProductos()
    cargarCategorias()
  }, [])

  const cargarProductos = async () => {
    const { data } = await supabase.from("productos").select("*, categorias(nombre)").order("created_at", { ascending: false })
    if (data) setProductos(data)
  }

  const cargarCategorias = async () => {
    const { data } = await supabase.from("categorias").select("*").order("nombre")
    if (data) setCategorias(data)
  }

  const handleSubir = async () => {
    if (!nombre || !precio || !categoriaId) return setMensaje("Nombre, precio y categoria son obligatorios")
    setLoading(true)
    let imagen_url = null
    if (archivo) {
      const nombreArchivo = Date.now() + "-" + archivo.name
      const { error: uploadError } = await supabase.storage.from("productos").upload(nombreArchivo, archivo)
      if (uploadError) { setMensaje("Error al subir imagen"); setLoading(false); return }
      const { data: urlData } = supabase.storage.from("productos").getPublicUrl(nombreArchivo)
      imagen_url = urlData.publicUrl
    }
    await supabase.from("productos").insert({ nombre, precio: parseFloat(precio), imagen_url, categoria_id: categoriaId, disponible: true })
    setNombre("")
    setPrecio("")
    setCategoriaId("")
    setArchivo(null)
    setMensaje("Producto agregado exitosamente")
    cargarProductos()
    setLoading(false)
  }

  const handleEliminar = async (id) => {
    if (!confirm("Seguro que quieres eliminar este producto?")) return
    await supabase.from("productos").delete().eq("id", id)
    cargarProductos()
  }

  const toggleDisponible = async (id, disponible) => {
    await supabase.from("productos").update({ disponible: !disponible }).eq("id", id)
    cargarProductos()
  }

  const handleEditar = async (id) => {
    if (!editNombre || !editPrecio) return
    await supabase.from("productos").update({ nombre: editNombre, precio: parseFloat(editPrecio) }).eq("id", id)
    setEditando(null)
    cargarProductos()
  }

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="La Economia Aya" className="h-12 w-auto" />
          <span className="font-bold text-lg">Gestionar Productos</span>
        </div>
        <button onClick={() => navigate("/admin/dashboard")} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition">Volver</button>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="font-extrabold text-gray-800 text-xl mb-6">Agregar nuevo producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700">
              <option value="" disabled>Selecciona una categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm" />
          </div>
          {mensaje && <p className="text-sm text-green-600 mt-3">{mensaje}</p>}
          <button onClick={handleSubir} disabled={loading} className="mt-4 bg-red-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
            {loading ? "Guardando..." : "Agregar producto"}
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <input type="text" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {p.imagen_url ? (
                <img src={p.imagen_url} alt={p.nombre} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Sin imagen</span>
                </div>
              )}
              <div className="p-3 flex flex-col gap-2">
                {editando === p.id ? (
                  <>
                    <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-red-700" />
                    <input type="number" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-red-700" />
                    <div className="flex gap-1">
                      <button onClick={() => handleEditar(p.id)} className="flex-1 text-xs font-bold py-1.5 rounded-full bg-green-500 text-white hover:bg-green-400 transition">Guardar</button>
                      <button onClick={() => setEditando(null)} className="flex-1 text-xs font-bold py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-800 text-xs leading-tight">{p.nombre}</h3>
                    <p className="text-red-700 font-extrabold text-sm">${p.precio.toLocaleString()}</p>
                    {p.categorias && <p className="text-gray-400 text-xs">{p.categorias.nombre}</p>}
                    <div className="flex gap-1">
                      <button onClick={() => { setEditando(p.id); setEditNombre(p.nombre); setEditPrecio(p.precio) }} className="flex-1 text-xs font-bold py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Editar</button>
                      <button onClick={() => toggleDisponible(p.id, p.disponible)} className={p.disponible ? "flex-1 text-xs font-bold py-1.5 rounded-full bg-green-100 text-green-700" : "flex-1 text-xs font-bold py-1.5 rounded-full bg-gray-100 text-gray-500"}>
                        {p.disponible ? "Activo" : "Inactivo"}
                      </button>
                    </div>
                    <button onClick={() => handleEliminar(p.id)} className="w-full text-xs font-bold py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition">Eliminar</button>
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