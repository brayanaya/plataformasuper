export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="bg-white py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Quienes Somos</h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="La Economia Aya" className="h-52 w-auto drop-shadow-xl" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-extrabold text-gray-800">Supermercado La Economia Aya</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Somos un supermercado familiar ubicado en Neiva, Huila, con anos de experiencia sirviendo a nuestra comunidad con los mejores precios en productos de la canasta familiar.</p>
            <p className="text-gray-600 text-sm leading-relaxed">Nos caracterizamos por la calidad de nuestros productos, la calidez en la atencion y el compromiso con el bienestar de nuestros clientes y sus familias.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-red-700 bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-red-700 font-extrabold text-lg mb-3">Mision</h4>
            <p className="text-gray-600 text-sm leading-relaxed">Ofrecer a nuestros clientes productos de calidad al mejor precio, con una atencion personalizada y cercana, contribuyendo al bienestar de las familias neivaanas.</p>
          </div>
          <div className="border-l-4 border-yellow-400 bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-yellow-500 font-extrabold text-lg mb-3">Vision</h4>
            <p className="text-gray-600 text-sm leading-relaxed">Ser el supermercado de referencia en Neiva, reconocido por nuestra variedad, precios competitivos y excelente servicio al cliente, expandiendo nuestra presencia en la region.</p>
          </div>
        </div>
      </div>
    </section>
  )
}