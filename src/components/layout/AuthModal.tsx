import { useState } from 'react'
import { supabase } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: Props) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Correo o contrasena incorrectos'); setLoading(false); return }
    const esAdmin = data.user?.email === 'ayasteven599@gmail.com'
    if (esAdmin) navigate('/admin/dashboard')
    onClose()
    setLoading(false)
  }

  const handleRegistro = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
    if (error) { setError('Error al registrarse'); setLoading(false); return }
    setMensaje('Registro exitoso, revisa tu correo para confirmar')
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-5">
        <div className="text-center">
          <img src="/logo.png" alt="La Economia Aya" className="h-20 mx-auto mb-3" />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          <button onClick={() => setTab('login')} className={tab === 'login' ? 'flex-1 py-2 font-bold text-sm bg-red-700 text-white' : 'flex-1 py-2 font-bold text-sm text-gray-500 hover:bg-gray-50'}>
            Iniciar sesion
          </button>
          <button onClick={() => setTab('registro')} className={tab === 'registro' ? 'flex-1 py-2 font-bold text-sm bg-red-700 text-white' : 'flex-1 py-2 font-bold text-sm text-gray-500 hover:bg-gray-50'}>
            Registrarme
          </button>
        </div>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm text-center">{mensaje}</p>}
        {tab === 'registro' && (
          <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
        )}
        <input type="email" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
        <input type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
        <button onClick={tab === 'login' ? handleLogin : handleRegistro} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
          {loading ? 'Cargando...' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </button>
        <button onClick={onClose} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">Cancelar</button>
      </div>
    </div>
  )
}
