import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeProvider";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Usuarios from "./pages/Usuarios";
import EditarUsuario from "./pages/EditarUsuario";
import Oferentes from "./pages/Oferentes";
import CrearOferente from "./pages/CrearOferente";
import EditarOferente from "./pages/EditarOferente";
import RecuperarPassword from "./pages/RecuperarPassword";
import Servicios from "./pages/Servicios";
import CrearServicio from "./pages/CrearServicio";
import EditarServicio from "./pages/EditarServicio";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Productos from "./pages/Productos";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";
import CrearCategoria from "./pages/CrearCategoria";
import EditarCategoria from "./pages/EditarCategoria";
import OferenteDetail from "./pages/OferenteDetail";
import ErrorPage from "./pages/ErrorPage";
import RequireRole from "./components/RequireRole";
import MiPerfil from "./pages/MiPerfil";
import SettingsModal from "./components/SettingsModal";
import OfflineIndicator from "./components/OfflineIndicator";
import ScrollToTop from "./components/ScrollToTop";
import Categorias from './pages/Categorias';
import Ordenes from './pages/Ordenes';
import Reservas from './pages/Reservas';
import Contact from './pages/Contacto';
import Anuncios from './pages/Anuncios';
import AnunciosPublicos from './pages/AnunciosPublicos';
import CrearAnuncio from './pages/CrearAnuncio';
import EditarAnuncio from './pages/EditarAnuncio';
import Recomendaciones from "./pages/Recomendaciones";
import Analiticas from "./pages/Analiticas";
import InstallPrompt from "./components/InstallPrompt";

import EULA from "./pages/EULA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutTeam from "./pages/AboutTeam";
import FAQ from "./pages/FAQ";

function App() {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "MXN",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <ThemeProvider>
        <InstallPrompt />
        <OfflineIndicator />
        <SettingsModal />
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/contacto" element={<Contact />} />

            {/* Reservas */}
            <Route 
              path="/reservas" 
              element={
                <RequireRole allowed={["admin", "oferente", "turista"]}>
                  <Reservas />
                </RequireRole>
              } 
            />

            {/* Ordenes */}
            <Route 
              path="/ordenes" 
              element={
                <RequireRole allowed={["admin", "oferente", "turista"]}>
                  <Ordenes />
                </RequireRole>
              } 
            />

            <Route path="/recomendaciones" element={<Recomendaciones />} />

            {/* Categorias - Viewer/Editor */}
            <Route 
              path="/categorias" 
              element={
                <RequireRole allowed={["admin", "oferente"]}>
                  <Categorias />
                </RequireRole>
              } 
            />

            <Route
              path="/analiticas"
              element={
                <RequireRole allowed={["admin"]}>
                  <Analiticas />
                </RequireRole>
              }
            />

            {/* Perfil: cualquier usuario */}
            <Route
              path="/perfil"
              element={
                <RequireRole allowed={["turista", "oferente", "admin"]}>
                  <MiPerfil />
                </RequireRole>
              }
            />

            {/* Settings (Now a Modal, Route removed) */}

            {/* Página de error */}
            <Route path="/error" element={<ErrorPage />} />

            {/* Categorías - SOLO admin */}
            <Route
              path="/categorias/crear"
              element={
                <RequireRole allowed={["admin"]}>
                  <CrearCategoria />
                </RequireRole>
              }
            />
            <Route
              path="/categorias/editar/:id"
              element={
                <RequireRole allowed={["admin"]}>
                  <EditarCategoria />
                </RequireRole>
              }
            />

            {/* Inicio y auth */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />

            {/* Usuarios - SOLO admin */}
            <Route
              path="/usuarios"
              element={
                <RequireRole allowed={["admin"]}>
                  <Usuarios />
                </RequireRole>
              }
            />
            <Route
              path="/usuarios/editar/:id"
              element={
                <RequireRole allowed={["admin"]}>
                  <EditarUsuario />
                </RequireRole>
              }
            />

            {/* Oferentes */}
            <Route 
              path="/oferentes" 
              element={
                <RequireRole allowed={["admin", "oferente"]}>
                  <Oferentes />
                </RequireRole>
              } 
            />
            <Route 
              path="/oferentes/crear" 
              element={
                <RequireRole allowed={["admin"]}>
                  <CrearOferente />
                </RequireRole>
              } 
            />
            <Route
              path="/oferentes/editar/:id"
              element={
                <RequireRole allowed={["admin", "oferente"]}>
                  <EditarOferente />
                </RequireRole>
              }
            />

            {/* Servicios */}
            <Route
              path="/servicios"
              element={
                <RequireRole allowed={["oferente", "admin"]}>
                  <Servicios />
                </RequireRole>
              }
            />
            <Route
              path="/servicios/crear"
              element={
                <RequireRole allowed={["oferente", "admin"]}>
                  <CrearServicio />
                </RequireRole>
              }
            />
            <Route
              path="/servicios/editar/:id"
              element={
                <RequireRole allowed={["oferente", "admin"]}>
                  <EditarServicio />
                </RequireRole>
              }
            />

            {/* Productos */}
            <Route 
              path="/productos" 
              element={
                <RequireRole allowed={["admin", "oferente"]}>
                  <Productos />
                </RequireRole>
              } 
            />
            <Route 
              path="/productos/crear" 
              element={
                <RequireRole allowed={["admin", "oferente"]}>
                  <CrearProducto />
                </RequireRole>
              } 
            />
            <Route
              path="/productos/editar/:id"
              element={
                <RequireRole allowed={["oferente", "admin"]}>
                  <EditarProducto />
                </RequireRole>
              }
            />

            {/* Público */}
            <Route path="/catalogo" element={<Catalogo />} />

            {/* Rutas de categorías */}
            <Route path="/gastronomia" element={<Catalogo />} />
            <Route path="/artesanias" element={<Catalogo />} />

            {/* Panel oferente */}
            <Route
              path="/panel-oferente"
              element={
                <RequireRole allowed={["oferente", "admin"]}>
                  <Servicios />
                </RequireRole>
              }
            />
            {/* Anuncios  */}
            <Route
              path="/anuncios"
              element={
                <RequireRole allowed={["admin"]}>
                  <Anuncios />
                </RequireRole>
              }
            />
            <Route
              path="/anuncios/crear"
              element={
                <RequireRole allowed={["admin"]}>
                  <CrearAnuncio />
                </RequireRole>
              }
            />
            <Route
              path="/anuncios/editar/:id"
              element={
                <RequireRole allowed={["admin"]}>
                  <EditarAnuncio />
                </RequireRole>
              }
            />

            <Route
              path="/panel-admin"
              element={
                <RequireRole allowed={["admin"]}>
                  <Servicios />
                </RequireRole>
              }
            />
            {/* Anuncios públicos - todos pueden ver */}
            <Route path="/anuncios-publicos" element={<AnunciosPublicos />} />

            <Route path="/oferente/:id" element={<OferenteDetail />} />
            <Route path="/carrito" element={<Carrito />} />
            
            {/* Legal Pages */}
            <Route path="/eula" element={<EULA />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfService />} />
            <Route path="/equipo" element={<AboutTeam />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Catch-all route for robust 404 rendering */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </PayPalScriptProvider>
  );
}

export default App;
