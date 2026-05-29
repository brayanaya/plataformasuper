import { useEffect, useState } from 'react'
import SeguirPedidoModal from '../layout/SeguirPedidoModal'

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  return (
    <>
      <section id="hero" className="relative bg-black text-white min-h-[calc(100vh-88px)] px-6 flex flex-col items-center justify-center text-center gap-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, #7f1d1d 0%, #000 60%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #dc262620 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fbbf2415 0%, transparent 50%)' }} />
        <div className={'relative z-10 flex flex-col items-center gap-6 transition-all duration-1000 ' + (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-yellow-400/20 rounded-full scale-150" />
            <img src="/logo.png" alt="La Economia Aya" className="relative h-28 md:h-40 w-auto drop-shadow-2xl" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-yellow-400 text-xs md:text-sm font-semibold tracking-widest uppercase">Supermercado familiar en Neiva</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Tu mercado de<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">confianza</span></h1>
          </div>
          <p className="text-sm md:text-lg text-gray-300 max-w-lg leading-relaxed">Los mejores precios en productos de la canasta familiar, con domicilios rapidos a tu barrio y promociones semanales.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-center w-full max-w-sm sm:max-w-none">
            <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} className="bg-yellow-400 text-black font-extrabold px-8 py-3 rounded-full hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">Ver Catalogo</button>
            <button onClick={() => document.getElementById('cuartillas')?.scrollIntoView({ behavior: 'smooth' })} className="border-2 border-yellow-400/60 text-yellow-400 font-extrabold px-8 py-3 rounded-full hover:bg-yellow-400 hover:text-black transition">Ver Promociones</button>
            <button onClick={() => setModalOpen(true)} className="border-2 border-white/20 text-white/70 font-bold px-6 py-3 rounded-full hover:border-white/40 hover:text-white transition text-sm">Seguir pedido</button>
          </div>
          <div className="flex gap-8 mt-2">
            <div className="text-center"><p className="text-2xl font-extrabold text-yellow-400">2</p><p className="text-gray-500 text-xs">Sedes</p></div>
            <div className="w-px bg-gray-800" />
            <div className="text-center"><p className="text-2xl font-extrabold text-yellow-400">6am</p><p className="text-gray-500 text-xs">Abrimos</p></div>
            <div className="w-px bg-gray-800" />
            <div className="text-center"><p className="text-2xl font-extrabold text-yellow-400">7</p><p className="text-gray-500 text-xs">Dias/semana</p></div>
          </div>
        </div>
      </section>
      <SeguirPedidoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}