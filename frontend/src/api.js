import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
});

export function apiMessage(error, fallback = 'No se pudo completar la solicitud.') {
  if (!error?.response) return 'No hay conexión con el servidor. Revisa la URL de la API e inténtalo de nuevo.';
  return error.response.data?.error || fallback;
}

export const boardApi = {
  get: (id) => api.get(`/boards/${id}`).then((r) => r.data),
  create: (data) => api.post('/boards', data).then((r) => r.data),
  remove: (id) => api.delete(`/boards/${id}`),
  addColumn: (id, data) => api.post(`/boards/${id}/columns`, data).then((r) => r.data),
  removeColumn: (id, columnId) => api.delete(`/boards/${id}/columns/${columnId}`),
  addTicket: (id, columnId, data) => api.post(`/boards/${id}/columns/${columnId}/tickets`, data).then((r) => r.data),
  updateTicket: (id, columnId, ticketId, data) => api.patch(`/boards/${id}/columns/${columnId}/tickets/${ticketId}`, data).then((r) => r.data),
  removeTicket: (id, columnId, ticketId) => api.delete(`/boards/${id}/columns/${columnId}/tickets/${ticketId}`),
};
