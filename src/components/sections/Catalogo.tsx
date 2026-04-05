import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { useCartStore } from "../../store/cartStore"

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState("todos")
  const [loading, setLoading] = useState(true)
  const [agregados, setAgregados] = useState({})
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    const { data: prods } = await supabase.from("productos").select("*, categorias(nombre)").eq("disponible", true).order("created_at", { ascending: false })
    const { data: cats } = await supabase.from("categorias").select("*").order("nombre")
    if (prods) setProductos(prods)
    if (cats) setCategorias(cats)
    setLoading(false)
  }

  const productosFiltrados = categoriaActiva === "todos" ? productos : productos.filter((p) => p.categoria_id === categoriaActiva)

  const handleAgregar = (p) => {
    addItem({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 })
    setAgregados((prev) => ({ ...prev, [p.id]: true }))
    setTimeout(() => setAgregados((prev) => ({ ...prev, [p.id]: false })), 1500)
  }

  const btnClass = (id) => {
    if (agregados[id]) return "mt-2 w-full font-bold text-xs py-2 rounded-full bg-green-500 text-white transition-all duration-300"
    return "mt-2 w-full font-bold text-xs py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-300"
  }

  return (
    <section id="catalogo" className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Catalogo</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Encuentra todo lo que necesitas</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button onClick={() => setCategoriaActiva("todos")} className={categoriaActiva === "todos" ? "px-4 py-2 rounded-full text-sm font-bold bg-red-700 text-white" : "px-4 py-2 rounded-full border-2 border-red-700 text-red-700 font-semibold text-sm hover:bg-red-700 hover:text-white transition"}>Todos</button>
          {categorias.map((c) => (
            <button key={c.id} onClick={() => setCategoriaActiva(c.id)} className={categoriaActiva === c.id ? "px-4 py-2 rounded-full text-sm font-bold bg-red-700 text-white" : "px-4 py-2 rounded-full border-2 border-red-700 text-red-700 font-semibold text-sm hover:bg-red-700 hover:text-white transition"}>{c.nombre}</button>
          ))}
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No hay productos disponibles</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="bg-gray-50 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.nombre} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sin imagen</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm">{p.nombre}</h3>
                  {p.categorias && <p className="text-gray-400 text-xs mt-1">{p.categorias.nombre}</p>}
                  <p className="text-red-700 font-extrabold mt-1 text-base">${p.precio.toLocaleString()}</p>
                  <button onClick={() => handleAgregar(p)} className={btnClass(p.id)}>
                    {agregados[p.id] ? "Agregado!" : "Agregar al carrito"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}