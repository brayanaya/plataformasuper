import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

const DEMO = [
  { id: '1', titulo: 'Oferta Arroz Diana 5kg', imagen_url: 'https://placehold.co/400x224/dc2626/white?text=Arroz+Diana', activa: true, precio_oferta: 18900 },
  { id: '2', titulo: 'Aceite Gourmet 3L', imagen_url: 'https://placehold.co/400x224/b91c1c/white?text=Aceite+Gourmet', activa: true, precio_oferta: 32000 },
  { id: '3', titulo: 'Frijol Cargamanto 1kg', imagen_url: 'https://placehold.co/400x224/991b1b/white?text=Frijol', activa: true, precio_oferta: 8500 },
]

export default function Cuartillas() {
  const [cuartillas, setCuartillas] = useState(DEMO)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const { data } = await supabase.from('cuartillas').select('*').eq('activa', true).order('created_at', { ascending: false })
      if (data && data.length > 0) setCuartillas(data)
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <section id="cuartillas" className="bg-gray-100 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-700">Cuartillas</h2>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">Promociones y ofertas de la semana</p>
          <div className="w-10 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        {loading ? (
          <p className="text-center text-gray-400 py-10">Cargando promociones...</p>
        ) : (
          <>
            <div className="flex md:hidden gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
              {cuartillas.map((c) => (
                <div key={c.id} className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow border border-gray-100">
                  <div className="relative">
                    <img src={c.imagen_url} alt={c.titulo} className="w-full h-36 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {c.precio_oferta && (
                      <div className="absolute bottom-2 right-2 bg-red-700 text-white font-extrabold text-xs px-2.5 py-1 rounded-full">{'$'}{c.precio_oferta.toLocaleString('es-CO')}</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 text-xs leading-tight">{c.titulo}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Valida por tiempo limitado</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5">
              {cuartillas.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-gray-100">
                  <div className="overflow-hidden relative">
                    <img src={c.imagen_url} alt={c.titulo} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {c.precio_oferta && (
                      <div className="absolute bottom-3 right-3 bg-red-700 text-white font-extrabold text-xs px-3 py-1 rounded-full">{'$'}{c.precio_oferta.toLocaleString('es-CO')}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-sm">{c.titulo}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Valida por tiempo limitado</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}