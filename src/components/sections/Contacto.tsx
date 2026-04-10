export default function Contacto() {
  return (
    <section id="contacto" className="bg-white py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-2xl md:text-4xl font-extrabold text-red-700">Contactenos</h2>
          <p className="text-gray-500 mt-2 text-xs md:text-base">Estamos para servirte</p>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <div data-aos="fade-right" className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start border-l-4 border-red-700">
              <span className="text-2xl mt-1">📍</span>
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm mb-1">Sede Principal - Santa Isabel</h3>
                <p className="text-gray-500 text-sm">Calle 10 Sur 21-92, Barrio Santa Isabel</p>
                <p className="text-gray-500 text-sm">Neiva, Huila</p>
                <p className="text-red-700 font-semibold text-sm mt-1">Todos los dias: 6am - 8pm</p>
                <a href="https://maps.google.com/?q=Calle+10+Sur+21-92+Neiva+Huila" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">Ver en Google Maps</a>
              </div>
            </div>
            <div data-aos="fade-right" data-aos-delay="100" className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start border-l-4 border-red-700">
              <span className="text-2xl mt-1">📍</span>
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm mb-1">Sede Olaya Herrera</h3>
                <p className="text-gray-500 text-sm">Cra 52 No. 26a-03, Barrio Olaya Herrera</p>
                <p className="text-gray-500 text-sm">Neiva, Huila</p>
                <p className="text-red-700 font-semibold text-sm mt-1">Todos los dias: 6am - 9pm</p>
                <a href="https://maps.google.com/?q=Cra+52+26a-03+Olaya+Herrera+Neiva+Huila" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">Ver en Google Maps</a>
              </div>
            </div>
            <div data-aos="fade-right" data-aos-delay="200" className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start border-l-4 border-yellow-400">
              <span className="text-2xl mt-1">📞</span>
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm mb-2">Contacto directo</h3>
                <p className="text-gray-600 text-sm">Cristian Camilo Aya Alvarez</p>
                <a href="tel:3226937375" className="text-red-700 font-bold text-sm hover:underline">322 693 7375</a>
                <p className="text-gray-600 text-sm mt-2">Edwin Andres Aya Diaz</p>
                <a href="tel:3153400962" className="text-red-700 font-bold text-sm hover:underline">315 340 0962</a>
              </div>
            </div>
            <a href="https://wa.me/573226937375" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold px-6 py-4 rounded-2xl text-center hover:bg-green-400 transition">
              Escribenos por WhatsApp
            </a>
          </div>
          <div className="flex flex-col gap-4" data-aos="fade-left">
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-75.3050%2C2.9100%2C-75.2650%2C2.9450&layer=mapnik&marker=2.9273%2C-75.2834"
                width="100%"
                height="200"
                style={{border: 0}}
                loading="lazy"
                title="Sede Principal"
              />
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg">Envianos un mensaje</h3>
              <input type="text" placeholder="Tu nombre" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700 bg-white" />
              <input type="tel" placeholder="Tu telefono" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700 bg-white" />
              <textarea placeholder="Tu mensaje" rows={4} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700 resize-none bg-white" />
              <button className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">Enviar mensaje</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}