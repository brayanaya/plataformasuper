import { useState, useEffect } from "react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-6 z-50 bg-red-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110"
    >
      ↑
    </button>
  )
}