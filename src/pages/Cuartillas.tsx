export default function Cuartillas() {
  return (
    <section id="cuartillas" className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Cuartillas</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Promociones y ofertas de la semana</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="bg-gray-200 h-56 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Imagen de promocion</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Promocion {i}</h3>
                <p className="text-sm text-gray-500 mt-1">Valida por tiempo limitado</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}