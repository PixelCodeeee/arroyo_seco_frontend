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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
        <Route path="/oferentes" element={<Oferentes />} />
        <Route path="/oferentes/crear" element={<CrearOferente />} />
        <Route path="/oferentes/editar/:id" element={<EditarOferente />} />
        <Route path="/Servicios" element={<Servicios />} />
        <Route path="/Servicios/crear" element={<CrearServicio />} />
        <Route path="/Servicios/editar/:id" element={<EditarServicio />} />
        
      </Routes>
    </Router>
  );
}

export default App;