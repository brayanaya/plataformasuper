import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin')
      else setUser(data.session.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="La Economia Aya" className="h-12 w-auto" />
          <span className="font-bold text-lg">Panel Admin</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="bg-white text-red-700 font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">
            Ver tienda
          </button>
          <button onClick={handleLogout} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition">
            Cerrar sesion
          </button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-8">Bienvenido al panel de administracion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() => navigate('/admin/cuartillas')} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer border-t-4 border-red-700">
            <span className="text-3xl">🖼</span>
            <h3 className="font-bold text-gray-800">Cuartillas</h3>
            <p className="text-gray-500 text-sm">Gestionar promociones</p>
          </div>
          <div onClick={() => navigate('/admin/productos')} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer border-t-4 border-yellow-400">
            <span className="text-3xl">📦</span>
            <h3 className="font-bold text-gray-800">Productos</h3>
            <p className="text-gray-500 text-sm">Gestionar catalogo</p>
          </div>
          <div onClick={() => navigate('/admin/pedidos')} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer border-t-4 border-green-500">
            <span className="text-3xl">📋</span>
            <h3 className="font-bold text-gray-800">Pedidos</h3>
            <p className="text-gray-500 text-sm">Ver pedidos recibidos</p>
          </div>
          <div onClick={() => navigate('/admin/categorias')} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer border-t-4 border-black">
            <span className="text-3xl">📊</span>
            <h3 className="font-bold text-gray-800">Categorias</h3>
            <p className="text-gray-500 text-sm">Gestionar categorias</p>
          </div>
        </div>
      </div>
    </div>
  )
}
