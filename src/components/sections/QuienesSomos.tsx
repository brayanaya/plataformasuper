export default function QuienesSomos() {
  const valores = [
    { titulo: 'Precios bajos', desc: 'Siempre los mejores precios para tu canasta familiar' },
    { titulo: 'Atencion familiar', desc: 'Te atendemos con el calor de siempre, como en casa' },
    { titulo: 'Calidad garantizada', desc: 'Productos frescos y de las mejores marcas' },
    { titulo: 'Domicilios rapidos', desc: 'Llevamos tu pedido a tu barrio en Neiva' },
  ]
  return (
    <section id="quienes-somos" className="bg-gray-50 py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-red-700">Quienes Somos</h2>
          <p className="text-gray-500 mt-2 text-xs md:text-base">Conoce nuestra historia y valores</p>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-extrabold text-gray-800">Mision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Ofrecer a las familias de Neiva productos de calidad a los mejores precios, con un servicio cercano, honesto y rapido que facilite el mercado del hogar.</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-4">Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Ser el supermercado de referencia en el sur de Colombia, reconocido por la confianza de nuestros clientes, la calidad de nuestros productos y nuestro compromiso con la comunidad.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {valores.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <h4 className="font-extrabold text-gray-800 text-sm mb-1">{v.titulo}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}