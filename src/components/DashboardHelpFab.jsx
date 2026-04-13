import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { HelpCircle, X } from "lucide-react";
import "../styles/DashboardHelp.css";

const helpContent = {
  admin: {
    "/": { title: "Panel de Inicio", text: "Aquí puedes ver una vista general del rendimiento del sistema Arroyo Seco." },
    "/ordenes": { title: "Órdenes del Sistema", text: "Como administrador puedes monitorear todas las órdenes de todos los oferentes, cambiar su estado en caso de emergencia y asegurar que fluya el proceso de compra." },
    "/reservas": { title: "Reservas del Sistema", text: "Visualiza todas las reservas gastronómicas. Puedes intervenir si un restaurante necesita soporte cancelando o confirmando reservas." },
    "/usuarios": { title: "Gestión de Usuarios", text: "Crea, edita o elimina usuarios. Asegúrate de dar el rol correcto a cada nuevo integrante." },
    "/oferentes": { title: "Oferentes", text: "Administra los negocios de la plataforma. Puedes aprobar, suspender o editar sus detalles." },
    "/productos": { title: "Productos Generales", text: "Aquí se listan las artesanías y platillos de todos los oferentes. Útil para revisión de catálogo." },
    "/servicios": { title: "Servicios Generales", text: "Gestión global de los restaurantes y experiencias que ofrecen los oferentes." },
    "/categorias": { title: "Categorías", text: "Crea categorías como 'Gastronómica' o 'Artesanal' para organizar mejor el catálogo público." },
    "/anuncios": { title: "Anuncios del Pueblo", text: "Crea festividades o comunicados importantes que verán los turistas." },
    "/analiticas": { title: "Analíticas", text: "Reportes y gráficas sobre ingresos, uso y afluencia." },
  },
  oferente: {
    "/": { title: "Inicio", text: "Visualiza un resumen rápido de tus ventas y reservas pendientes." },
    "/ordenes": { title: "Tus Órdenes", text: "Alguien compró tus productos. Prepáralos y cuando estén listos cambia el estado a 'Listo para recoger'. Si ya lo entregaste, cámbialo a 'Completado'." },
    "/reservas": { title: "Tus Reservaciones", text: "Aquí llegan las solicitudes de los turistas para visitar tu negocio. Por favor confírmalas si tienes espacio o cancélalas para no hacerlos esperar." },
    "/oferentes": { title: "Mi Perfil", text: "Aquí puedes conectar Mercado Pago para recibir ventas, y actualizar tu información pública." },
    "/productos": { title: "Mis Productos", text: "Agrega, edita y administra tu inventario de productos artesanales y platillos para el catálogo." },
    "/servicios": { title: "Mi Restaurante/Servicio", text: "Crea o edita la información del servicio principal que ofreces, con su capacidad y rango de precios." }
  },
  turista: {
    "/": { title: "Bienvenido a Arroyo Seco", text: "Desde tu panel puedes ver atajos para revisar el estado de tu visita e interacciones." },
    "/ordenes": { title: "Mis Compras", text: "Revisa el estado de la compra que hiciste en la tienda. 'Pendiente', 'Pagado' o si ya está 'Listo para recoger' para que pases al local." },
    "/reservas": { title: "Mis Reservaciones", text: "Lleva un control de tus experiencias. Si no puedes asistir, recuerda cancelarla al menos 24 horas antes para no afectar a los negocios locales." },
    "/perfil": { title: "Mi Perfil", text: "Actualiza tus datos o ajusta las configuraciones de accesibilidad." }
  }
};

function DashboardHelpFab() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!currentUser) return null;

  const rol = currentUser.rol || "turista";
  const currentPath = location.pathname;

  // Encontrar el contenido de ayuda más exacto (manejo de paths anidados)
  let foundHelp = { title: "Ayuda", text: "Si tienes dudas, revisa la sección FAQ en el pie de página." };
  
  if (helpContent[rol]) {
    // Exact match
    if (helpContent[rol][currentPath]) {
      foundHelp = helpContent[rol][currentPath];
    } else {
      // Base match (por ej. /ordenes/detalles)
      const baseUrl = "/" + currentPath.split("/")[1];
      if (helpContent[rol][baseUrl]) {
        foundHelp = helpContent[rol][baseUrl];
      }
    }
  }

  return (
    <>
      <button 
        className="help-fab" 
        onClick={() => setIsOpen(true)}
        title="Ayuda sobre esta sección"
      >
        <HelpCircle size={28} />
      </button>

      {isOpen && (
        <div className="help-modal-overlay">
          <div className="help-modal-content">
            <button className="help-modal-close" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
            <div className="help-modal-header">
              <h2>{foundHelp.title}</h2>
            </div>
            <div className="help-modal-body">
              <p>{foundHelp.text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardHelpFab;
