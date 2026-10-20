import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import boardService from '../api/boardService.js';
import BoardCard from '../features/boards/BoardCard.jsx';
import CreateBoardModal from '../features/boards/CreateBoardModal.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { Plus, LayoutGrid, RefreshCw, AlertTriangle } from 'lucide-react';

export function BoardsListPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingBoardId, setDeletingBoardId] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (err) {
      const msg = err.friendlyMessage || 'No se pudieron cargar los tableros';
      setError(msg);
      addToast({
        type: 'error',
        title: 'Error de conexión',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async ({ title }) => {
    // La mutación se ejecuta primero en la API
    const newBoard = await boardService.createBoard({ title });
    addToast({
      type: 'success',
      title: 'Tablero creado',
      message: `"${newBoard.title}" fue creado exitosamente`
    });
    // Navegación programática estricta únicamente tras mutación exitosa
    navigate(`/boards/${newBoard._id}`);
  };

  const handleDeleteBoard = async (boardId, boardTitle) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el tablero "${boardTitle}"?\nEsta acción eliminará en cascada todas sus columnas y tickets asociados.`
    );
    if (!confirmed) return;

    try {
      setDeletingBoardId(boardId);
      await boardService.deleteBoard(boardId);
      setBoards(prev => prev.filter(b => b._id !== boardId));
      addToast({
        type: 'success',
        title: 'Tablero eliminado',
        message: `El tablero "${boardTitle}" y sus recursos en cascada fueron eliminados`
      });
    } catch (err) {
      const msg = err.friendlyMessage || 'Error al eliminar el tablero';
      addToast({
        type: 'error',
        title: 'Error de borrado',
        message: msg
      });
    } finally {
      setDeletingBoardId(null);
    }
  };

  return (
    <div className="container">
      {/* Top action bar */}
      <div className="responsive-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            Tableros Kanban
          </h1>
          <p style={{ fontSize: '0.9375rem' }}>
            Selecciona un espacio de trabajo o crea un nuevo tablero de proyecto
          </p>
        </div>

        <div className="responsive-header-actions">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={fetchBoards}
            isLoading={loading}
            title="Refrescar lista"
          >
            Actualizar
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            Nuevo Tablero
          </Button>
        </div>
      </div>

      {/* States: Loading, Error, Empty, Data */}
      {loading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '280px',
            gap: '1rem'
          }}
        >
          <Spinner size={32} color="var(--accent-cyan)" />
          <p style={{ color: 'var(--text-secondary)' }}>Cargando tableros...</p>
        </div>
      )}

      {!loading && error && (
        <div
          className="saas-card"
          style={{
            padding: '2rem',
            textAlign: 'center',
            borderColor: 'var(--status-danger-subtle)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <AlertTriangle size={36} style={{ color: 'var(--status-danger)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Error al obtener tableros</h3>
          <p style={{ marginBottom: '1.25rem' }}>{error}</p>
          <Button variant="primary" onClick={fetchBoards}>
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && boards.length === 0 && (
        <div
          className="saas-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderStyle: 'dashed'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--accent-cyan-subtle)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <LayoutGrid size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No tienes tableros creados</h3>
          <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Comienza creando tu primer tablero de proyecto para organizar tus tareas en columnas jerárquicas.
          </p>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            Crear mi primer tablero
          </Button>
        </div>
      )}

      {!loading && !error && boards.length > 0 && (
        <div className="boards-grid">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onDelete={handleDeleteBoard}
              isDeleting={deletingBoardId === board._id}
            />
          ))}
        </div>
      )}

      {/* Modal para nuevo tablero */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
}

export default BoardsListPage;
