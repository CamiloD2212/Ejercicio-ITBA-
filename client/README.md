# DevBoard — Frontend Kanban (Modern SaaS)

Cliente Single Page Application (SPA) para la gestión ágil de tableros Kanban, desarrollado bajo la metodología **Desarrollo Basado en Especificaciones (SDD)** y alineado con los requerimientos estipulados en [`agents.md`](../agents.md).

---

## 1. Stack Tecnológico y Librerías

- **Framework**: [React 18+](https://react.dev/) (Functional Components, Hooks nativos).
- **Herramienta de Construcción / Bundler**: [Vite 6+](https://vitejs.dev/) para recarga instantánea en desarrollo (HMR) y empaquetado optimizado para producción.
- **Enrutamiento**: [React Router DOM v6+](https://reactrouter.com/) con estructura de rutas públicas, protegidas y redirección por defecto.
- **Cliente HTTP**: [Axios](https://axios-http.com/) con instancia centralizada e interceptores para normalización de errores y soporte de fallback.
- **Estilos y Diseño**: **Vanilla CSS Moderno** estructurado a través de **CSS Custom Properties (Tokens)**. No depende de clases utilitarias rígidas ni frameworks CSS pesados, otorgando total fidelidad a la especificación *Modern SaaS*.
- **Iconografía**: [Lucide React](https://lucide.dev/) para iconos vectoriales limpios y accesibles.

---

## 2. Decisiones de Arquitectura y Patrón de Componentes

Siguiendo las directrices de SDD para la capa de usuario, se implementó una **separación estricta de responsabilidades**:

```text
client/src/
├── api/                  # Capa de Servicio API (Axios desacoplado)
│   ├── apiClient.js      # Instancia base con interceptores
│   ├── boardService.js   # Integración /api/boards
│   ├── columnService.js  # Integración /api/boards/:boardId/columns
│   └── ticketService.js  # Integración /api/boards/:boardId/columns/:columnId/tickets
├── components/           # Componentes de UI comunes y estructura
│   ├── ui/               # Componentes atómicos (Button, Input, Modal, Toast, Spinner, ThemeToggle)
│   └── layout/           # Estructura visual común (Navbar, Layout)
├── features/             # Módulos por dominio de negocio
│   ├── boards/           # BoardCard, CreateBoardModal
│   ├── columns/          # ColumnCard, CreateColumnModal
│   └── tickets/          # TicketCard, CreateTicketModal, EditTicketModal
├── hooks/                # Custom hooks reutilizables (useTheme, useAuth, useToast)
├── pages/                # Vistas / Contenedores (Smart Components)
│   ├── LoginPage.jsx     # Acceso público
│   ├── BoardsListPage.jsx# Listado y creación de tableros
│   ├── BoardDetailPage.jsx # Vista principal Kanban y sincronización optimista
│   └── NotFoundPage.jsx  # Vista 404 amigable
├── routes/               # Configuración de rutas y guardas de navegación
│   ├── AppRouter.jsx     # Definición de la matriz de rutas
│   └── ProtectedRoute.jsx# Guarda de protección de rutas privadas
├── data/                 # Datos sintéticos para mocking y testing independiente
│   └── mockData.js
├── styles/               # Sistema de diseño con tokens CSS
│   ├── tokens.css        # Variables globales para Light/Dark mode
│   └── index.css         # Estilos base, animaciones y clases atómicas
├── App.jsx               # Composición de Providers de contexto y enrutador
└── main.jsx              # Punto de entrada de React en el DOM
```

### Componentes Presentacionales vs. Contenedores
- **Componentes Presentacionales (Dumb)**:
  - `TicketCard`, `ColumnCard`, `BoardCard`, `Button`, `Modal`, `Input`.
  - Reciben información exclusivamente por `props` y emiten eventos mediante callbacks (`onDelete`, `onMove`, `onEdit`).
  - No ejecutan `useEffect` para llamadas de red ni conocen la capa de API.
- **Páginas / Contenedores (Smart)**:
  - `BoardDetailPage`, `BoardsListPage`, `LoginPage`.
  - Gestionan el ciclo de vida, estados de carga (`loading`), error (`error`) y datos (`data`).
  - Orquestan las llamadas asíncronas a los servicios y distribuyen los datos a los componentes presentacionales.

---

## 3. Estilo Visual: "Modern SaaS" (Vibrante y Accesible)

La interfaz adopta la estética **Modern SaaS**, inspirada en suites de productividad contemporáneas (Linear, Notion, Asana):

### Tokens de Color y Temas
- **Light Mode**:
  - Fondo general: `#FAFAFA`
  - Tarjetas / Contenedores: `#FFFFFF` con sombras suaves difuminadas (`box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.03)`).
  - Texto principal: `#2D3748`.
  - Acentos llamativos (CTA): `#00B8D9` (Cian vibrante) y `#6554C0` (Púrpura moderno).
  - Bordes sutiles: `#E2E8F0`.
- **Dark Mode**:
  - Fondo general: `#121212`.
  - Tarjetas / Contenedores: `#1E1E1E` delimitadas por bordes sutiles `#333333` (sin sombras pesadas).
  - Texto principal: `#E0E0E0`.
  - Acentos llamativos: `#33E1ED` (Cian neón) y `#9F8DF1` (Púrpura claro).
  - Bordes: `#333333`.

### Arquitectura del Switch Light/Dark
1. **Sin Colores "Hardcodeados"**: Se prohíben colores hexadecimales dispersos en los componentes; todo el CSS se basa en variables `var(--bg-primary)`, `var(--text-primary)`, `var(--accent-cyan)`, etc.
2. **Detección de Preferencia del Sistema**: Al cargar por primera vez, la aplicación evalúa `@media (prefers-color-scheme: dark)` y activa el tema del sistema operativo si no existe una selección guardada.
3. **Persistencia y Prevención de FOUC**: La preferencia del usuario se almacena en `localStorage` con la clave `'kanban-theme'` y se inyecta la clase `.dark` en la etiqueta `<html>` de manera sincrónica al inicio de `index.html` para evitar parpadeos de estilo al recargar.

---

## 4. Matriz de Rutas y Límites Negativos (React Router)

| Ruta | Componente | Acceso | Descripción / Requerimiento |
|---|---|---|---|
| `/login` | `LoginPage` | Público | Formulario de autenticación con feedback de validación y demo session |
| `/boards` | `BoardsListPage` | Protegido | Lista de tableros del usuario con opción de creación y eliminación |
| `/boards/:boardId` | `BoardDetailPage` | Protegido | Vista interactiva Kanban con jerarquía Board -> Column -> Ticket |
| `*` | `NotFoundPage` | Público | Vista 404 amigable con redirección |

### Límite Negativo Estricto
- **No se utilizan componentes `<Link>` para acciones de mutación** (crear, borrar o mover tickets/columnas).
- Toda mutación ejecuta primero la petición asíncrona hacia la API.
- Tras la confirmación exitosa de la mutación, se utiliza **navegación programática (`useNavigate`)** o actualización reactiva del estado.

---

## 5. Control de Concurrencia Visual y Sincronización (Optimistic UI)

En `BoardDetailPage`, el movimiento de tickets entre columnas (vía Drag & Drop nativo HTML5 o selector rápido de columnas) implementa **Actualización Optimista**:

```text
Usuario arrastra ticket a otra columna
         ↓
1. Actualización Optimista inmediata en el estado local de React (60 fps)
         ↓
2. Envío de petición PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
         ↓
    ┌────┴──────────────────────────┐
    ↓                               ↓
[200 OK]                  [400 / 404 / Error de red]
Confirmar estado          Revertir ticket a su columna original (Rollback)
                          y desplegar mensaje emergente (Toast) con el error
```

---

## 6. Formularios y Feedback de Usuario (UX)

- **Validación en Cliente y Servidor**: Las validaciones obligatorias se chequean en cliente (título no vacío) y los errores del servidor (ej. `400 Bad Request`) se mapean directamente a alertas visuales destacadas en los inputs correspondientes del formulario sin recargar la página.
- **Protección contra Doble Envío**: Todo formulario que realiza `POST`, `PATCH` o `DELETE` deshabilita el botón de acción (`disabled={isSubmitting}`) y muestra un `spinner` animado mientras la petición HTTP está en curso.

---

## 7. Workflow de Desarrollo y Desacoplamiento (Mocking)

- **Mock Data (`src/data/mockData.js`)**: Incluye tableros, columnas y tickets sintéticos completos basados exactamente en la especificación del backend.
- **Resiliencia de Conexión**: Si el backend local no está corriendo en ese momento, la capa de servicio utiliza transparentemente el mock data como respaldo, permitiendo evaluar la UI y el flujo completo sin requerir una instancia activa de MongoDB.
- **Variables de Entorno**: El endpoint base se define en `.env` mediante `VITE_API_URL`.

---

## 8. Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# Compilar para producción (validación de tipos y bundle)
npm run build

# Previsualizar el bundle de producción
npm run preview
```
