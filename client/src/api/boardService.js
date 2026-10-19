import apiClient from './apiClient.js';
import { mockBoards } from '../data/mockData.js';

// Memoria local para modo fallback/mock
let localMockBoards = JSON.parse(JSON.stringify(mockBoards));

export const boardService = {
  /**
   * GET /api/boards
   * Obtiene todos los tableros
   */
  async getBoards() {
    try {
      const response = await apiClient.get('/boards');
      return response.data;
    } catch (error) {
      if (!error.response) {
        console.warn('[boardService] Backend no accesible, usando mock data fallback');
        return [...localMockBoards];
      }
      throw error;
    }
  },

  /**
   * GET /api/boards/:boardId
   * Obtiene un tablero por ID con columnas y tickets poblados
   */
  async getBoardById(boardId) {
    try {
      const response = await apiClient.get(`/boards/${boardId}`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        console.warn(`[boardService] Backend no accesible, buscando board ${boardId} en mock data`);
        const found = localMockBoards.find(b => b._id === boardId);
        if (found) return JSON.parse(JSON.stringify(found));
        const err = new Error('Tablero no encontrado');
        err.friendlyMessage = 'Tablero no encontrado';
        err.response = { status: 404 };
        throw err;
      }
      throw error;
    }
  },

  /**
   * POST /api/boards
   * Crea un nuevo tablero
   */
  async createBoard(payload) {
    try {
      const response = await apiClient.post('/boards', payload);
      return response.data;
    } catch (error) {
      if (!error.response) {
        if (!payload.title || !payload.title.trim()) {
          const err = new Error('El título del tablero es obligatorio');
          err.friendlyMessage = 'El título del tablero es obligatorio';
          err.response = { status: 400 };
          throw err;
        }
        const newBoard = {
          _id: '67b' + Date.now().toString(16).padStart(21, '0'),
          title: payload.title.trim(),
          columns: [],
          createdAt: new Date().toISOString()
        };
        localMockBoards.unshift(newBoard);
        return newBoard;
      }
      throw error;
    }
  },

  /**
   * DELETE /api/boards/:boardId
   * Elimina un tablero y su contenido en cascada
   */
  async deleteBoard(boardId) {
    try {
      await apiClient.delete(`/boards/${boardId}`);
      return true;
    } catch (error) {
      if (!error.response) {
        localMockBoards = localMockBoards.filter(b => b._id !== boardId);
        return true;
      }
      throw error;
    }
  }
};

export default boardService;
