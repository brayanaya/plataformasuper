import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center gap-6 px-4">
      <img src="/logo.png" alt="La Economia Aya" className="h-24 w-auto drop-shadow-2xl" />
      <h1 className="text-yellow-400 font-extrabold text-6xl">404</h1>
      <p className="text-white text-xl font-bold">Pagina no encontrada</p>
      <p className="text-gray-400 text-sm max-w-sm">La pagina que buscas no existe o fue movida.</p>
      <button onClick={() => navigate("/")} className="bg-yellow-400 text-black font-extrabold px-8 py-3 rounded-full hover:bg-yellow-300 transition">Volver al inicio</button>
    </div>
  )
}