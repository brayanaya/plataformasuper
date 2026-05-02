import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../services/supabase'
import { useCartStore } from '../../store/cartStore'

const DEMO_CATS = [
  { id: 'todos', nombre: 'Todos' },
  { id: '1', nombre: 'Lacteos' },
  { id: '2', nombre: 'Bebidas' },
  { id: '3', nombre: 'Granos y cereales' },
  { id: '4', nombre: 'Aseo hogar' },
]

const DEMO_PRODS = [
  { id: '1', nombre: 'Leche Entera Alqueria 1L', precio: 4200, imagen_url: null, categoria_id: '1', disponible: true, destacado: true, categorias: { nombre: 'Lacteos' } },
  { id: '2', nombre: 'Arroz Diana 5kg', precio: 18900, imagen_url: null, categoria_id: '3', disponible: true, destacado: false, categorias: { nombre: 'Granos y cereales' } },
  { id: '3', nombre: 'Gaseosa Coca Cola 1.5L', precio: 5500, imagen_url: null, categoria_id: '2', disponible: true, destacado: true, categorias: { nombre: 'Bebidas' } },
  { id: '4', nombre: 'Detergente Ariel 1kg', precio: 12000, imagen_url: null, categoria_id: '4', disponible: true, destacado: false, categorias: { nombre: 'Aseo hogar' } },
  { id: '5', nombre: 'Frijol Cargamanto 1kg', precio: 8500, imagen_url: null, categoria_id: '3', disponible: true, destacado: false, categorias: { nombre: 'Granos y cereales' } },
  { id: '6', nombre: 'Yogur Alpina 200g', precio: 2800, imagen_url: null, categoria_id: '1', disponible: true, destacado: false, categorias: { nombre: 'Lacteos' } },
  { id: '7', nombre: 'Agua Cristal 600ml', precio: 1800, imagen_url: null, categoria_id: '2', disponible: true, destacado: false, categorias: { nombre: 'Bebidas' } },
  { id: '8', nombre: 'Jabon Rey 500g', precio: 6500, imagen_url: null, categoria_id: '4', disponible: true, destacado: false, categorias: { nombre: 'Aseo hogar' } },
]

export default function Catalogo() {
  const [productos, setProductos] = useState(DEMO_PRODS)
  const [categorias, setCategorias] = useState(DEMO_CATS)
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [loading, setLoading] = useState(false)
  const [agregados, setAgregados] = useState({})
  const addItem = useCartStore((s) => s.addItem)
  const scrollRef = useRef(null)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const { data: prods } = await supabase.from('productos').select('*, categorias(nombre)').eq('disponible', true).order('created_at', { ascending: false })
      const { data: cats } = await supabase.from('categorias').select('*').order('nombre')
      if (prods && prods.length > 0) setProductos(prods)
      if (cats && cats.length > 0) setCategorias([{ id: 'todos', nombre: 'Todos' }, ...cats])
      setLoading(false)
    }
    cargar()
  }, [])

  const productosFiltrados = categoriaActiva === 'todos' ? productos : productos.filter((p) => p.categoria_id === categoriaActiva)
  const handleAgregar = (p) => {
    addItem({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 })
    setAgregados((prev) => ({ ...prev, [p.id]: true }))
    setTimeout(() => setAgregados((prev) => ({ ...prev, [p.id]: false })), 1500)
  }
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })

  return (
    <section id="catalogo" className="bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-700">Catalogo</h2>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">Encuentra todo lo que necesitas</p>
          <div className="w-10 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <button onClick={scrollLeft} className="flex-shrink-0 w-7 h-7 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-700 font-bold hover:bg-red-700 hover:text-white transition text-sm">&#8249;</button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categorias.map((c) => (
              <button key={c.id} onClick={() => setCategoriaActiva(c.id)} className={categoriaActiva === c.id ? 'flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-red-700 text-white shadow' : 'flex-shrink-0 px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:border-red-700 hover:text-red-700 transition'}>{c.nombre}</button>
            ))}
          </div>
          <button onClick={scrollRight} className="flex-shrink-0 w-7 h-7 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-700 font-bold hover:bg-red-700 hover:text-white transition text-sm">&#8250;</button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-28 md:h-36 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-sm">No hay productos en esta categoria</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group border border-gray-100 flex flex-col">
                {p.imagen_url ? (
                  <div className="overflow-hidden">
                    <img src={p.imagen_url} alt={p.nombre} className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-28 md:h-36 bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="p-2.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2">{p.nombre}</h3>
                    {p.categorias && <p className="text-gray-400 text-xs mt-0.5">{p.categorias.nombre}</p>}
                  </div>
                  <div className="mt-2">
                    <p className="text-red-700 font-extrabold text-sm">{'$'}{p.precio.toLocaleString('es-CO')}</p>
                    {p.destacado && <span className="text-xs text-yellow-600 font-semibold">Destacado</span>}
                    <button onClick={() => handleAgregar(p)} className={'mt-1.5 w-full font-bold text-xs py-1.5 rounded-full transition-all ' + (agregados[p.id] ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-300')}>
                      {agregados[p.id] ? '✓ Agregado' : 'Agregar'}
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