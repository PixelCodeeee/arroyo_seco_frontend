import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import EditarUsuario from './pages/EditarUsuario';
import Oferentes from './pages/Oferentes';
import CrearOferente from './pages/CrearOferente';
import EditarOferente from './pages/EditarOferente';
import Servicios from './pages/Servicios';
import CrearServicio from './pages/CrearServicio';
import EditarServicio from './pages/EditarServicio';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Productos from './pages/Productos';
import CrearProducto from './pages/CrearProducto';
import EditarProducto from './pages/EditarProducto';
import CrearCategoria from './pages/CrearCategoria';
import EditarCategoria from './pages/EditarCategoria';
import OferenteDetail from './pages/OferenteDetail';
import ErrorPage from './pages/ErrorPage';
import RequireRole from "./components/RequireRole";
import MiPerfil from "./pages/MiPerfil";
import CatalogoViejo from './pages/catalogoviejo';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/viejo" element={<CatalogoViejo />} />
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

        {/* Oferentes - SOLO admin */}
        <Route
          path="/oferentes"
          element={
              <Oferentes />
          }
        />
        <Route
          path="/oferentes/crear"
          element={
              <CrearOferente />
          }
        />
        <Route
          path="/oferentes/editar/:id"
          element={
            <RequireRole allowed={["admin"]}>
              <EditarOferente />
            </RequireRole>
          }
        />

        {/* Servicios - SOLO admin */}
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

        {/* Productos - SOLO admin*/}
        <Route
          path="/productos"
          element={
              <Productos />
          }
        />
        <Route
          path="/productos/crear"
          element={    <CrearProducto />
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
        <Route path="/oferente/:id" element={<OferenteDetail />} />
        <Route path="/carrito" element={<Carrito />} />

        <Route path="/catalogoviejo" element={<catalogoviejo />} />

      </Routes>
    </Router>
  );
}

export default App;
