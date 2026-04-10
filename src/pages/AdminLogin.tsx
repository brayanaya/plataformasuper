import { useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return setError("Completa todos los campos")
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError("Correo o contrasena incorrectos"); setLoading(false); return }
    navigate("/admin/dashboard")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="La Economia Aya" className="h-28 w-auto mx-auto mb-4 drop-shadow-2xl" />
          <h1 className="text-white font-extrabold text-2xl">Panel Administrativo</h1>
          <p className="text-gray-400 text-sm mt-1">Supermercado La Economia Aya</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-red-700 px-8 py-4 text-center">
            <p className="text-white font-bold text-sm">Acceso exclusivo para administradores</p>
          </div>
          <div className="p-8 flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm">✉</span>
              <input
                type="email"
                placeholder="Correo electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-700"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-16 py-3 text-sm focus:outline-none focus:border-red-700"
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3 text-gray-400 text-xs hover:text-gray-600">
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar al panel"}
            </button>
            <button onClick={() => navigate("/")} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}