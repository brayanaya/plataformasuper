import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../services/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
  productos?: Product[]
}

interface Product {
  id: string
  nombre: string
  precio: number
  imagen_url?: string
  disponible: boolean
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola! Soy el asistente de La Economia Aya. Preguntame por cualquier producto y te ayudo a encontrarlo.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const searchProducts = async (query: string): Promise<Product[]> => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('disponible', true)
      .ilike('nombre', '%' + query + '%')
      .limit(5)
    return data || []
  }

  const askGemini = async (userMessage: string, productos: Product[]): Promise<string> => {
    const productosTexto = productos.length > 0
      ? productos.map(p => '- ' + p.nombre + ': $' + p.precio.toLocaleString()).join('\n')
      : 'No encontre productos con ese nombre exacto.'

    const prompt = 'Eres el asistente virtual de La Economia Aya, un supermercado familiar en Neiva, Huila, Colombia. Responde siempre en espanol informal y amigable. Se breve y util.\n\nEl cliente pregunto: ' + userMessage + '\n\nProductos encontrados en inventario:\n' + productosTexto + '\n\nResponde de forma util y amigable.'

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + import.meta.env.VITE_GEMINI_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const keywords = userMsg.toLowerCase().replace(/[?,!.]/g, '').split(' ').filter(w => w.length > 3)
      let productos: Product[] = []
      for (const keyword of keywords) {
        const found = await searchProducts(keyword)
        productos = [...productos, ...found]
      }
      const unique = productos.filter((p, i, self) => self.findIndex(x => x.id === p.id) === i)
      const respuesta = await askGemini(userMsg, unique)
      setMessages(prev => [...prev, { role: 'assistant', content: respuesta, productos: unique }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ups! Tuve un problema. Intentalo de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={'fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 bg-red-700 hover:bg-red-600'}
      >
        {open ? (
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        ) : (
          <svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z' />
          </svg>
        )}
      </button>

      <div className={'fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ' + (open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none')} style={{ height: '480px' }}>
        <div className='bg-red-700 px-4 py-3 flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black text-sm'>AYA</div>
          <div>
            <p className='text-white font-bold text-sm'>Asistente La Economia Aya</p>
            <p className='text-red-200 text-xs'>En linea ahora</p>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50'>
          {messages.map((msg, i) => (
            <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={'max-w-[80%] px-4 py-2 rounded-2xl text-sm ' + (msg.role === 'user' ? 'bg-red-700 text-white rounded-br-none' : 'bg-white text-gray-800 shadow rounded-bl-none')}>
                {msg.content}
                {msg.productos && msg.productos.length > 0 && (
                  <div className='mt-2 flex flex-col gap-1'>
                    {msg.productos.map(p => (
                      <div key={p.id} className='bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2'>
                        <p className='font-semibold text-gray-800 text-xs'>{p.nombre}</p>
                        <p className='text-red-700 font-bold text-xs'></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className='flex justify-start'>
              <div className='bg-white shadow rounded-2xl rounded-bl-none px-4 py-3 flex gap-1'>
                <span className='w-2 h-2 bg-red-700 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                <span className='w-2 h-2 bg-red-700 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                <span className='w-2 h-2 bg-red-700 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='p-3 bg-white border-t flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder='Pregunta por un producto...'
            className='flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-700 transition'
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className='bg-red-700 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}