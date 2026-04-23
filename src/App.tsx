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
import ProtectedRoute from "./components/ProtectedRoute"
import ScrollToTop from "./components/layout/ScrollToTop"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><WhatsAppButton /><ScrollToTop /></>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/cuartillas" element={<ProtectedRoute><AdminCuartillas /></ProtectedRoute>} />
        <Route path="/admin/productos" element={<ProtectedRoute><AdminProductos /></ProtectedRoute>} />
        <Route path="/admin/categorias" element={<ProtectedRoute><AdminCategorias /></ProtectedRoute>} />
        <Route path="/admin/pedidos" element={<ProtectedRoute><AdminPedidos /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App