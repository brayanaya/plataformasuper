export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <img src="/logo.png" alt="La Economia Aya" className="h-16 w-auto" />
          <p className="text-gray-400 text-xs leading-relaxed">Tu supermercado de confianza en Neiva, Huila. Calidad y precios bajos para tu familia.</p>
          <div className="flex gap-3 mt-1">
            <a href="https://www.facebook.com/profile.php?id=100063686697288" target="_blank" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://wa.me/573226937375" target="_blank" className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 hover:scale-110 transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-extrabold text-white mb-4 text-xs uppercase tracking-wider">Sede Principal</h4>
          <p className="text-gray-400 text-xs">Calle 10 Sur 21-92</p>
          <p className="text-gray-400 text-xs">Barrio Santa Isabel, Neiva</p>
          <p className="text-yellow-400 text-xs mt-2 font-semibold">6am - 8pm todos los dias</p>
        </div>
        <div>
          <h4 className="font-extrabold text-white mb-4 text-xs uppercase tracking-wider">Sede Olaya</h4>
          <p className="text-gray-400 text-xs">Cra 52 No. 26a-03</p>
          <p className="text-gray-400 text-xs">Barrio Olaya Herrera, Neiva</p>
          <p className="text-yellow-400 text-xs mt-2 font-semibold">6am - 9pm todos los dias</p>
        </div>
        <div>
          <h4 className="font-extrabold text-white mb-4 text-xs uppercase tracking-wider">Contacto</h4>
          <p className="text-gray-400 text-xs">Cristian Camilo Aya Alvarez</p>
          <p className="text-white font-bold text-sm mt-0.5">322 693 7375</p>
          <p className="text-gray-400 text-xs mt-2">Edwin Andres Aya Diaz</p>
          <p className="text-white font-bold text-sm mt-0.5">315 340 0962</p>
          <a href="https://wa.me/573226937375" target="_blank" className="mt-3 flex items-center gap-2 bg-green-500 hover:bg-green-400 transition text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Escribenos
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-gray-500 text-xs">2025 Supermercado La Economia Aya. Todos los derechos reservados.</p>
        <p className="text-gray-600 text-xs">Desarrollado por Brayan Aya</p>
      </div>
    </footer>
  )
}