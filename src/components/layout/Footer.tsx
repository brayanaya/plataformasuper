export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-4 items-start">
          <img src="/logo.png" alt="La Economia Aya" className="h-24 w-24 object-contain" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Tu supermercado de confianza en Neiva, Huila. Precios bajos, calidad garantizada y domicilios a tu barrio.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-extrabold text-yellow-400 text-lg">Sedes</h3>
          <div>
            <p className="font-bold text-white text-sm">Sede Principal - Santa Isabel</p>
            <p className="text-gray-400 text-sm">Calle 10 Sur 21-92, Barrio Santa Isabel</p>
            <p className="text-gray-400 text-sm">Todos los dias: 6am - 8pm</p>
          </div>
          <div>
            <p className="font-bold text-white text-sm">Sede Olaya Herrera</p>
            <p className="text-gray-400 text-sm">Cra 52 No. 26a-03, Barrio Olaya Herrera</p>
            <p className="text-gray-400 text-sm">Todos los dias: 6am - 9pm</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-extrabold text-yellow-400 text-lg">Contacto</h3>
          <p className="text-gray-400 text-sm">Cristian Camilo Aya Alvarez</p>
          <p className="text-white font-bold text-sm">322 693 7375</p>
          <p className="text-gray-400 text-sm">Edwin Andres Aya Diaz</p>
          <p className="text-white font-bold text-sm">315 340 0962</p>
          <a href="https://wa.me/573226937375" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold px-6 py-3 rounded-full text-center hover:bg-green-400 transition text-sm">Escribenos por WhatsApp</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs">2025 Supermercado La Economia Aya. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}