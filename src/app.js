import express from 'express';
import boardRoutes from './routes/boardRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/database.js';

const app = express();

// Formatear respuestas JSON con sangría (pretty print) para visualización clara en navegadores
app.set('json spaces', 2);

// Middleware de CORS para permitir consumo desde el frontend alojado en Vercel o local
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Middleware para procesar cuerpos JSON
app.use(express.json());

// Asegurar conexión a base de datos en entornos Serverless (como Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
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
