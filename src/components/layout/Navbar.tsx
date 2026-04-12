import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="bg-red-700 text-white px-6 py-3 flex items-center justify-between shadow-lg sticky top-0 z-20">
        <button onClick={() => scrollTo('hero')}>
          <img src="/logo.png" alt="La Economia Aya" className="h-16 w-auto" />
        </button>
        <ul className="flex gap-6 text-sm font-semibold items-center">
          <li className="hidden md:block"><button onClick={() => scrollTo('cuartillas')} className="hover:text-yellow-400 transition">Cuartillas</button></li>
          <li className="hidden md:block"><button onClick={() => scrollTo('catalogo')} className="hover:text-yellow-400 transition">Catalogo</button></li>
          <li className="hidden md:block"><button onClick={() => scrollTo('quienes-somos')} className="hover:text-yellow-400 transition">Quienes Somos</button></li>
          <li className="hidden md:block"><button onClick={() => scrollTo('contacto')} className="hover:text-yellow-400 transition">Contactenos</button></li>
          <li>
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition"
            >
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </li>
        </ul>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}