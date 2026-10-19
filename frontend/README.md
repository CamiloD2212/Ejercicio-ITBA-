# DevBoard Frontend

SPA React para crear tableros y trabajar con columnas y tickets contra la API REST de este proyecto. La interfaz no incluye sesión simulada ni lista tableros desde una ruta inexistente: permite crear un tablero o abrir uno existente mediante su ID.

## Requisitos y ejecución

- Node.js 20.19 o superior y npm.
- Desde `frontend/`:

```bash
npm install
cp .env.example .env
npm run dev
```

Configura `VITE_API_URL` con la URL pública del backend desplegado más el prefijo `/api`, por ejemplo `https://tu-api.example.com/api`. El valor local de `.env.example` apunta a `http://localhost:4000/api`. La API debe permitir el origen del frontend mediante CORS.

Para una compilación de producción, ejecuta `npm run build`; `npm run preview` sirve el resultado localmente. No hay credenciales en la configuración de ejemplo.

## Uso

En la portada se puede crear un tablero nuevo o abrir uno existente con su identificador. Desde el tablero se pueden crear y borrar columnas y tickets, y mover tickets con el selector accesible o arrastrándolos entre columnas. Los errores de la API se muestran en la interfaz.

Consulta [docs/frontend-architecture.md](docs/frontend-architecture.md) para el contrato y los límites conocidos.
