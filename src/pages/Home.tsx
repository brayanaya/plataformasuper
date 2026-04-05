import Hero from "../components/sections/Hero"
import Cuartillas from "../components/sections/Cuartillas"
import Catalogo from "../components/sections/Catalogo"
import QuienesSomos from "../components/sections/QuienesSomos"
import Contacto from "../components/sections/Contacto"
import Footer from "../components/layout/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Cuartillas />
      <Catalogo />
      <QuienesSomos />
      <Contacto />
      <Footer />
    </main>
  )
}
