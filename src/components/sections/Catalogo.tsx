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

const POR_PAGINA = 12

export default function Catalogo() {
  const [productos, setProductos] = useState(DEMO_PRODS)
  const [categorias, setCategorias] = useState(DEMO_CATS)
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [loading, setLoading] = useState(false)
  const [agregados, setAgregados] = useState({})
  const [pagina, setPagina] = useState(1)
  const [productoModal, setProductoModal] = useState<any>(null)
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
  const productosVisibles = productosFiltrados.slice(0, pagina * POR_PAGINA)
  const hayMas = productosVisibles.length < productosFiltrados.length
  const handleCat = (id: string) => { setCategoriaActiva(id); setPagina(1) }

  const handleAgregar = (p: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    addItem({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1, imagen_url: p.imagen_url || undefined })
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
          <button onClick={scrollLeft} className="flex-shrink-0 w-7 h-7 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-700 hover:text-white hover:border-red-700 transition text-sm">&#8249;</button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categorias.map((c) => (
              <button key={c.id} onClick={() => handleCat(c.id)} className={categoriaActiva === c.id ? 'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-red-700 text-white shadow-sm' : 'flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-500 text-xs font-medium hover:border-red-700 hover:text-red-700 transition'}>{c.nombre}</button>
            ))}
          </div>
          <button onClick={scrollRight} className="flex-shrink-0 w-7 h-7 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-700 hover:text-white hover:border-red-700 transition text-sm">&#8250;</button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-100" />
                <div className="p-3 space-y-2"><div className="h-2.5 bg-gray-100 rounded w-3/4" /><div className="h-2.5 bg-gray-100 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-sm">No hay productos en esta categoria</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {productosVisibles.map((p) => (
                <div key={p.id} onClick={() => setProductoModal(p)} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col cursor-pointer">
                  <div className="relative overflow-hidden">
                    {p.imagen_url ? (
                      <img src={p.imagen_url} alt={p.nombre} className="w-full h-32 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-32 md:h-36 bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    {p.destacado && <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-extrabold px-2 py-0.5 rounded-full">Destacado</span>}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="font-semibold text-gray-800 text-xs leading-tight line-clamp-2 flex-1">{p.nombre}</p>
                    {p.categorias && <p className="text-gray-400 text-xs mt-1">{p.categorias.nombre}</p>}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-red-700 font-extrabold text-sm">{'$'}{p.precio.toLocaleString('es-CO')}</p>
                      <button onClick={(e) => handleAgregar(p, e)} className={'text-xs font-bold px-3 py-1.5 rounded-full transition-all flex-shrink-0 ' + (agregados[p.id] ? 'bg-green-500 text-white' : 'bg-red-700 text-white hover:bg-red-600')}>
                        {agregados[p.id] ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hayMas && (
              <div className="text-center mt-8">
                <p className="text-gray-400 text-xs mb-3">{productosVisibles.length} de {productosFiltrados.length} productos</p>
                <button onClick={() => setPagina(p => p + 1)} className="bg-white border border-gray-200 text-gray-600 font-bold px-8 py-2.5 rounded-full hover:border-red-700 hover:text-red-700 transition text-sm shadow-sm">Ver mas productos</button>
              </div>
            )}
          </>
        )}
      </div>
      {productoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={() => setProductoModal(null)}>
          <div className="bg-white w-full sm:rounded-2xl sm:max-w-sm overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {productoModal.imagen_url ? (
              <img src={productoModal.imagen_url} alt={productoModal.nombre} className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            <div className="p-5">
              {productoModal.categorias && <p className="text-red-700 text-xs font-semibold uppercase tracking-wider mb-1">{productoModal.categorias.nombre}</p>}
              <h2 className="font-extrabold text-gray-800 text-lg leading-tight">{productoModal.nombre}</h2>
              <p className="text-3xl font-extrabold text-red-700 mt-2">{'$'}{productoModal.precio.toLocaleString('es-CO')}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <div key={s} className="w-3 h-3 rounded-full bg-yellow-400" />)}
                </div>
                <span className="text-gray-400 text-xs">Producto de calidad garantizada</span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Disponible para domicilio en Neiva
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setProductoModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition text-sm">Cerrar</button>
                <button onClick={() => { handleAgregar(productoModal); setProductoModal(null) }} className="flex-1 bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition text-sm">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}