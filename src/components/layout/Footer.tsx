export default function Footer() {
  return (
    <footer className="bg-black text-white pt-14 pb-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
          <div className="md:col-span-1 flex flex-col gap-4">
            <img src="/logo.png" alt="La Economia Aya" className="h-20 w-20 object-contain" />
            <p className="text-gray-400 text-sm leading-relaxed">Tu supermercado de confianza en Neiva, Huila. Precios bajos y calidad garantizada.</p>
            <a href="https://wa.me/573226937375" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-full text-center hover:bg-green-400 transition text-sm">Escribenos por WhatsApp</a>
            <div className="flex gap-3 mt-1">
              <a href="https://www.facebook.com/profile.php?id=100063686697288" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold hover:bg-blue-500 transition">f</a>
              <a href="https://wa.me/573226937375" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold hover:bg-green-400 transition">W</a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-yellow-400 text-sm uppercase tracking-wider">Sede Principal</h3>
            <p className="text-gray-400 text-sm">Calle 10 Sur 21-92</p>
            <p className="text-gray-400 text-sm">Barrio Santa Isabel, Neiva</p>
            <p className="text-white text-sm font-semibold">6am - 8pm todos los dias</p>
            <a href="https://maps.google.com/?q=Calle+10+Sur+21-92+Neiva+Huila" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Ver en Google Maps</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-yellow-400 text-sm uppercase tracking-wider">Sede Olaya</h3>
            <p className="text-gray-400 text-sm">Cra 52 No. 26a-03</p>
            <p className="text-gray-400 text-sm">Barrio Olaya Herrera, Neiva</p>
            <p className="text-white text-sm font-semibold">6am - 9pm todos los dias</p>
            <a href="https://maps.google.com/?q=Cra+52+26a-03+Olaya+Herrera+Neiva+Huila" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Ver en Google Maps</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-yellow-400 text-sm uppercase tracking-wider">Contacto</h3>
            <div>
              <p className="text-gray-400 text-xs">Cristian Camilo Aya Alvarez</p>
              <a href="tel:3226937375" className="text-white font-bold text-sm hover:text-yellow-400 transition">322 693 7375</a>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Edwin Andres Aya Diaz</p>
              <a href="tel:3153400962" className="text-white font-bold text-sm hover:text-yellow-400 transition">315 340 0962</a>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <h4 className="text-gray-400 text-xs uppercase tracking-wider">Enlaces</h4>
              <a href="/admin" className="text-gray-500 text-xs hover:text-yellow-400 transition">Panel Admin</a>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">2025 Supermercado La Economia Aya. Todos los derechos reservados.</p>
          <p className="text-gray-600 text-xs">Desarrollado con amor para Neiva</p>
        </div>
      </div>
    </footer>
  )
}