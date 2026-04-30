import { useState } from "react"
import { useCartStore } from "../../store/cartStore"
import { supabase } from "../../services/supabase"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CheckoutModal({ open, onClose }: Props) {
  const { items, total, clearCart } = useCartStore()
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [barrio, setBarrio] = useState("")
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState("")

  const handlePedido = async () => {
    if (!nombre || !telefono || !direccion) return setError("Por favor completa nombre, telefono y direccion")
    if (telefono.length < 7) return setError("Ingresa un numero de telefono valido")
    setLoading(true)
    setError("")
    const { data: pedido, error: pedidoError } = await supabase.from("pedidos").insert({
      nombre_cliente: nombre, telefono, direccion, barrio, total: total(), estado: "pendiente"
    }).select().single()
    if (pedidoError || !pedido) { setError("Error al registrar pedido, intenta de nuevo"); setLoading(false); return }
    const itemsParaInsertar = items.map((i) => ({ pedido_id: pedido.id, producto_id: i.id, cantidad: i.cantidad, precio_unitario: i.precio }))
    await supabase.from("pedido_items").insert(itemsParaInsertar)
    const listaProductos = items.map((i) => i.nombre + " x" + i.cantidad + " ($" + (i.precio * i.cantidad).toLocaleString() + ")").join(", ")
    const mensajeWA = "Hola! Soy " + nombre + ". Pedido por $" + total().toLocaleString() + ". Productos: " + listaProductos + ". Direccion: " + direccion + (barrio ? ", Barrio " + barrio : "") + ". Tel: " + telefono
    window.open("https://wa.me/573226937375?text=" + encodeURIComponent(mensajeWA), "_blank")
    clearCart()
    setExito(true)
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {exito ? (
          <div className="p-10 text-center flex flex-col gap-4">
            <span className="text-6xl">🎉</span>
            <h2 className="text-2xl font-extrabold text-red-700">Pedido enviado!</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Tu pedido fue registrado. Te redirigimos a WhatsApp para confirmarlo.</p>
            <button onClick={() => { setExito(false); onClose(); setNombre(""); setTelefono(""); setDireccion(""); setBarrio("") }} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">Cerrar</button>
          </div>
        ) : (
          <>
            <div className="bg-red-700 px-8 py-5 text-center">
              <h2 className="text-xl font-extrabold text-white">Finalizar pedido</h2>
              <p className="text-red-200 text-sm mt-1">Total: \</p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="bg-gray-50 rounded-xl p-3 max-h-32 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-600 py-0.5">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span className="font-bold">\</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-600 text-xs text-center bg-red-50 rounded-xl p-2">{error}</p>}
              <input type="text" placeholder="Tu nombre completo *" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
              <input type="tel" placeholder="Tu telefono *" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
              <input type="text" placeholder="Tu direccion *" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
              <input type="text" placeholder="Tu barrio (opcional)" value={barrio} onChange={(e) => setBarrio(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
              <button onClick={handlePedido} disabled={loading} className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50">
                {loading ? "Enviando..." : "Confirmar pedido"}
              </button>
              <button onClick={onClose} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}