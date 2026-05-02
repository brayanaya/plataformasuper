import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return setError('Completa todos los campos')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Correo o contrasena incorrectos'); setLoading(false); return }
    navigate('/admin/dashboard')
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, #7f1d1d 0%, #000 60%)' }} />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="La Economia Aya" className="h-24 w-auto mx-auto mb-4 drop-shadow-2xl" />
          <h1 className="text-white font-extrabold text-xl">Panel Administrativo</h1>
          <p className="text-gray-400 text-xs mt-1">Supermercado La Economia Aya</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-700 px-6 py-3 text-center">
            <p className="text-white font-semibold text-xs">Acceso exclusivo para administradores</p>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-xs text-center">{error}</div>}
            <input type="email" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKey} autoComplete="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-700" />
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKey} autoComplete="current-password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-16 text-sm focus:outline-none focus:border-red-700" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-2.5 text-gray-400 text-xs hover:text-gray-600">{showPass ? 'Ocultar' : 'Ver'}</button>
            </div>
            <button onClick={handleLogin} disabled={loading} className="bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm">
              {loading ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
            <button onClick={() => navigate('/')} className="text-gray-400 text-xs text-center hover:text-gray-600 transition">Volver a la tienda</button>
          </div>
        </div>
      </div>
    </div>
  )
}