import { useState } from "react"
import { supabase } from "../../services/supabase"
import { useNavigate } from "react-router-dom"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: Props) {
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return setError("Completa todos los campos")
    setLoading(true)
    setError("")
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError("Correo o contrasena incorrectos"); setLoading(false); return }
    const esAdmin = data.user?.email === "ayasteven599@gmail.com"
    if (esAdmin) navigate("/admin/dashboard")
    onClose()
    setLoading(false)
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password) return setError("Completa todos los campos")
    if (password.length < 6) return setError("La contrasena debe tener al menos 6 caracteres")
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
    if (error) { setError("Error al registrarse. Intenta de nuevo"); setLoading(false); return }
    setMensaje("Cuenta creada. Revisa tu correo para confirmar.")
    setLoading(false)
  }

  const handleReset = async () => {
    if (!email) return setError("Ingresa tu correo")
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) { setError("Error al enviar el correo"); setLoading(false); return }
    setMensaje("Te enviamos un correo para restablecer tu contrasena")
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-red-700 px-8 py-6 text-center">
          <img src="/logo.png" alt="La Economia Aya" className="h-16 w-auto mx-auto mb-2" />
          <p className="text-red-200 text-sm">{resetMode ? "Recuperar contrasena" : tab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}</p>
        </div>
        <div className="p-8 flex flex-col gap-4">
          {!resetMode && (
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button onClick={() => { setTab("login"); setError(""); setMensaje("") }} className={tab === "login" ? "flex-1 py-2.5 font-bold text-sm bg-red-700 text-white" : "flex-1 py-2.5 font-bold text-sm text-gray-500 hover:bg-gray-50"}>
                Iniciar sesion
              </button>
              <button onClick={() => { setTab("registro"); setError(""); setMensaje("") }} className={tab === "registro" ? "flex-1 py-2.5 font-bold text-sm bg-red-700 text-white" : "flex-1 py-2.5 font-bold text-sm text-gray-500 hover:bg-gray-50"}>
                Registrarme
              </button>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          {mensaje && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-600 text-sm text-center">
              {mensaje}
            </div>
          )}
          {!resetMode && tab === "registro" && (
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm">👤</span>
              <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            </div>
          )}
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 text-sm">✉</span>
            <input type="email" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-700" />
          </div>
          {!resetMode && (
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm">🔒</span>
              <input type={showPass ? "text" : "password"} placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-red-700" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3 text-gray-400 text-sm hover:text-gray-600">
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>
          )}
          {!resetMode && tab === "login" && (
            <button onClick={() => { setResetMode(true); setError(""); setMensaje("") }} className="text-red-700 text-xs text-right hover:underline">
              Olvidaste tu contrasena?
            </button>
          )}
          {resetMode ? (
            <button onClick={handleReset} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
              {loading ? "Enviando..." : "Enviar correo de recuperacion"}
            </button>
          ) : (
            <button onClick={tab === "login" ? handleLogin : handleRegistro} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
              {loading ? "Cargando..." : tab === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button className="w-full border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-3">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
            Continuar con Google
          </button>
          {resetMode ? (
            <button onClick={() => { setResetMode(false); setError(""); setMensaje("") }} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">
              Volver al inicio de sesion
            </button>
          ) : (
            <button onClick={onClose} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}