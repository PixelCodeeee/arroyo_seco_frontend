import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LegalPages.css";

function FAQ() {
  return (
    <div className="bg-primary text-primary">
      <Navbar />
      <div className="legal-page-container">
        <header className="legal-header">
          <h1>Preguntas Frecuentes (FAQ)</h1>
          <p>¿Cómo funciona Arroyo Seco?</p>
        </header>

        <div className="legal-content">
          <h2>Para Turistas 🎒</h2>
          
          <div className="faq-item">
            <h3>¿Cómo realizo una reserva en un restaurante?</h3>
            <p>
              Explora la sección de Gastronomía. Selecciona un restaurante y haz clic en "Reservar". 
              Elige fecha, hora y número de personas. Tu reserva quedará en estado <strong>Pendiente</strong>.
              Debes esperar a que el oferente (restaurante) la cambie a <strong>Confirmada</strong>. 
              Si decides no asistir, puedes cancelarla siempre y cuando falten al menos 24 horas para tu visita.
            </p>
          </div>

          <div className="faq-item">
            <h3>¿Cómo compro productos o artesanías?</h3>
            <p>
              Navega por el Catálogo, agrega productos a tu carrito de compras y procede al pago seguro usando Mercado Pago. 
              Una vez pagado, tu orden pasará a estado <strong>Pagado / En Prep.</strong>. 
              El oferente te notificará cuando esté <strong>Lista para recoger</strong>.
            </p>
          </div>

          <h2 style={{ marginTop: '3rem' }}>Para Oferentes 🏬</h2>

          <div className="faq-item">
            <h3>¿Cómo conecto mi cuenta bancaria para recibir pagos?</h3>
            <p>
              Dirígete a tu perfil o "Gestión de Oferentes". Haz clic en el botón <strong>"Conectar Mercado Pago"</strong> 
              y autoriza la aplicación. Esto es obligatorio para que los turistas puedan comprar tus productos del catálogo.
            </p>
          </div>

          <div className="faq-item">
            <h3>¿Cómo administro las órdenes de los clientes?</h3>
            <p>
              En la pestaña de <strong>Órdenes</strong>, verás las compras que han hecho de tus productos. 
              Cuando hayas preparado los productos, cambia el estado a <strong>"Listo para recoger" (Enviado)</strong> 
              para que el turista sepa que puede ir por sus artículos. Una vez entregado, marca la orden como <strong>"Completado"</strong>.
            </p>
          </div>

          <div className="faq-item">
            <h3>¿Cómo administro las reservaciones de mi servicio gastronómico?</h3>
            <p>
              Desde la pestaña de <strong>Reservas</strong> podrás ver quién desea visitar tu negocio. 
              Dependiendo de tu disponibilidad, puedes cambiar su estado a <strong>Confirmada</strong> 
              o bien a <strong>Cancelada</strong> si no tienes espacio para esa fecha.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FAQ;
