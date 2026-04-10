import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [, setUser] = useState(null)
  const [stats, setStats] = useState({ productos: 0, cuartillas: 0, pedidos: 0, pendientes: 0 })
  const [nuevoPedido, setNuevoPedido] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin")
      else setUser(data.session.user)
    })
    cargarStats()

    const canal = supabase.channel("pedidos-nuevos")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pedidos" }, (payload) => {
        setNuevoPedido(true)
        cargarStats()
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Nuevo pedido recibido", {
            body: "Cliente: " + payload.new.nombre_cliente,
            icon: "/logo.png"
          })
        }
      })
      .subscribe()

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    return () => { supabase.removeChannel(canal) }
  }, [])

  const cargarStats = async () => {
    const [{ count: productos }, { count: cuartillas }, { count: pedidos }, { count: pendientes }] = await Promise.all([
      supabase.from("productos").select("*", { count: "exact", head: true }).eq("disponible", true),
      supabase.from("cuartillas").select("*", { count: "exact", head: true }).eq("activa", true),
      supabase.from("pedidos").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
    ])
    setStats({ productos: productos || 0, cuartillas: cuartillas || 0, pedidos: pedidos || 0, pendientes: pendientes || 0 })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/admin")
  }

  const cards = [
    { titulo: "Cuartillas", desc: "Subir y gestionar promociones", ruta: "/admin/cuartillas", color: "border-red-700", bg: "bg-red-50", icon: "🖼", stat: stats.cuartillas, statLabel: "activas" },
    { titulo: "Productos", desc: "Agregar y editar catalogo", ruta: "/admin/productos", color: "border-yellow-400", bg: "bg-yellow-50", icon: "📦", stat: stats.productos, statLabel: "disponibles" },
    { titulo: "Pedidos", desc: "Ver y gestionar pedidos", ruta: "/admin/pedidos", color: "border-green-500", bg: "bg-green-50", icon: "📋", stat: stats.pedidos, statLabel: "total" },
    { titulo: "Categorias", desc: "Organizar el catalogo", ruta: "/admin/categorias", color: "border-gray-800", bg: "bg-gray-50", icon: "📊", stat: null, statLabel: "" },
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
          <button onClick={() => navigate("/")} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-full transition text-sm">
            Ver tienda
          </button>
          <button onClick={handleLogout} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition text-sm">
            Cerrar sesion
          </button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {nuevoPedido && (
          <div className="bg-green-500 text-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-lg animate-bounce">
            <span className="text-2xl">🔔</span>
            <p className="font-bold text-sm flex-1">Nuevo pedido recibido!</p>
            <button onClick={() => { setNuevoPedido(false); navigate("/admin/pedidos") }} className="bg-white text-green-600 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-green-50 transition">
              Ver pedido
            </button>
            <button onClick={() => setNuevoPedido(false)} className="text-white/70 hover:text-white text-xl font-bold">x</button>
          </div>
        )}
        {stats.pendientes > 0 && (
          <div onClick={() => navigate("/admin/pedidos")} className="bg-yellow-400 text-black rounded-2xl p-4 mb-8 flex items-center gap-3 cursor-pointer hover:bg-yellow-300 transition shadow-sm">
            <span className="text-2xl">⚠️</span>
            <p className="font-bold text-sm flex-1">Tienes {stats.pendientes} pedido{stats.pendientes > 1 ? "s" : ""} pendiente{stats.pendientes > 1 ? "s" : ""} por atender</p>
            <span className="font-bold">Ver</span>
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800">Bienvenido</h2>
          <p className="text-gray-500 text-sm mt-1">Resumen de tu tienda</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-red-700">{stats.productos}</p>
            <p className="text-gray-500 text-xs mt-1">Productos activos</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-yellow-500">{stats.cuartillas}</p>
            <p className="text-gray-500 text-xs mt-1">Cuartillas activas</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-green-600">{stats.pedidos}</p>
            <p className="text-gray-500 text-xs mt-1">Pedidos totales</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-orange-500">{stats.pendientes}</p>
            <p className="text-gray-500 text-xs mt-1">Pedidos pendientes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <div key={c.titulo} onClick={() => navigate(c.ruta)} className={"bg-white rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer border-l-4 " + c.color + " p-6 flex items-center gap-5"}>
              <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 " + c.bg}>
                {c.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-gray-800">{c.titulo}</h3>
                <p className="text-gray-500 text-sm">{c.desc}</p>
              </div>
              {c.stat !== null && (
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-xl text-gray-800">{c.stat}</p>
                  <p className="text-gray-400 text-xs">{c.statLabel}</p>
                </div>
              )}
              <span className="text-gray-300 text-2xl font-bold flex-shrink-0">&#8250;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}