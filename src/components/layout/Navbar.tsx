import { useState, useEffect } from "react"
import { useCartStore } from "../../store/cartStore"
import CartDrawer from "./CartDrawer"
import AuthModal from "./AuthModal"
import { supabase } from "../../services/supabase"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUsuario(data.session.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUsuario(null)
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 30
      window.scrollTo({ top, behavior: "smooth" })
    }
    setMenuOpen(false)
  }

  const irInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setMenuOpen(false)
  }

  const nombreUsuario = usuario?.user_metadata?.nombre || usuario?.email?.split("@")[0] || "Usuario"
  const esAdmin = usuario?.email === "ayasteven599@gmail.com"

  return (
    <>
      <nav className="bg-red-700 text-white px-8 py-4 shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={irInicio} className="cursor-pointer">
            <img src="/logo.png" alt="La Economia Aya" className="h-20 w-auto" />
          </button>
          <ul className="hidden md:flex gap-3 text-sm font-semibold items-center">
            <li><button onClick={() => scrollTo("cuartillas")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition">Cuartillas</button></li>
            <li><button onClick={() => scrollTo("catalogo")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition">Catalogo</button></li>
            <li><button onClick={() => scrollTo("quienes-somos")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition">Quienes Somos</button></li>
            <li><button onClick={() => scrollTo("contacto")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition">Contactenos</button></li>
            {usuario ? (
              <>
                {esAdmin && (
                  <li><button onClick={() => navigate("/admin/dashboard")} className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-300 transition">Panel Admin</button></li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-sm">Hola, {nombreUsuario}</span>
                  <button onClick={handleLogout} className="bg-white/20 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition">Salir</button>
                </li>
              </>
            ) : (
              <>
                <li><button onClick={() => setAuthOpen(true)} className="bg-black text-white px-5 py-2 rounded-full font-bold hover:bg-gray-800 transition">Iniciar sesion</button></li>
                <li><button onClick={() => setAuthOpen(true)} className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition">Registrarme</button></li>
              </>
            )}
            <li>
              <button onClick={() => setCartOpen(true)} className="relative bg-yellow-400 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-300 transition">
                Carrito
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
                )}
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setCartOpen(true)} className="relative bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition text-sm">
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl font-bold">
              {menuOpen ? "x" : "="}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 pb-4">
            <button onClick={() => scrollTo("cuartillas")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition text-sm">Cuartillas</button>
            <button onClick={() => scrollTo("catalogo")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition text-sm">Catalogo</button>
            <button onClick={() => scrollTo("quienes-somos")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition text-sm">Quienes Somos</button>
            <button onClick={() => scrollTo("contacto")} className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-red-700 transition text-sm">Contactenos</button>
            {usuario ? (
              <>
                {esAdmin && <button onClick={() => navigate("/admin/dashboard")} className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold transition text-sm">Panel Admin</button>}
                <button onClick={handleLogout} className="bg-white/20 text-white px-5 py-2 rounded-full text-sm">Cerrar sesion ({nombreUsuario})</button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthOpen(true); setMenuOpen(false) }} className="bg-black text-white px-5 py-2 rounded-full font-bold transition text-sm">Iniciar sesion</button>
                <button onClick={() => { setAuthOpen(true); setMenuOpen(false) }} className="bg-white text-black px-5 py-2 rounded-full font-bold transition text-sm">Registrarme</button>
              </>
            )}
          </div>
        )}
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}