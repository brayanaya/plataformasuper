export default function Contacto() {
  const handleWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value
    const mensaje = (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value
    const texto = 'Hola! Soy ' + nombre + '. ' + mensaje
    window.open('https://wa.me/573226937375?text=' + encodeURIComponent(texto), '_blank')
  }
  return (
    <section id="contacto" className="bg-white py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-red-700">Contactenos</h2>
          <p className="text-gray-500 mt-2 text-xs md:text-base">Estamos para servirte</p>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-extrabold text-gray-800 mb-3">Nuestras Sedes</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="font-bold text-red-700 text-sm">Sede Principal - Santa Isabel</p>
                  <p className="text-gray-600 text-xs mt-1">Calle 10 Sur 21-92, Barrio Santa Isabel, Neiva</p>
                  <p className="text-gray-500 text-xs mt-1">Lunes a Domingo: 6am - 8pm</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="font-bold text-red-700 text-sm">Sede Olaya Herrera</p>
                  <p className="text-gray-600 text-xs mt-1">Cra 52 #26a-03, Barrio Olaya Herrera, Neiva</p>
                  <p className="text-gray-500 text-xs mt-1">Lunes a Domingo: 6am - 9pm</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 mb-3">Contacto Directo</h3>
              <div className="flex flex-col gap-2">
                <a href="tel:3226937375" className="text-sm text-gray-600 hover:text-red-700 transition">Cristian: 322 693 7375</a>
                <a href="tel:3153400962" className="text-sm text-gray-600 hover:text-red-700 transition">Edwin: 315 340 0962</a>
                <a href="https://wa.me/573226937375" target="_blank" className="text-sm text-green-600 font-bold hover:underline">WhatsApp</a>
                <a href="https://www.facebook.com/profile.php?id=100063686697288" target="_blank" className="text-sm text-blue-600 font-bold hover:underline">Facebook</a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 mb-4">Envianos un mensaje</h3>
            <form onSubmit={handleWhatsApp} className="flex flex-col gap-3">
              <input name="nombre" type="text" placeholder="Tu nombre" required className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
              <textarea name="mensaje" placeholder="Tu mensaje" required rows={4} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700 resize-none" />
              <button type="submit" className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">Enviar por WhatsApp</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}