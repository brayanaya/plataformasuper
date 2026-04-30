import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useCartStore } from '../../store/cartStore'

interface Categoria { id: string; nombre: string; icono: string | null }
interface Producto { id: string; nombre: string; precio: number; imagen_url: string | null; categoria_id: string; disponible: boolean; destacado: boolean }

export default function Catalogo() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [agregados, setAgregados] = useState<Record<string, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categorias').select('*').order('nombre'),
        supabase.from('productos').select('*').eq('disponible', true).order('nombre'),
      ])
      if (cats) setCategorias(cats)
      if (prods) setProductos(prods)
      setLoading(false)
    }
    fetchData()
  }, [])

  const productosFiltrados = categoriaActiva === 'todos' ? productos : productos.filter((p) => p.categoria_id === categoriaActiva)

  const handleAgregar = (producto: Producto) => {
    addItem({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1, imagen_url: producto.imagen_url || undefined })
    setAgregados((prev) => ({ ...prev, [producto.id]: true }))
    setTimeout(() => setAgregados((prev) => ({ ...prev, [producto.id]: false })), 1500)
  }

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  const todasCats = [{ id: 'todos', nombre: 'Todos', icono: null }, ...categorias]

  const btnCat = (activo: boolean) => activo ? 'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap bg-red-700 text-white shadow' : 'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap bg-white text-gray-700 border border-gray-200 hover:border-red-700 hover:text-red-700'
  const btnAgregar = (agregado: boolean) => agregado ? 'mt-2 w-full py-1.5 rounded-full text-xs font-bold transition bg-green-500 text-white' : 'mt-2 w-full py-1.5 rounded-full text-xs font-bold transition bg-red-700 text-white hover:bg-red-600'

  return (
    <section id="catalogo" className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Catalogo</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Encuentra todo lo que necesitas</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => scroll('left')} className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 hover:text-white transition flex-shrink-0">{'<'}</button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            {todasCats.map((cat) => (
              <button key={cat.id} onClick={() => setCategoriaActiva(cat.id)} className={btnCat(categoriaActiva === cat.id)}>
                {cat.nombre}
              </button>
            ))}
          </div>
          <button onClick={() => scroll('right')} className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 hover:text-white transition flex-shrink-0">{'>'}</button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-2xl" />
                <div className="p-3 space-y-2"><div className="h-3 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><p className="text-sm">No hay productos en esta categoria.</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group flex flex-col">
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin imagen</div>
                  )}
                  {producto.destacado && <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">Destacado</span>}
                </div>
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <p className="text-gray-800 font-semibold text-sm leading-tight line-clamp-2">{producto.nombre}</p>
                  <div className="mt-2">
                    <p className="text-red-700 font-extrabold text-base">{'$'}{producto.precio.toLocaleString('es-CO')}</p>
                    <button onClick={() => handleAgregar(producto)} className={btnAgregar(agregados[producto.id])}>
                      {agregados[producto.id] ? 'Agregado' : 'Agregar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}