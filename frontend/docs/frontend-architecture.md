# Arquitectura del frontend

## Alcance y decisiones

La aplicación vive en `frontend/` para no mezclar dependencias ni scripts con el backend Express existente. Está construida con React, Vite, React Router, Axios, React Hook Form y Zod. La portada crea tableros y ofrece entrada por ID; no se simula autenticación ni persistencia local de datos.

La API no expone un listado de tableros. Por eso no existe una pantalla de lista que invente `GET /api/boards`: se crea uno con `POST /api/boards` o se abre con el ID mediante `GET /api/boards/:boardId`. El backend tampoco define autenticación.

## Contrato consumido

La URL base se define exclusivamente con `VITE_API_URL`, incluyendo `/api`. En desarrollo, Axios llama a `/api` en el mismo origen y Vite proxya esas solicitudes al host configurado; esto permite trabajar localmente incluso si el backend no habilita CORS para localhost. En producción, Axios usa directamente `VITE_API_URL`, así que el backend debe permitir el origen público del frontend mediante CORS. `src/api.js` centraliza Axios, operaciones por recurso y mensajes de error. Según el backend del repositorio, se usan:

- `POST /boards` y `GET /boards/:boardId`.
- `DELETE /boards/:boardId` está disponible en el servidor, aunque la interfaz no ofrece esa acción porque elimina en cascada.
- `POST /boards/:boardId/columns` y `DELETE /boards/:boardId/columns/:columnId`.
- `POST /boards/:boardId/columns/:columnId/tickets`, `PATCH /boards/:boardId/columns/:columnId/tickets/:ticketId` y `DELETE` en esa misma ruta.

El `PATCH` admite `columnId` como destino y devuelve el ticket actualizado. El movimiento es optimista y restaura el tablero anterior si falla. Las eliminaciones de columna y ticket respetan respuestas `204` sin intentar leer un cuerpo.

Las respuestas de error del backend tienen `{ "error": "…" }`; los errores sin respuesta HTTP se presentan como problemas de conexión. No se reintentan mutaciones automáticamente. Las eliminaciones de columnas y tickets piden confirmación por sus efectos destructivos.

## Organización

- `src/api.js`: cliente HTTP, normalización visible de errores y operaciones API.
- `src/App.jsx`: rutas, composición de páginas, coordinación de datos y mutaciones, formularios y tema.
- `src/styles.css`: tokens visuales, componentes y reglas responsive.
- `index.html`: tema inicial antes del render para reducir el parpadeo.

El tema prioriza `localStorage` cuando el usuario elige uno; mientras no haya elección, sigue `prefers-color-scheme`. Los tokens semánticos de superficie, texto, borde, acento, foco, éxito, advertencia y error se definen en `styles.css`. El tema oscuro elimina sombras.

Los formularios validan únicamente que el título no esté vacío, condición confirmada por el backend. La descripción del ticket es opcional. El diseño permite scroll horizontal dentro de las columnas y respeta movimiento reducido y foco visible.

## Límites operativos

No se añaden mocks ni datos sintéticos al flujo de API. Para ejecutar contra el backend local, usa `VITE_API_URL=http://localhost:4000/api`; para producción, configura la URL desplegada en el entorno de build del frontend y habilita CORS para el origen publicado. El `.env` local apunta a `https://kanban-api-s297.onrender.com/api`; ese archivo está excluido de Git.
