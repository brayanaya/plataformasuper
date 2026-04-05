export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Quienes Somos</h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex justify-center">
            <img src="/logo.png" alt="La Economia Aya" className="w-48 md:w-64 h-auto drop-shadow-lg" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">Supermercado La Economia Aya</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Somos un supermercado familiar ubicado en Neiva, Huila, con anos de experiencia sirviendo a nuestra comunidad con los mejores precios en productos de la canasta familiar.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Nos caracterizamos por la calidad de nuestros productos, la calidez en la atencion y el compromiso con el bienestar de nuestros clientes y sus familias.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-red-700">
            <h3 className="text-xl font-extrabold text-red-700 mb-4">Mision</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Ofrecer a nuestros clientes productos de calidad al mejor precio, con una atencion personalizada y cercana, contribuyendo al bienestar de las familias neivaanas.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-yellow-400">
            <h3 className="text-xl font-extrabold text-yellow-500 mb-4">Vision</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Ser el supermercado de referencia en Neiva, reconocido por nuestra variedad, precios competitivos y excelente servicio al cliente, expandiendo nuestra presencia en la region.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}