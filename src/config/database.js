import dns from 'node:dns';
import mongoose from 'mongoose';

// En Windows, los resolvers de algunos routers rechazan consultas SRV (querySrv ECONNREFUSED).
// Configuramos servidores DNS estándar para garantizar resolución de MongoDB Atlas.
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Fallback estándar
  }
}

let cachedPromise = null;

/**
 * Conecta a MongoDB utilizando la URI configurada en variables de entorno.
 * En entornos serverless reutiliza la conexión activa.
 */
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban';
    cachedPromise = mongoose.connect(uri).catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }

  try {
    const conn = await cachedPromise;
    console.log(`MongoDB conectado exitosamente: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
}

export default connectDB;
