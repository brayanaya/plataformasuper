export default function Beneficios() {
  const items = [
    { icon: "💰", titulo: "Precios bajos", desc: "Los mejores precios de Neiva en canasta familiar" },
    { icon: "🚴", titulo: "Domicilios rapidos", desc: "Llevamos tu pedido al barrio que necesites" },
    { icon: "📦", titulo: "Variedad", desc: "Todo lo que necesitas en un solo lugar" },
    { icon: "🤝", titulo: "Atencion familiar", desc: "Te atendemos con calidez y confianza" },
  ]
  return (
    <section className="bg-red-700 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="flex flex-col items-center text-center gap-2">
            <span className="text-4xl">{item.icon}</span>
            <h3 className="font-extrabold text-white text-sm md:text-base">{item.titulo}</h3>
            <p className="text-red-200 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}