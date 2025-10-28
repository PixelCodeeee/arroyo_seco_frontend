import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Usuarios from './pages/Usuarios';
import EditarUsuario from './pages/EditarUsuario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;