export default function Contacto() {
  return (
    <section id="contacto" className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">Contactenos</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Estamos para servirte</p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
              <h3 className="font-extrabold text-red-700 text-lg">Sede Principal - Santa Isabel</h3>
              <p className="text-gray-600 text-sm">Calle 10 Sur 21-92, Barrio Santa Isabel, Neiva, Huila</p>
              <p className="text-gray-600 text-sm">Todos los dias: 6am - 8pm</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
              <h3 className="font-extrabold text-red-700 text-lg">Sede Olaya Herrera</h3>
              <p className="text-gray-600 text-sm">Barrio Olaya Herrera, Neiva, Huila</p>
              <p className="text-gray-600 text-sm">Todos los dias: 6am - 9pm</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
              <h3 className="font-extrabold text-gray-800 text-lg">Contacto directo</h3>
              <p className="text-gray-600 text-sm">Cristian Camilo Aya Alvarez: 322 693 7375</p>
              <p className="text-gray-600 text-sm">Edwin Andres Aya Diaz: 315 340 0962</p>
            </div>
            <a href="https://wa.me/573226937375" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold px-6 py-4 rounded-2xl text-center hover:bg-green-400 transition text-lg">Escribenos por WhatsApp</a>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-xl">Envianos un mensaje</h3>
            <input type="text" placeholder="Tu nombre" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <input type="tel" placeholder="Tu telefono" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700" />
            <textarea placeholder="Tu mensaje" rows={5} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-700 resize-none" />
            <button className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition">Enviar mensaje</button>
          </div>
        </div>
      </div>
    </section>
  )
}