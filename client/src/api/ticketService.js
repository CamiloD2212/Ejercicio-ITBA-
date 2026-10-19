import apiClient from './apiClient.js';

export const ticketService = {
  /**
   * POST /api/boards/:boardId/columns/:columnId/tickets
   * Crea un ticket dentro de una columna específica
   */
  async createTicket(boardId, columnId, payload) {
    const response = await apiClient.post(
      `/boards/${boardId}/columns/${columnId}/tickets`,
      payload
    );
    return response.data;
  },

  /**
   * PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   * Actualiza el contenido de un ticket y/o lo mueve de columna.
   * Idempotente.
   */
  async updateTicket(boardId, columnId, ticketId, payload) {
    const response = await apiClient.patch(
      `/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`,
      payload
    );
    return response.data;
  },

  /**
   * DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   * Elimina un ticket individual
   */
  async deleteTicket(boardId, columnId, ticketId) {
    await apiClient.delete(
      `/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`
    );
    return true;
  }
};

export default ticketService;
