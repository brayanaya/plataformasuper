import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

export default function Cuartillas() {
  const [cuartillas, setCuartillas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('cuartillas').select('*').eq('activa', true).order('created_at', { ascending: false })
      if (data) setCuartillas(data)
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <section id="cuartillas" className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Cuartillas</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Promociones y ofertas de la semana</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Cargando promociones...</div>
        ) : cuartillas.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No hay promociones activas por el momento</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cuartillas.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
                <img src={c.imagen_url} alt={c.titulo} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{c.titulo}</h3>
                  <p className="text-sm text-gray-500 mt-1">Valida por tiempo limitado</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
