import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin")
      else setUser(data.session.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/admin")
  }

  const cards = [
    { titulo: "Cuartillas", desc: "Subir y gestionar promociones", ruta: "/admin/cuartillas", color: "border-red-700", bg: "bg-red-50", icon: "🖼" },
    { titulo: "Productos", desc: "Agregar y editar catalogo", ruta: "/admin/productos", color: "border-yellow-400", bg: "bg-yellow-50", icon: "📦" },
    { titulo: "Pedidos", desc: "Ver y gestionar pedidos", ruta: "/admin/pedidos", color: "border-green-500", bg: "bg-green-50", icon: "📋" },
    { titulo: "Categorias", desc: "Organizar el catalogo", ruta: "/admin/categorias", color: "border-gray-800", bg: "bg-gray-50", icon: "📊" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-700 text-white px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="La Economia Aya" className="h-14 w-auto" />
          <div>
            <p className="font-extrabold text-lg leading-tight">Panel Admin</p>
            <p className="text-red-200 text-xs">Supermercado La Economia Aya</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-full transition text-sm">
            Ver tienda
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition text-sm">
            Cerrar sesion
          </button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-800">Bienvenido</h2>
          <p className="text-gray-500 text-sm mt-1">Selecciona una seccion para gestionar</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((c) => (
            <div key={c.titulo} onClick={() => navigate(c.ruta)} className={"bg-white rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer border-l-4 " + c.color + " p-6 flex items-center gap-5"}>
              <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-3xl " + c.bg}>
                {c.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-gray-800 text-lg">{c.titulo}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{c.desc}</p>
              </div>
              <div className="ml-auto text-gray-300 text-2xl font-bold">&#8250;</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}