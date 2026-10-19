import app from '../src/app.js';
import connectDB from '../src/config/database.js';

/**
 * Serverless Handler para Vercel
 * Enruta las peticiones de /api/(.*) hacia la aplicación Express y conecta a MongoDB Atlas
 */
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Error en serverless handler:', error);
    return res.status(500).json({ error: 'Error de conexión a la base de datos en Vercel' });
  }
}
