import { useState, useEffect } from 'react'
import { useCartStore } from '../../store/cartStore'
import CartDrawer from './CartDrawer'
import AuthModal from './AuthModal'
import { supabase } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  const irInicio = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }
  const nombreUsuario = usuario?.user_metadata?.nombre || usuario?.email?.split('@')[0] || 'Usuario'
  const esAdmin = usuario?.email === 'ayasteven599@gmail.com'

  return (
    <>
      <nav className="bg-red-700 text-white px-4 md:px-8 py-3 shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button onClick={irInicio}>
            <img src="/logo.png" alt="La Economia Aya" className="h-16 md:h-20 w-auto" />
          </button>
          <ul className="hidden md:flex gap-2 text-sm font-semibold items-center">
            <li><button onClick={() => scrollTo('cuartillas')} className="border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-red-700 transition text-xs">Cuartillas</button></li>
            <li><button onClick={() => scrollTo('catalogo')} className="border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-red-700 transition text-xs">Catalogo</button></li>
            <li><button onClick={() => scrollTo('quienes-somos')} className="border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-red-700 transition text-xs">Quienes Somos</button></li>
            <li><button onClick={() => scrollTo('contacto')} className="border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-red-700 transition text-xs">Contactenos</button></li>
            {usuario ? (
              <>
                {esAdmin && <li><button onClick={() => navigate('/admin/dashboard')} className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold hover:bg-yellow-300 transition text-xs">Panel Admin</button></li>}
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-xs">Hola, {nombreUsuario}</span>
                  <button onClick={handleLogout} className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs hover:bg-white/30 transition">Salir</button>
                </li>
              </>
            ) : (
              <>
                <li><button onClick={() => setAuthOpen(true)} className="bg-black text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800 transition text-xs">Iniciar sesion</button></li>
                <li><button onClick={() => setAuthOpen(true)} className="bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-100 transition text-xs">Registrarme</button></li>
              </>
            )}
            <li>
              <button onClick={() => setCartOpen(true)} className="relative bg-yellow-400 text-black w-9 h-9 rounded-full font-bold hover:bg-yellow-300 transition flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{fontSize:'10px'}}>{totalItems}</span>}
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setCartOpen(true)} className="relative bg-yellow-400 text-black w-9 h-9 rounded-full font-bold hover:bg-yellow-300 transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{fontSize:'10px'}}>{totalItems}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white w-9 h-9 flex flex-col items-center justify-center gap-1.5">
              <span className={'block h-0.5 w-5 bg-white transition-all duration-300 ' + (menuOpen ? 'rotate-45 translate-y-2' : '')} />
              <span className={'block h-0.5 w-5 bg-white transition-all duration-300 ' + (menuOpen ? 'opacity-0' : '')} />
              <span className={'block h-0.5 w-5 bg-white transition-all duration-300 ' + (menuOpen ? '-rotate-45 -translate-y-2' : '')} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 pb-3 border-t border-red-600 pt-3">
            <button onClick={() => scrollTo('cuartillas')} className="text-left text-sm px-3 py-2 rounded-xl hover:bg-red-600 transition">Cuartillas</button>
            <button onClick={() => scrollTo('catalogo')} className="text-left text-sm px-3 py-2 rounded-xl hover:bg-red-600 transition">Catalogo</button>
            <button onClick={() => scrollTo('quienes-somos')} className="text-left text-sm px-3 py-2 rounded-xl hover:bg-red-600 transition">Quienes Somos</button>
            <button onClick={() => scrollTo('contacto')} className="text-left text-sm px-3 py-2 rounded-xl hover:bg-red-600 transition">Contactenos</button>
            {usuario ? (
              <>
                {esAdmin && <button onClick={() => navigate('/admin/dashboard')} className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-sm">Panel Admin</button>}
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm">Cerrar sesion ({nombreUsuario})</button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthOpen(true); setMenuOpen(false) }} className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm">Iniciar sesion</button>
                <button onClick={() => { setAuthOpen(true); setMenuOpen(false) }} className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm">Registrarme</button>
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