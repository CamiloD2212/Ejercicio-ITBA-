import apiClient from './apiClient.js';

export const columnService = {
  /**
   * POST /api/boards/:boardId/columns
   * Crea una columna dentro de un tablero específico
   */
  async createColumn(boardId, payload) {
    const response = await apiClient.post(`/boards/${boardId}/columns`, payload);
    return response.data;
  },

  /**
   * DELETE /api/boards/:boardId/columns/:columnId
   * Elimina una columna y sus tickets asociados en cascada
   */
  async deleteColumn(boardId, columnId) {
    await apiClient.delete(`/boards/${boardId}/columns/${columnId}`);
    return true;
  }
};

export default columnService;
