export default function Beneficios() {
  const items = [
    "💰 Precios bajos garantizados",
    "🚴 Domicilios rapidos a tu barrio",
    "📦 Gran variedad de productos",
    "🤝 Atencion familiar y cercana",
    "🕐 Abierto todos los dias desde 6am",
    "✅ Calidad garantizada",
  ]
  const loop = [...items, ...items]
  return (
    <div className="bg-red-800 py-3 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="text-white text-sm font-semibold flex-shrink-0">{item}</span>
        ))}
      </div>
    </div>
  )
}