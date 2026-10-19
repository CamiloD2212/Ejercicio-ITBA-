import axios from 'axios';

// Consumir estrictamente desde import.meta.env.VITE_API_URL según la especificación
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor para estandarizar el mensaje de error devuelto por la API
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la API respondió con formato JSON { error: "mensaje" }
    const serverMessage = error.response?.data?.error;
    if (serverMessage) {
      error.friendlyMessage = serverMessage;
    } else if (error.code === 'ECONNABORTED') {
      error.friendlyMessage = 'Tiempo de espera agotado al conectar con el servidor';
    } else if (!error.response) {
      error.friendlyMessage = 'No se pudo conectar con el servidor backend';
    } else {
      error.friendlyMessage = `Error ${error.response.status}: ${error.response.statusText || 'Error inesperado'}`;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
