export default function Beneficios() {
  const items = [
    { icon: '🏷️', text: 'Precios bajos garantizados' },
    { icon: '🚴', text: 'Domicilios rapidos a tu barrio' },
    { icon: '🛒', text: 'Gran variedad de productos' },
    { icon: '💛', text: 'Atencion familiar y cercana' },
    { icon: '🕐', text: 'Abierto todos los dias desde 6am' },
    { icon: '✅', text: 'Calidad garantizada' },
  ]
  const lista = [...items, ...items]
  return (
    <div className="bg-red-700 py-2.5 overflow-hidden">
      <div className="flex gap-8 animate-marquee whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
        {lista.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-white text-xs font-semibold flex-shrink-0">
            <span>{item.icon}</span>
            <span>{item.text}</span>
            <span className="text-red-400 ml-4">·</span>
          </span>
        ))}
      </div>
      <style>{@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }}</style>
    </div>
  )
}