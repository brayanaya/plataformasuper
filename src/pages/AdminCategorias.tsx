import { useState, useEffect } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [conteos, setConteos] = useState({})
  const navigate = useNavigate()

  useEffect(() => { cargarCategorias() }, [])

  const cargarCategorias = async () => {
    const { data } = await supabase.from("categorias").select("*").order("nombre")
    if (data) {
      setCategorias(data)
      const conteoObj = {}
      await Promise.all(data.map(async (c) => {
        const { count } = await supabase.from("productos").select("*", { count: "exact", head: true }).eq("categoria_id", c.id)
        conteoObj[c.id] = count || 0
      }))
      setConteos(conteoObj)
    }
  }

  const handleAgregar = async () => {
    if (!nombre) return setMensaje("Escribe un nombre")
    await supabase.from("categorias").insert({ nombre })
    setNombre("")
    setMensaje("Categoria agregada exitosamente")
    cargarCategorias()
  }

  const handleEliminar = async (id, nombre) => {
    if (conteos[id] > 0) return setMensaje("No puedes eliminar una categoria con productos asignados")
    if (!confirm("Seguro que quieres eliminar la categoria " + nombre + "?")) return
    await supabase.from("categorias").delete().eq("id", id)
    setMensaje("Categoria eliminada")
    cargarCategorias()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="La Economia Aya" className="h-12 w-auto" />
          <span className="font-bold text-lg">Gestionar Categorias</span>
        </div>
        <button onClick={() => navigate("/admin/dashboard")} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition">Volver</button>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="font-extrabold text-gray-800 text-xl mb-6">Agregar categoria</h3>
          <div className="flex gap-4">
            <input type="text" placeholder="Nombre de la categoria" value={nombre} onChange={(e) => setNombre(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <button onClick={handleAgregar} className="bg-red-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition">Agregar</button>
          </div>
          {mensaje && <p className="text-sm text-green-600 mt-3">{mensaje}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="font-extrabold text-gray-800 text-xl mb-6">Categorias actuales</h3>
          <div className="flex flex-col gap-3">
            {categorias.map((c) => (
              <div key={c.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="font-semibold text-gray-800">{c.nombre}</span>
                  <span className="ml-3 text-xs text-gray-400">{conteos[c.id] || 0} productos</span>
                </div>
                <button onClick={() => handleEliminar(c.id, c.nombre)} className={conteos[c.id] > 0 ? "text-xs font-bold px-4 py-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed" : "text-xs font-bold px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}