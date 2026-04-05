import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contrasena incorrectos')
    } else {
      navigate('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <img src="/logo.png" alt="La Economia Aya" className="h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-red-700">Panel Administrativo</h2>
          <p className="text-gray-500 text-sm mt-1">Ingresa con tu cuenta</p>
        </div>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Correo electronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700"
        />
        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  )
}
