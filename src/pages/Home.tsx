import Hero from "../components/sections/Hero"
import Beneficios from "../components/sections/Beneficios"
import Cuartillas from "../components/sections/Cuartillas"
import Catalogo from "../components/sections/Catalogo"
import QuienesSomos from "../components/sections/QuienesSomos"
import Contacto from "../components/sections/Contacto"
import Footer from "../components/layout/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Beneficios />
      <Cuartillas />
      <Catalogo />
      <QuienesSomos />
      <Contacto />
      <Footer />
    </main>
  )
}