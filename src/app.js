import express from 'express';
import boardRoutes from './routes/boardRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Formatear respuestas JSON con sangría (pretty print) para visualización clara en navegadores
app.set('json spaces', 2);

// Middleware para procesar cuerpos JSON
app.use(express.json());

// Soporte CORS para conectar con el frontend SPA
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Montaje de rutas de la API
app.use('/api/boards', boardRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
