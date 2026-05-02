export default function QuienesSomos() {
  const valores = [
    { emoji: '💰', titulo: 'Precios bajos', desc: 'Siempre los mejores precios para tu canasta familiar' },
    { emoji: '🤝', titulo: 'Atencion familiar', desc: 'Te atendemos con el calor de siempre, como en casa' },
    { emoji: '✅', titulo: 'Calidad garantizada', desc: 'Productos frescos y de las mejores marcas' },
    { emoji: '🚀', titulo: 'Domicilios rapidos', desc: 'Llevamos tu pedido a tu barrio en Neiva' },
  ]
  return (
    <section id="quienes-somos" className="bg-gray-100 py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-700">Quienes Somos</h2>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">Conoce nuestra historia y valores</p>
          <div className="w-10 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="La Economia Aya" className="h-44 w-auto drop-shadow-xl" />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {valores.map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-2xl">{v.emoji}</span>
                <h4 className="font-extrabold text-gray-800 text-xs mb-1 mt-2">{v.titulo}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border-l-4 border-red-700 shadow-sm">
            <h4 className="font-extrabold text-red-700 text-sm mb-2">Mision</h4>
            <p className="text-gray-600 text-xs leading-relaxed">Ofrecer a las familias de Neiva productos de calidad a los mejores precios, con un servicio cercano, honesto y rapido que facilite el mercado del hogar.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border-l-4 border-yellow-400 shadow-sm">
            <h4 className="font-extrabold text-yellow-500 text-sm mb-2">Vision</h4>
            <p className="text-gray-600 text-xs leading-relaxed">Ser el supermercado de referencia en el sur de Colombia, reconocido por la confianza de nuestros clientes, la calidad de nuestros productos y nuestro compromiso con la comunidad.</p>
          </div>
        </div>
      </div>
    </section>
  )
}