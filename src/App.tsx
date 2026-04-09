import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCuartillas from "./pages/AdminCuartillas"
import AdminProductos from "./pages/AdminProductos"
import AdminCategorias from "./pages/AdminCategorias"
import AdminPedidos from "./pages/AdminPedidos"
import WhatsAppButton from "./components/layout/WhatsAppButton"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><WhatsAppButton /></>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/cuartillas" element={<AdminCuartillas />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App