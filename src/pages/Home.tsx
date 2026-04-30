import Hero from '../components/sections/Hero'
import Cuartillas from '../components/sections/Cuartillas'
import Catalogo from '../components/sections/Catalogo'

export default function Home() {
  return (
    <main>
      <Hero />
      <Cuartillas />
      <Catalogo />
      <section id="quienes-somos" className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-3xl font-bold text-red-700">Quienes Somos</h2>
      </section>
      <section id="contacto" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-red-700">Contactenos</h2>
      </section>
    </main>
  )
}