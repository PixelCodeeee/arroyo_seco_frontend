# Arroyo Seco Frontend - Progressive Web App (PWA)

This is a test of github actions for the backend repository.

Este repositorio contiene la implementación del **Frontend (Fase 2)** del proyecto Arroyo Seco. Es una **Progressive Web App (PWA)** construida con **React** y **Vite**, diseñada para interactuar con la nueva arquitectura de microservicios del backend.

## 🏗️ Arquitectura y Tecnologías

El frontend está diseñado como una aplicación de página única (SPA) moderna y responsiva:

- **Core**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Estado**: React Context API + Hooks dedicados
- **PWA**: Service Workers para soporte offline e instalación.
- **Estilos**: CSS Modules / Styled Components (según implementación).

### Estructura del Proyecto

- `src/components`: Componentes reutilizables de UI.
- `src/pages`: Vistas principales de la aplicación (Login, Oferentes, Pedidos, etc.).
- `src/services`: Capa de abstracción de API (`api.js`) para comunicación con el Gateway.
- `src/context`: Gestión de estado global (AuthContext, ThemeContext, etc.).
- `src/hooks`: Hooks personalizados.

## 🚀 Pipeline de CI/CD y Modelo de Ramificación

### 3.1 Modelo de Ramas (GitFlow Adaptado)

La estrategia adoptada es **GitFlow adaptado**, alineada con el backend.

#### Estructura de ramas

| Rama | Nomenclatura | Propósito |
| :--- | :--- | :--- |
| **main** | `main` | Producción. Solo versiones estables y aprobadas. |
| **develop** | `develop` | Integración continua. Base del pipeline. |
| **feature** | `feature/HU-<id>-<descripcion>` | Nueva funcionalidad. Vida máxima: 1 sprint. |
| **hotfix** | `hotfix/BUG-<id>-<descripcion>` | Corrección urgente directa desde main. |
| **release** | `release/v<X.Y>` | Preparación de entrega por fase. |

#### Reglas de protección

- **main**: 2 revisores obligatorios + pipeline verde.
- **develop**: 1 revisor + pipeline verde.
- **Push directo bloqueado** en ambas ramas.

### 3.2 Trigger — ¿Qué Dispara el Pipeline?

El pipeline se activa automáticamente por eventos en GitHub. Herramienta: **GitHub Actions**.

| Evento | Rama | Pipeline activado |
| :--- | :--- | :--- |
| `git push` | `feature/*` | Lint + unit tests rápidos (< 5 min) |
| Apertura de PR | `develop` | Pipeline CI completo |
| Merge aprobado | `develop` | CI completo + deploy a staging |
| Merge aprobado | `main` | CD completo + deploy Canary (10%) |
| `git push` | `hotfix/*` | Tests críticos fast-track (< 3 min) |

### 3.3 Pasos del Pipeline

Si cualquier step falla, el pipeline se detiene, notifica al desarrollador y activa rollback en stages de despliegue.

| # | Stage | Herramienta | Criterio de éxito |
| :--- | :--- | :--- | :--- |
| 1 | **Checkout** | GitHub Actions / Git | Repo disponible y limpio |
| 2 | **Code Quality** | ESLint + SonarCloud | 0 errores, Quality Gate A |
| 3 | **Build** | npm + Vite Build | Build de producción generado en `dist/` |
| 4 | **Test Unitario** | Jest / Vitest + React Testing Library | Cobertura ≥ 70% |
| 5 | **Test E2E** | Cypress / Playwright | Flujos críticos (Login, Checkout) al 100% |
| 6 | **Security Scan** | npm audit | 0 vulnerabilidades críticas |
| 7 | **Deploy Staging** | Vercel / Netlify / S3 | Staging accesible y respondiendo |
| 8 | **Canary 10%** | (Opcional en frontend) | - |
| 9 | **Deploy 100%** | Vercel / Netlify / S3 | Producción estable |

---

## 🛠️ Configuración Local

1. Instalar dependencias:

    ```bash
    npm install
    ```

2. Configurar variables de entorno:
    Crea un archivo `.env` basado en `.env.example`.

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

3. Iniciar servidor de desarrollo:

    ```bash
    npm run dev
    ```
