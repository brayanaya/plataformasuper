export default function Contacto() {
  const handleWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value
    const mensaje = (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value
    window.open('https://wa.me/573226937375?text=' + encodeURIComponent('Hola! Soy ' + nombre + '. ' + mensaje), '_blank')
  }
  return (
    <section id="contacto" className="bg-white py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-700">Contactenos</h2>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">Estamos para servirte</p>
          <div className="w-10 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-gray-800 text-sm">Nuestras Sedes</h3>
            <a href="https://maps.google.com/?q=Calle+10+Sur+21-92+Santa+Isabel+Neiva" target="_blank" className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-red-300 transition group">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-700 mt-1 flex-shrink-0 shadow shadow-red-300" />
                <div>
                  <p className="font-bold text-red-700 text-xs">Sede Principal - Santa Isabel</p>
                  <p className="text-gray-600 text-xs mt-0.5">Calle 10 Sur 21-92, Barrio Santa Isabel, Neiva</p>
                  <p className="text-gray-400 text-xs">Lunes a Domingo: 6am - 8pm</p>
                  <p className="text-red-700 text-xs mt-1 font-semibold group-hover:underline">Ver en Google Maps</p>
                </div>
              </div>
            </a>
            <a href="https://maps.google.com/?q=Carrera+52+26a-03+Olaya+Herrera+Neiva" target="_blank" className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-red-300 transition group">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-700 mt-1 flex-shrink-0 shadow shadow-red-300" />
                <div>
                  <p className="font-bold text-red-700 text-xs">Sede Olaya Herrera</p>
                  <p className="text-gray-600 text-xs mt-0.5">Cra 52 #26a-03, Barrio Olaya Herrera, Neiva</p>
                  <p className="text-gray-400 text-xs">Lunes a Domingo: 6am - 9pm</p>
                  <p className="text-red-700 text-xs mt-1 font-semibold group-hover:underline">Ver en Google Maps</p>
                </div>
              </div>
            </a>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-extrabold text-gray-800 text-xs mb-2">Contacto Directo</h3>
              <a href="tel:3226937375" className="block text-xs text-gray-600 hover:text-red-700 transition">Cristian Camilo Aya Alvarez: 322 693 7375</a>
              <a href="tel:3153400962" className="block text-xs text-gray-600 hover:text-red-700 transition mt-0.5">Edwin Andres Aya Diaz: 315 340 0962</a>
              <div className="flex gap-3 mt-2">
                <a href="https://wa.me/573226937375" target="_blank" className="text-xs text-green-600 font-bold hover:underline">WhatsApp</a>
                <a href="https://www.facebook.com/profile.php?id=100063686697288" target="_blank" className="text-xs text-blue-600 font-bold hover:underline">Facebook</a>
              </div>
            </div>
            <h3 className="font-extrabold text-gray-800 text-sm">Envianos un mensaje</h3>
            <form onSubmit={handleWhatsApp} className="flex flex-col gap-3">
              <input name="nombre" type="text" placeholder="Tu nombre" required className="border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-700" />
              <textarea name="mensaje" placeholder="Tu mensaje" required rows={3} className="border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-red-700 resize-none" />
              <button type="submit" className="bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition text-sm">Enviar por WhatsApp</button>
            </form>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-800 text-sm">Nuestras ubicaciones</h3>
              <a href="https://www.google.com/maps/search/La+Economia+Aya+Neiva" target="_blank" className="text-xs text-red-700 font-semibold hover:underline">Abrir en Google Maps</a>
            </div>
            <div className="rounded-2xl overflow-hidden shadow border border-gray-100 flex-1" style={{ minHeight: '480px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d15942.5!2d-75.2820!3d2.9273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1ssupermercado+la+economia+aya+neiva!5e0!3m2!1ses!2sco!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '480px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Supermercado La Economia Aya - Neiva"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}