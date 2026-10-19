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

/**
 * Conecta a MongoDB utilizando la URI configurada en variables de entorno.
 * Reutiliza conexiones activas (esencial para entornos serverless como Vercel).
 */
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB conectado exitosamente: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
}

export default connectDB;
