import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"

export default function Cuartillas() {
  const [cuartillas, setCuartillas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from("cuartillas").select("*").eq("activa", true).order("created_at", { ascending: false })
      if (data) setCuartillas(data)
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <section id="cuartillas" className="bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-red-700">Cuartillas</h2>
          <p className="text-gray-500 mt-2 text-xs md:text-base">Promociones y ofertas de la semana</p>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-10">Cargando promociones...</div>
        ) : cuartillas.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No hay promociones activas por el momento</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cuartillas.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="overflow-hidden">
                  <img src={c.imagen_url} alt={c.titulo} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{c.titulo}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Valida por tiempo limitado</p>
                  </div>
                  {c.precio_oferta && (
                    <span className="bg-red-700 text-white font-extrabold text-sm px-3 py-1 rounded-full">${c.precio_oferta.toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}