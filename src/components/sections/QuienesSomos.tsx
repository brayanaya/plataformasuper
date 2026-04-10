export default function QuienesSomos() {
  const valores = [
    { icon: "💰", titulo: "Precios bajos", desc: "Siempre los mejores precios para tu canasta familiar" },
    { icon: "🤝", titulo: "Atencion cercana", desc: "Un trato familiar y personalizado en cada visita" },
    { icon: "📦", titulo: "Variedad", desc: "Todo lo que necesitas en un solo lugar" },
    { icon: "🚴", titulo: "Domicilios", desc: "Llevamos tus compras hasta la puerta de tu casa" },
  ]

  return (
    <section id="quienes-somos" className="bg-gray-50 py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-2xl md:text-4xl font-extrabold text-red-700">Quienes Somos</h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-14">
          <div className="flex justify-center" data-aos="fade-right">
            <div className="relative">
              <div className="absolute inset-0 bg-red-700 rounded-full blur-3xl opacity-20" />
              <img src="/logo.png" alt="La Economia Aya" className="relative w-48 md:w-64 h-auto drop-shadow-2xl" />
            </div>
          </div>
          <div className="flex flex-col gap-4" data-aos="fade-left">
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">Supermercado La Economia Aya</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Somos un supermercado familiar ubicado en Neiva, Huila. Con anos de experiencia sirviendo a nuestra comunidad con los mejores precios en productos de la canasta familiar.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Nos caracterizamos por la calidad de nuestros productos, la calidez en la atencion y el compromiso con el bienestar de nuestros clientes y sus familias.
            </p>
            <div className="flex gap-4 mt-2">
              <div className="bg-red-700 text-white rounded-2xl px-4 py-3 text-center flex-1">
                <p className="font-extrabold text-xl">2</p>
                <p className="text-xs text-red-200">Sedes</p>
              </div>
              <div className="bg-yellow-400 text-black rounded-2xl px-4 py-3 text-center flex-1">
                <p className="font-extrabold text-xl">7</p>
                <p className="text-xs">Dias/semana</p>
              </div>
              <div className="bg-black text-white rounded-2xl px-4 py-3 text-center flex-1">
                <p className="font-extrabold text-xl">6am</p>
                <p className="text-xs text-gray-400">Abrimos</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {valores.map((v, i) => (
            <div key={v.titulo} data-aos="fade-up" data-aos-delay={i * 100} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition text-center flex flex-col gap-2">
              <span className="text-3xl">{v.icon}</span>
              <h4 className="font-bold text-gray-800 text-sm">{v.titulo}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div data-aos="fade-right" className="bg-white rounded-2xl shadow-sm p-7 border-t-4 border-red-700">
            <h3 className="text-lg font-extrabold text-red-700 mb-3">Mision</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Ofrecer a nuestros clientes productos de calidad al mejor precio, con una atencion personalizada y cercana, contribuyendo al bienestar de las familias neivaanas.
            </p>
          </div>
          <div data-aos="fade-left" className="bg-white rounded-2xl shadow-sm p-7 border-t-4 border-yellow-400">
            <h3 className="text-lg font-extrabold text-yellow-500 mb-3">Vision</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Ser el supermercado de referencia en Neiva, reconocido por nuestra variedad, precios competitivos y excelente servicio, expandiendo nuestra presencia en la region.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}