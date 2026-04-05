import { } from "react"

export default function Hero() {
  return (
    <section id="hero" className="bg-black text-white min-h-[calc(100vh-88px)] px-6 flex flex-col items-center justify-center text-center gap-6">
      <img src="/logo.png" alt="La Economia Aya" className="h-28 md:h-40 w-auto drop-shadow-lg" />
      <h1 className="text-2xl md:text-4xl font-extrabold text-yellow-400 max-w-2xl">
        Tu mercado de confianza en Neiva
      </h1>
      <p className="text-sm md:text-lg text-gray-300 max-w-xl">
        Encuentra los mejores precios en productos de la canasta familiar, con domicilios a tu barrio y promociones semanales.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-sm sm:max-w-none justify-center">
        <button
          onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition"
        >
          Ver Catalogo
        </button>
        <button
          onClick={() => document.getElementById("cuartillas")?.scrollIntoView({ behavior: "smooth" })}
          className="border-2 border-yellow-400 text-yellow-400 font-bold px-8 py-3 rounded-full hover:bg-yellow-400 hover:text-black transition"
        >
          Ver Promociones
        </button>
      </div>
    </section>
  )
}