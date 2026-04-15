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
import PanelModerador from "./pages/PanelModerador";

import EULA from "./pages/EULA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutTeam from "./pages/AboutTeam";
import FAQ from "./pages/FAQ";

import { useOffline } from "./hooks/useOffline";
import { useMaintenance } from "./hooks/useMaintenance";

function App() {
  useOffline();
  const maintenance = useMaintenance();

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "MXN",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <ThemeProvider>

        {maintenance.show_banner && maintenance.message && (
          <div style={{
            backgroundColor: '#ff4d4f',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            position: 'sticky',
            top: 0,
            zIndex: 9999,
          }}>
            ⚠️ {maintenance.message}
          </div>
        )}

        <InstallPrompt />
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
                <RequireRole allowed={["admin", "oferente", "turista", "moderador"]}>
                  <Reservas />
                </RequireRole>
              } 
            />

            {/* Ordenes */}
            <Route 
              path="/ordenes" 
              element={
                <RequireRole allowed={["admin", "oferente", "turista", "moderador"]}>
                  <Ordenes />
                </RequireRole>
              } 
            />

            <Route path="/recomendaciones" element={<Recomendaciones />} />

            {/* Categorias */}
            <Route 
              path="/categorias" 
              element={
                <RequireRole allowed={["admin", "moderador"]}>
                  <Categorias />
                </RequireRole>
              } 
            />

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

            {/* 🔥 ANALITICAS (CORREGIDO) */}
            <Route
              path="/analiticas"
              element={
                <RequireRole allowed={["admin", "moderador"]}>
                  <Analiticas />
                </RequireRole>
              }
            />

            {/* Perfil */}
            <Route
              path="/perfil"
              element={
                <RequireRole allowed={["turista", "oferente", "admin", "moderador"]}>
                  <MiPerfil />
                </RequireRole>
              }
            />

            <Route path="/error" element={<ErrorPage />} />

            {/* Auth */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />

            {/* 🔥 USUARIOS (CORREGIDO) */}
            <Route
              path="/usuarios"
              element={
                <RequireRole allowed={["admin", "moderador"]}>
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
                <RequireRole allowed={["admin", "oferente", "moderador"]}>
                  <Oferentes />
                </RequireRole>
              } 
            />

            <Route 
              path="/oferentes/crear" 
              element={
                <RequireRole allowed={["admin", "oferente"]}>
                  <CrearOferente />
                </RequireRole>
              } 
            />

            <Route
              path="/oferentes/editar/:id"
              element={
                <RequireRole allowed={["admin", "oferente", "moderador"]}>
                  <EditarOferente />
                </RequireRole>
              }
            />

            {/* Servicios */}
            <Route
              path="/servicios"
              element={
                <RequireRole allowed={["oferente", "admin", "moderador"]}>
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
                <RequireRole allowed={["oferente", "admin", "moderador"]}>
                  <EditarServicio />
                </RequireRole>
              }
            />

            {/* Productos */}
            <Route 
              path="/productos" 
              element={
                <RequireRole allowed={["admin", "oferente", "moderador"]}>
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
                <RequireRole allowed={["oferente", "admin", "moderador"]}>
                  <EditarProducto />
                </RequireRole>
              }
            />

            {/* Público */}
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/gastronomia" element={<Catalogo />} />
            <Route path="/artesanias" element={<Catalogo />} />

            {/* Paneles */}
            <Route
              path="/panel-oferente"
              element={
                <RequireRole allowed={["oferente", "admin"]}>
                  <Servicios />
                </RequireRole>
              }
            />

            <Route
              path="/panel-moderador"
              element={
                <RequireRole allowed={["moderador", "admin"]}>
                  <PanelModerador />
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

            {/* Anuncios */}
            <Route
              path="/anuncios"
              element={
                <RequireRole allowed={["admin", "moderador"]}>
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
                <RequireRole allowed={["admin", "moderador"]}>
                  <EditarAnuncio />
                </RequireRole>
              }
            />

            <Route path="/anuncios-publicos" element={<AnunciosPublicos />} />

            <Route path="/oferente/:id" element={<OferenteDetail />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* Legal */}
            <Route path="/eula" element={<EULA />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfService />} />
            <Route path="/equipo" element={<AboutTeam />} />
            <Route path="/faq" element={<FAQ />} />

            <Route path="*" element={<ErrorPage />} />

          </Routes>
        </Router>
      </ThemeProvider>
    </PayPalScriptProvider>
  );
}

export default App;