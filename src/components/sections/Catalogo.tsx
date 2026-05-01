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
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-red-700">Catalogo</h2>
          <p className="text-gray-500 mt-2 text-xs md:text-base">Encuentra todo lo que necesitas</p>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="flex items-center gap-2 mb-8">
          <button onClick={scrollLeft} className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-700 font-bold hover:bg-red-700 hover:text-white transition">&#8249;</button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categorias.map((c) => (
              <button key={c.id} onClick={() => setCategoriaActiva(c.id)} className={categoriaActiva === c.id ? 'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-red-700 text-white shadow' : 'flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:border-red-700 hover:text-red-700 transition'}>{c.nombre}</button>
            ))}
          </div>
          <button onClick={scrollRight} className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-700 font-bold hover:bg-red-700 hover:text-white transition">&#8250;</button>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No hay productos disponibles</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-gray-100">
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.nombre} className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-32 md:h-40 bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
                    <span className="text-4xl opacity-40">🛒</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{p.nombre}</h3>
                  {p.categorias && <p className="text-gray-400 text-xs mt-0.5">{p.categorias.nombre}</p>}
                  <p className="text-red-700 font-extrabold mt-1 text-sm md:text-base">{'$'}{p.precio.toLocaleString('es-CO')}</p>
                  <button onClick={() => handleAgregar(p)} className={agregados[p.id] ? 'mt-2 w-full font-bold text-xs py-2 rounded-full bg-green-500 text-white transition-all' : 'mt-2 w-full font-bold text-xs py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all'}>
                    {agregados[p.id] ? '✓ Agregado' : 'Agregar'}
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