import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/admin")
      } else {
        setAuth(true)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <img src="/logo.png" className="h-20 w-auto mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500 text-sm">Verificando sesion...</p>
      </div>
    </div>
  )

  return auth ? <>{children}</> : null
}