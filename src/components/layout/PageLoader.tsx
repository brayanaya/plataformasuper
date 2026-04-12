import { useEffect, useState } from "react"

export default function PageLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => setVisible(false), 1500)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center gap-4 transition-opacity duration-500">
      <img src="/logo.png" alt="La Economia Aya" className="h-32 w-auto drop-shadow-2xl animate-pulse" />
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
      </div>
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  )
}