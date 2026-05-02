import { useState } from 'react'
import { supabase } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'

interface Props { open: boolean; onClose: () => void }

export default function AuthModal({ open, onClose }: Props) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const navigate = useNavigate()

  const reset = () => { setError(''); setMensaje('') }

  const handleLogin = async () => {
    if (!email || !password) return setError('Completa todos los campos')
    setLoading(true); reset()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Correo o contrasena incorrectos'); setLoading(false); return }
    if (data.user?.email === 'ayasteven599@gmail.com') navigate('/admin/dashboard')
    onClose(); setLoading(false)
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password) return setError('Completa todos los campos')
    if (password.length < 6) return setError('La contrasena debe tener al menos 6 caracteres')
    setLoading(true); reset()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
    if (error) { setError('Error al registrarse. Intenta de nuevo'); setLoading(false); return }
    setMensaje('Cuenta creada! Revisa tu correo para confirmar.')
    setLoading(false)
  }

  const handleReset = async () => {
    if (!email) return setError('Ingresa tu correo')
    setLoading(true); reset()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) { setError('Error al enviar el correo'); setLoading(false); return }
    setMensaje('Te enviamos un correo para restablecer tu contrasena')
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') tab === 'login' ? handleLogin() : handleRegistro() }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-sm overflow-hidden">
        <div className="bg-red-700 px-6 py-5 text-center relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/60 hover:text-white text-xl">x</button>
          <img src="/logo.png" alt="La Economia Aya" className="h-12 w-auto mx-auto mb-2 drop-shadow" />
          <p className="text-red-200 text-xs">{resetMode ? 'Recuperar contrasena' : tab === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</p>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {!resetMode && (
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button onClick={() => { setTab('login'); reset() }} className={tab === 'login' ? 'flex-1 py-2 font-bold text-xs bg-red-700 text-white' : 'flex-1 py-2 font-bold text-xs text-gray-500 hover:bg-gray-50'}>Iniciar sesion</button>
              <button onClick={() => { setTab('registro'); reset() }} className={tab === 'registro' ? 'flex-1 py-2 font-bold text-xs bg-red-700 text-white' : 'flex-1 py-2 font-bold text-xs text-gray-500 hover:bg-gray-50'}>Registrarme</button>
            </div>
          )}
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-600 text-xs text-center">{error}</div>}
          {mensaje && <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-green-600 text-xs text-center">{mensaje}</div>}
          {!resetMode && tab === 'registro' && (
            <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} onKeyDown={handleKey} autoComplete="name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
          )}
          <input type="email" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKey} autoComplete="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
          {!resetMode && (
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKey} autoComplete="current-password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-16 text-sm focus:outline-none focus:border-red-700" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-2.5 text-gray-400 text-xs hover:text-gray-600">{showPass ? 'Ocultar' : 'Ver'}</button>
            </div>
          )}
          {!resetMode && tab === 'login' && (
            <button onClick={() => { setResetMode(true); reset() }} className="text-red-700 text-xs text-right hover:underline">Olvidaste tu contrasena?</button>
          )}
          {resetMode ? (
            <button onClick={handleReset} disabled={loading} className="bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm">
              {loading ? 'Enviando...' : 'Enviar correo de recuperacion'}
            </button>
          ) : (
            <button onClick={tab === 'login' ? handleLogin : handleRegistro} disabled={loading} className="bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm">
              {loading ? 'Cargando...' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          )}
          {resetMode ? (
            <button onClick={() => { setResetMode(false); reset() }} className="text-gray-400 text-xs text-center hover:text-gray-600">Volver al inicio de sesion</button>
          ) : (
            <button onClick={onClose} className="text-gray-400 text-xs text-center hover:text-gray-600">Cancelar</button>
          )}
        </div>
      </div>
    </div>
  )
}