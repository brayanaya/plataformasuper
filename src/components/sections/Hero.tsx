export default function Hero() {
  return (
    <section id="hero" className="bg-black text-white min-h-[calc(100vh-88px)] px-6 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-red-950 opacity-80" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <img src="/logo.png" alt="La Economia Aya" className="h-28 md:h-40 w-auto drop-shadow-2xl animate-pulse" style={{animationDuration: "3s"}} />
        <div className="flex flex-col gap-2">
          <p className="text-yellow-400 text-xs md:text-sm font-semibold tracking-widest uppercase">Supermercado familiar en Neiva</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Tu mercado de<br/><span className="text-yellow-400">confianza</span>
          </h1>
        </div>
        <p className="text-sm md:text-lg text-gray-300 max-w-lg leading-relaxed">
          Los mejores precios en productos de la canasta familiar, con domicilios a tu barrio y promociones semanales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-sm sm:max-w-none justify-center">
          <button
            onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-yellow-400 text-black font-extrabold px-8 py-3 rounded-full hover:bg-yellow-300 transition shadow-lg hover:shadow-yellow-400/30"
          >
            Ver Catalogo
          </button>
          <button
            onClick={() => document.getElementById("cuartillas")?.scrollIntoView({ behavior: "smooth" })}
            className="border-2 border-yellow-400 text-yellow-400 font-extrabold px-8 py-3 rounded-full hover:bg-yellow-400 hover:text-black transition"
          >
            Ver Promociones
          </button>
        </div>
        <div className="flex gap-8 mt-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-yellow-400">2</p>
            <p className="text-gray-400 text-xs">Sedes</p>
          </div>
          <div className="w-px bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-yellow-400">6am</p>
            <p className="text-gray-400 text-xs">Abrimos</p>
          </div>
          <div className="w-px bg-gray-700" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-yellow-400">7 dias</p>
            <p className="text-gray-400 text-xs">A la semana</p>
          </div>
        </div>
      </div>
    </section>
  )
}