import { useEffect, useState } from 'react'
export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1200)
    const t2 = setTimeout(() => setVisible(false), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  if (!visible) return null
  return (
    <div className={'fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ' + (fadeOut ? 'opacity-0' : 'opacity-100')}>
      <img src="/logo.png" alt="La Economia Aya" className="h-28 w-auto drop-shadow-2xl animate-pulse" />
      <div className="flex gap-1.5">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-gray-500 text-xs tracking-widest uppercase">Cargando...</p>
    </div>
  )
}