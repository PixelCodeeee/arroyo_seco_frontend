import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Usuarios from "./pages/Usuarios";
import EditarUsuario from "./pages/EditarUsuario";
import Oferentes from "./pages/Oferentes";
import CrearOferente from "./pages/CrearOferente";
import EditarOferente from "./pages/EditarOferente";
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
import Categorias from './pages/Categorias';
import Ordenes from './pages/Ordenes';
import Reservas from './pages/Reservas';
import Contact from './pages/Contacto';
import Anuncios from './pages/Anuncios';
import AnunciosPublicos from './pages/AnunciosPublicos';

import CrearAnuncio from './pages/CrearAnuncio';
import EditarAnuncio from './pages/EditarAnuncio';

import Categorias from "./pages/Categorias";
import Ordenes from "./pages/Ordenes";
import Reservas from "./pages/Reservas";
import Contact from "./pages/Contacto";
import Recomendaciones from "./pages/Recomendaciones";
import Analiticas from "./pages/Analiticas";

function App() {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "MXN",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <Routes>
          <Route path="/contacto" element={<Contact />} />

          <Route path="/reservas" element={<Reservas />} />

          <Route path="/ordenes" element={<Ordenes />} />

          <Route path="/recomendaciones" element={<Recomendaciones />} />

          <Route path="/categorias" element={<Categorias />} />

          <Route
            path="/analiticas"
            element={
              <RequireRole allowed={["admin", "oferente"]}>
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
          <Route path="/oferentes" element={<Oferentes />} />
          <Route path="/oferentes/crear" element={<CrearOferente />} />
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
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/crear" element={<CrearProducto />} />
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
    <RequireRole allowed={["admin","oferente"]}>
      <Anuncios />
    </RequireRole>
  }
/>
<Route
  path="/anuncios/crear"
  element={
    <RequireRole allowed={["admin","oferente"]}>
      <CrearAnuncio />
    </RequireRole>
  }
/>
<Route
  path="/anuncios/editar/:id"
  element={
    <RequireRole allowed={["admin","oferente"]}>
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
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
