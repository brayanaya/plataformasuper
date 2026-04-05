import { useEffect, useState, useRef } from "react"
import { supabase } from "../../services/supabase"
import { useCartStore } from "../../store/cartStore"

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState("todos")
  const [loading, setLoading] = useState(true)
  const [agregados, setAgregados] = useState({})
  const addItem = useCartStore((s) => s.addItem)
  const scrollRef = useRef(null)

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

  const todasCats = [{ id: "todos", nombre: "Todos" }, ...categorias]
  const catsLoop = [...todasCats, ...todasCats, ...todasCats]

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const third = el.scrollWidth / 3
    if (el.scrollLeft >= third * 2) el.scrollLeft -= third
    if (el.scrollLeft <= 0) el.scrollLeft += third
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth / 3
  }, [categorias])

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -150, behavior: "smooth" })
  const scrollRight = () => scrollRef.current.scrollBy({ left: 150, behavior: "smooth" })

  return (
    <section id="catalogo" className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Catalogo</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Encuentra todo lo que necesitas</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        <div className="flex items-center gap-2 mb-10">
          <button onClick={scrollLeft} className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-700 font-bold hover:bg-red-50 transition">
            &#8249;
          </button>
          <div ref={scrollRef} onScroll={handleScroll} className="flex gap-2 overflow-x-hidden">
            {catsLoop.map((c, i) => (
              <button key={i} onClick={() => setCategoriaActiva(c.id)} className={categoriaActiva === c.id ? "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-red-700 text-white" : "flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 text-xs font-medium hover:border-red-700 hover:text-red-700 transition"}>{c.nombre}</button>
            ))}
          </div>
          <button onClick={scrollRight} className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-700 font-bold hover:bg-red-50 transition">
            &#8250;
          </button>
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