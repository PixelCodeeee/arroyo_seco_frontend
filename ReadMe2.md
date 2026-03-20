# Arroyo Seco Frontend - Progressive Web App (PWA)

Este repositorio contiene la implementación del **Frontend (Fase 2)** del proyecto Arroyo Seco. Es una **Progressive Web App (PWA)** construida con **React** y **Vite**, diseñada para interactuar con la nueva arquitectura de microservicios del backend.

## 🏗️ Arquitectura y Tecnologías

El frontend está diseñado como una aplicación de página única (SPA) moderna y responsiva:

- **Core**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Estado**: React Context API + Hooks dedicados
- **PWA**: Service Workers para soporte offline e instalación.
- **Estilos**: CSS Modules / Styled Components (según implementación).

### Estructura del Sistema de Reseñas

Este módulo implementa un sistema completo de reseñas para la plataforma Arroyo Seco PWA, permitiendo a turistas y oferentes interactuar mediante reseñas, respuestas y reportes, con un panel de administración para moderación.

## 🏗️ Estructura del Módulo de Reseñas

```
src/
├── components/
│   ├── admin/
│   │   └── AdminDashboard.jsx          # Panel de administración con estadísticas
│   ├── reviews/
│   │   ├── RatingStars.jsx             # Componente de estrellas interactivas
│   │   ├── ReportModal.jsx             # Modal para reportar reseñas
│   │   ├── ResponseForm.jsx            # Formulario para responder reseñas
│   │   ├── ReviewButton.jsx            # Botón contextual para escribir reseña
│   │   ├── ReviewCard.jsx              # Tarjeta individual de reseña
│   │   ├── ReviewForm.jsx              # Formulario de creación/edición
│   │   ├── ReviewList.jsx              # Lista paginada de reseñas
│   │   ├── ReviewResponse.jsx          # Visualización de respuesta de oferente
│   │   └── ReviewStats.jsx             # Estadísticas y distribución de ratings
├── hooks/
│   └── useReviews.jsx                  # Hook personalizado para gestión de reseñas
├── pages/
│   ├── reviews/
│   │   ├── MisResenas.jsx              # Mis reseñas (vista de turista)
│   │   ├── MisReportes.jsx             # Historial de reportes del usuario
│   │   ├── ModerarResenas.jsx          # Panel de moderación (admin)
│   │   └── ResenasOferente.jsx         # Reseñas del negocio (vista de oferente)
│   └── OferenteDetail.jsx              # Detalle de oferente con sección de reseñas
├── services/
│   └── api.js                          # Servicios API para reseñas
├── styles/
│   ├── pages/
│   │   ├── AdminDashboard.css          # Estilos del panel admin
│   │   ├── MisReportes.css             # Estilos de historial de reportes
│   │   ├── MisResenas.css              # Estilos de mis reseñas
│   │   ├── ModerarResenas.css          # Estilos de moderación
│   │   └── ResenasOferente.css         # Estilos de reseñas de negocio
│   └── reviews/
│       ├── RatingStars.css             # Estilos de estrellas
│       ├── ReportModal.css             # Estilos de modal de reporte
│       ├── ResponseForm.css            # Estilos de formulario de respuesta
│       ├── ReviewCard.css              # Estilos de tarjeta de reseña
│       ├── ReviewForm.css              # Estilos de formulario de reseña
│       ├── ReviewList.css              # Estilos de lista paginada
│       ├── ReviewResponse.css          # Estilos de respuestas
│       └── ReviewStats.css             # Estilos de estadísticas
└── utils/
    └── reviewUtils.js                  # Utilidades (formato de fechas, validaciones)
```

## 👥 Roles y Permisos

### Turista

| Acción | Descripción | Ruta |
|--------|-------------|------|
| ✍️ Escribir reseña | Calificar y comentar sobre un negocio | `/oferente/:id` |
| ✏️ Editar reseña | Modificar su propia reseña | Desde su perfil o reseña |
| 🗑️ Eliminar reseña | Eliminar su propia reseña | Desde su perfil o reseña |
| 🚩 Reportar reseña | Denunciar reseñas inapropiadas de otros | Desde cualquier reseña |
| 📝 Ver mis reseñas | Lista de todas sus reseñas | `/perfil/mis-resenas` |

### Oferente

| Acción | Descripción | Ruta |
|--------|-------------|------|
| 👁️ Ver reseñas | Reseñas de sus negocios | `/perfil/resenas-negocio` |
| 💬 Responder | Responder a reseñas de clientes | Desde cada reseña (una por reseña) |
| 🚩 Reportar | Reportar reseñas falsas de su negocio | Desde cualquier reseña |
| 📊 Ver estadísticas | Promedio y distribución de calificaciones | En la página de reseñas |

### Administrador

| Acción | Descripción | Ruta |
|--------|-------------|------|
| 📊 Dashboard | Estadísticas generales, top oferentes, usuarios activos | `/admin/dashboard` |
| ⚖️ Moderar reseñas | Gestionar reportes pendientes | `/admin/moderar-resenas` |
| 🔒 Ocultar reseña | Reseña deja de ser visible para usuarios | Desde panel de moderación |
| 🗑️ Eliminar reseña | Eliminación permanente de la reseña | Desde panel de moderación |
| ✅ Mantener reseña | Rechazar reporte, reseña sigue visible | Desde panel de moderación |

## 🔧 Endpoints Principales

### Reseñas

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Crear nueva reseña | ✅ (turista) |
| GET | `/api/reviews/mis-reviews` | Obtener mis reseñas | ✅ (turista) |
| GET | `/api/reviews/oferente/:id` | Reseñas de un negocio | ✅ |
| DELETE | `/api/reviews/:id` | Eliminar reseña | ✅ (autor/admin) |


### Reportes

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/reports/review/:id` | Reportar reseña | ✅ (turista/oferente) |
| GET | `/api/admin/reports/pending` | Reportes pendientes | ✅ (admin) |
| PUT | `/api/admin/reviews/:id/moderate` | Moderar reseña | ✅ (admin) |
| PUT | `/api/reports/review/:id/resolver` | Resolver reporte | ✅ (admin) |

### Dashboard Admin

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Estadísticas generales | ✅ (admin) |
| GET | `/api/admin/top-oferentes` | Top oferentes mejor calificados | ✅ (admin) |
| GET | `/api/admin/usuarios-activos` | Usuarios más activos | ✅ (admin) |

## 🎨 Características Implementadas

### 1. Visualización de Reseñas
- **Estrellas a color**: Amarillo (#ffc107) para llenas, gris (#ddd) para vacías
- **Título y cuerpo**: Primera línea del comentario como título, resto como cuerpo
- **Fecha formateada**: Formato "día mes año" en español
- **Compra verificada**: Badde verde para reseñas de compras/reservas verificadas
- **Respuestas**: Anidadas debajo de cada reseña

### 2. Formulario de Reseña
- **Calificación interactiva**: Estrellas que se iluminan al pasar el mouse
- **Validación**: Rating (1-5) y comentario requerido
- **Compra verificada**: Campo automático cuando viene de pedido/reserva

### 3. Respuestas de Oferente
- **Permisos**: Solo oferentes dueños del negocio pueden responder
- **Límite**: Una respuesta por reseña
- **Edición**: Permitida solo primeras 48 horas
- **Eliminación**: Solo administrador puede eliminar respuestas
- **Marca de edición**: Muestra "(Editado)" si fue modificada

### 4. Reportes
- **Quiénes reportan**: Turistas y oferentes (cada uno con sus motivos)
- **Motivos disponibles**: ofensivo, spam, falso, otro
- **Flujo**: Reporte → Admin revisa → Acción (ocultar/eliminar/mantener)
- **Historial**: Usuarios pueden ver estado de sus reportes

### 5. Panel de Administración
- **Estadísticas**: Total reseñas, publicadas, ocultas, reportes pendientes
- **Top oferentes**: Ranking por promedio de calificación
- **Usuarios activos**: Ranking por cantidad de reseñas escritas
- **Moderación**: Gestión completa de reportes pendientes

### 6. Estilos y Diseño
- **Fondo oscuro**: `#333` para todas las páginas
- **Tarjetas**: `#2a2a2a` con bordes sutiles
- **Colores acento**:
  - Rosa `#e3008c` para acciones principales
  - Verde `#28a745` para éxito y mantener
  - Rojo `#dc3545` para eliminar
  - Amarillo `#ffc107` para advertencias
- **Responsive**: Adaptación completa a móviles y tablets

### Variables de Entorno
```env
# Microservicios
VITE_API_URL_REVIEWS=http://localhost:5006
VITE_API_URL_AUTH=http://localhost:5001
VITE_API_URL_CATALOG=http://localhost:5002
VITE_API_URL_ORDERS=http://localhost:5003
VITE_API_URL_RESERVATIONS=http://localhost:5004
```

### Rutas Disponibles

| Ruta | Componente | Rol |
|------|------------|-----|
| `/oferente/:id` | `OferenteDetail` | Todos |
| `/perfil/mis-resenas` | `MisResenas` | Turista |
| `/perfil/resenas-negocio` | `ResenasOferente` | Oferente |
| `/admin/dashboard` | `AdminDashboard` | Admin |
| `/admin/moderar-resenas` | `ModerarResenas` | Admin |

## 📊 Estructura de Base de Datos

### Tabla `review`
```sql
CREATE TABLE review (
    id_review INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_oferente INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    titulo VARCHAR(255) NULL,
    comentario TEXT,
    status_review ENUM('publicada', 'oculta', 'eliminada') DEFAULT 'publicada',
    compra_verificada BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_oferente) REFERENCES oferente(id_oferente)
);
```

### Tabla `review_response`
```sql
CREATE TABLE review_response (
    id_review_response INT PRIMARY KEY AUTO_INCREMENT,
    id_review INT NOT NULL,
    id_oferente INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_review) REFERENCES review(id_review) ON DELETE CASCADE,
    FOREIGN KEY (id_oferente) REFERENCES oferente(id_oferente)
);
```

### Tabla `review_report`
```sql
CREATE TABLE review_report (
    id_review_report INT PRIMARY KEY AUTO_INCREMENT,
    id_review INT NOT NULL,
    id_usuario_reporta INT NOT NULL,
    motivo ENUM('ofensivo', 'spam', 'falso') NOT NULL,
    estado_reporte ENUM('pendiente', 'resuelto') DEFAULT 'pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_revision DATETIME,
    FOREIGN KEY (id_review) REFERENCES review(id_review) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_reporta) REFERENCES usuario(id_usuario)
);
```

## 📝 Flujos de Trabajo

### Turista escribe una reseña
1. Navega a `/oferente/:id`
2. Click en "✍️ Escribir reseña"
3. Selecciona calificación (1-5 estrellas)
4. Escribe comentario (primera línea será el título)
5. Click en "Publicar reseña"
6. La reseña aparece en la lista (sin respuesta inicial)

### Oferente responde a una reseña
1. Navega a `/perfil/resenas-negocio`
2. Selecciona el negocio en el dropdown
3. Encuentra la reseña sin respuesta
4. Click en "Responder"
5. Escribe mensaje y click en "Publicar respuesta"
6. La respuesta aparece debajo de la reseña

### Admin modera un reporte
1. Navega a `/admin/moderar-resenas`
2. Revisa los reportes pendientes con sus detalles
3. Decide acción:
   - **Ocultar** 🔒 → Reseña ya no visible
   - **Eliminar** 🗑️ → Eliminación permanente
   - **Mantener** ✅ → Reporte se resuelve, reseña visible
4. El reporte cambia a estado "Resuelto"

### Admin visualiza estadísticas
1. Navega a `/admin/dashboard`
2. Visualiza:
   - Tarjetas con total de reseñas y reportes
   - Top oferentes mejor calificados
   - Usuarios más activos