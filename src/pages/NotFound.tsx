import { useNavigate } from 'react-router-dom'
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center gap-5 px-4" style={{ background: 'radial-gradient(ellipse at top, #7f1d1d 0%, #000 60%)' }}>
      <img src="/logo.png" alt="La Economia Aya" className="h-20 w-auto drop-shadow-2xl" />
      <h1 className="text-yellow-400 font-extrabold text-7xl">404</h1>
      <p className="text-white text-lg font-bold">Pagina no encontrada</p>
      <p className="text-gray-400 text-sm max-w-xs">La pagina que buscas no existe o fue movida.</p>
      <button onClick={() => navigate('/')} className="bg-yellow-400 text-black font-extrabold px-8 py-3 rounded-full hover:bg-yellow-300 transition shadow-lg">Volver al inicio</button>
    </div>
  )
}