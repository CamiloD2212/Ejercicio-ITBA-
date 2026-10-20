import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import boardService from '../api/boardService.js';
import columnService from '../api/columnService.js';
import ticketService from '../api/ticketService.js';
import ColumnCard from '../features/columns/ColumnCard.jsx';
import CreateColumnModal from '../features/columns/CreateColumnModal.jsx';
import CreateTicketModal from '../features/tickets/CreateTicketModal.jsx';
import EditTicketModal from '../features/tickets/EditTicketModal.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { Plus, ArrowLeft, RefreshCw, AlertTriangle, Layers } from 'lucide-react';

export function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [activeColumnForTicket, setActiveColumnForTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);

  // Estado de actualización optimista en vuelo
  const [movingTicketId, setMovingTicketId] = useState(null);

  /**
   * Cargar tablero con columnas y tickets poblados
   */
  const fetchBoard = useCallback(async () => {
    if (!boardId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoardById(boardId);
      setBoard(data);
    } catch (err) {
      const msg = err.friendlyMessage || 'No se pudo cargar el tablero';
      setError(msg);
      addToast({
        type: 'error',
        title: 'Error al cargar',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  }, [boardId, addToast]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  /**
   * Crear Columna en el tablero actual: POST /api/boards/:boardId/columns
   */
  const handleCreateColumn = async ({ title }) => {
    const newCol = await columnService.createColumn(boardId, { title });
    // Inicializar tickets como array vacío para renderizado
    newCol.tickets = [];
    setBoard(prev => ({
      ...prev,
      columns: [...(prev.columns || []), newCol]
    }));
    addToast({
      type: 'success',
      title: 'Columna creada',
      message: `"${newCol.title}" fue agregada al tablero`
    });
  };

  /**
   * Eliminar Columna: DELETE /api/boards/:boardId/columns/:columnId
   */
  const handleDeleteColumn = async (columnId) => {
    const targetCol = board?.columns?.find(c => c._id === columnId);
    const confirmed = window.confirm(
      `¿Deseas eliminar la columna "${targetCol?.title || ''}"?\nSe eliminarán todos sus tickets en cascada.`
    );
    if (!confirmed) return;

    try {
      await columnService.deleteColumn(boardId, columnId);
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.filter(c => c._id !== columnId)
      }));
      addToast({
        type: 'success',
        title: 'Columna eliminada',
        message: 'La columna y sus tickets fueron eliminados en cascada'
      });
    } catch (err) {
      const msg = err.friendlyMessage || 'Error al eliminar la columna';
      addToast({
        type: 'error',
        title: 'Error de borrado',
        message: msg
      });
    }
  };

  /**
   * Crear Ticket en columna: POST /api/boards/:boardId/columns/:columnId/tickets
   */
  const handleCreateTicket = async ({ title, description }) => {
    if (!activeColumnForTicket) return;
    const colId = activeColumnForTicket._id;

    const newTicket = await ticketService.createTicket(boardId, colId, {
      title,
      description
    });

    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col._id === colId) {
          return {
            ...col,
            tickets: [...(col.tickets || []), newTicket]
          };
        }
        return col;
      })
    }));

    addToast({
      type: 'success',
      title: 'Ticket creado',
      message: `"${newTicket.title}" agregado a ${activeColumnForTicket.title}`
    });
  };

  /**
   * Eliminar Ticket: DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   */
  const handleDeleteTicket = async (ticketId) => {
    // Buscar la columna del ticket
    let sourceColId = null;
    let ticketTitle = '';
    for (const col of (board?.columns || [])) {
      const found = col.tickets?.find(t => t._id === ticketId);
      if (found) {
        sourceColId = col._id;
        ticketTitle = found.title;
        break;
      }
    }

    if (!sourceColId) return;

    const confirmed = window.confirm(`¿Eliminar la tarea "${ticketTitle}"?`);
    if (!confirmed) return;

    try {
      await ticketService.deleteTicket(boardId, sourceColId, ticketId);
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col => {
          if (col._id === sourceColId) {
            return {
              ...col,
              tickets: col.tickets.filter(t => t._id !== ticketId)
            };
          }
          return col;
        })
      }));
      addToast({
        type: 'success',
        title: 'Ticket eliminado',
        message: 'La tarea fue eliminada satisfactoriamente'
      });
    } catch (err) {
      const msg = err.friendlyMessage || 'Error al eliminar el ticket';
      addToast({
        type: 'error',
        title: 'Error de borrado',
        message: msg
      });
    }
  };

  /**
   * Editar Ticket: PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   */
  const handleEditTicket = async ({ title, description, columnId: targetColumnId }) => {
    if (!editingTicket) return;

    const currentColumnId = editingTicket.column;
    const ticketId = editingTicket._id;

    const payload = {
      title,
      description,
      ...(targetColumnId && targetColumnId !== currentColumnId ? { targetColumnId } : {})
    };

    const updated = await ticketService.updateTicket(
      boardId,
      currentColumnId,
      ticketId,
      payload
    );

    setBoard(prev => {
      const destinationColId = targetColumnId || currentColumnId;
      return {
        ...prev,
        columns: prev.columns.map(col => {
          // Si cambió de columna
          if (targetColumnId && targetColumnId !== currentColumnId) {
            if (col._id === currentColumnId) {
              return {
                ...col,
                tickets: col.tickets.filter(t => t._id !== ticketId)
              };
            }
            if (col._id === destinationColId) {
              return {
                ...col,
                tickets: [...(col.tickets || []), updated]
              };
            }
            return col;
          }

          // Si permaneció en la misma columna
          if (col._id === currentColumnId) {
            return {
              ...col,
              tickets: col.tickets.map(t => (t._id === ticketId ? updated : t))
            };
          }
          return col;
        })
      };
    });

    addToast({
      type: 'success',
      title: 'Ticket actualizado',
      message: 'Los cambios fueron guardados exitosamente'
    });
  };

  /**
   * CONTROL DE CONCURRENCIA VISUAL Y SINCRONIZACIÓN (OPTIMISTIC UI)
   * Especificación estricta de la consigna:
   * "Al mover un ticket de columna, aplica actualización optimista en el estado local.
   * Si el backend responde con un error (400 o 404), revierte el ticket a su columna original
   * y despliega un mensaje emergente (Toast) notificando el fallo."
   */
  const handleMoveTicket = async (ticket, targetColumnId) => {
    if (!ticket || !targetColumnId || ticket.column === targetColumnId) {
      return;
    }

    const sourceColumnId = ticket.column;
    const ticketId = ticket._id;

    // Snapshot para rollback en caso de fallo
    const previousBoardState = JSON.parse(JSON.stringify(board));

    // 1. ACTUALIZACIÓN OPTIMISTA INMEDIATA (60 fps)
    setMovingTicketId(ticketId);
    setBoard(prev => {
      let movedTicketObj = null;

      // Extraer de columna de origen
      const nextColumns = prev.columns.map(col => {
        if (col._id === sourceColumnId) {
          const remainingTickets = [];
          for (const t of (col.tickets || [])) {
            if (t._id === ticketId) {
              movedTicketObj = { ...t, column: targetColumnId };
            } else {
              remainingTickets.push(t);
            }
          }
          return { ...col, tickets: remainingTickets };
        }
        return col;
      });

      // Insertar en columna de destino
      if (movedTicketObj) {
        return {
          ...prev,
          columns: nextColumns.map(col => {
            if (col._id === targetColumnId) {
              return {
                ...col,
                tickets: [...(col.tickets || []), movedTicketObj]
              };
            }
            return col;
          })
        };
      }

      return prev;
    });

    // 2. PETICIÓN PATCH AL BACKEND
    try {
      await ticketService.updateTicket(
        boardId,
        sourceColumnId,
        ticketId,
        { targetColumnId }
      );
      // Éxito: el estado optimista ya es el definitivo
    } catch (err) {
      // 3. ROLLBACK INMEDIATO EN CASO DE ERROR
      console.error('[Optimistic UI Rollback] Error en PATCH:', err);
      setBoard(previousBoardState);

      const errorMessage =
        err.friendlyMessage ||
        err.response?.data?.error ||
        'Error al sincronizar el movimiento del ticket con el servidor';

      // 4. DESPLIEGUE DE TOAST NOTIFICANDO EL FALLO
      addToast({
        type: 'error',
        title: 'Error de sincronización (Optimistic Rollback)',
        message: errorMessage
      });
    } finally {
      setMovingTicketId(null);
    }
  };

  const totalTickets = (board?.columns || []).reduce(
    (acc, col) => acc + (col.tickets ? col.tickets.length : 0),
    0
  );

  return (
    <div className="container" style={{ maxWidth: '1600px' }}>
      {/* Top Header */}
      <div className="responsive-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/boards')}
            className="btn btn-secondary btn-sm"
            title="Volver a la lista de tableros"
          >
            <ArrowLeft size={16} />
            <span>Tableros</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.625rem', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
                {board ? board.title : 'Cargando tablero...'}
              </h1>
              {board && (
                <span className="badge badge-purple">
                  {totalTickets} {totalTickets === 1 ? 'tarea' : 'tareas'}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.2rem' }}>
              Arrastra las tarjetas o usa los selectores para mover tareas entre columnas
            </p>
          </div>
        </div>

        <div className="responsive-header-actions">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={fetchBoard}
            isLoading={loading}
            title="Refrescar tablero"
          >
            Refrescar
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsColumnModalOpen(true)}
            disabled={!board}
          >
            Nueva Columna
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            gap: '1rem'
          }}
        >
          <Spinner size={34} color="var(--accent-cyan)" />
          <p>Cargando jerarquía del tablero...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          className="saas-card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '540px',
            margin: '2rem auto'
          }}
        >
          <AlertTriangle size={40} style={{ color: 'var(--status-danger)', margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No se pudo cargar el tablero</h3>
          <p style={{ marginBottom: '1.5rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => navigate('/boards')}>
              Volver a tableros
            </Button>
            <Button variant="primary" onClick={fetchBoard}>
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Empty columns state */}
      {!loading && !error && (!board?.columns || board.columns.length === 0) && (
        <div
          className="saas-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderStyle: 'dashed'
          }}
        >
          <Layers size={36} style={{ color: 'var(--accent-purple)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Este tablero no tiene columnas</h3>
          <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Crea columnas como "Por Hacer", "En Proceso" o "Completado" para empezar a organizar tickets.
          </p>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsColumnModalOpen(true)}
          >
            Crear primera columna
          </Button>
        </div>
      )}

      {/* Kanban Board Columns Horizontal Layout */}
      {!loading && !error && board?.columns && board.columns.length > 0 && (
        <div className="kanban-board-container">
          {board.columns.map((column) => (
            <ColumnCard
              key={column._id}
              column={column}
              columns={board.columns}
              onDeleteColumn={handleDeleteColumn}
              onOpenCreateTicket={(col) => setActiveColumnForTicket(col)}
              onDeleteTicket={handleDeleteTicket}
              onEditTicket={(t) => setEditingTicket(t)}
              onMoveTicket={handleMoveTicket}
              movingTicketId={movingTicketId}
            />
          ))}

          {/* Quick Add Column ghost placeholder */}
          <button
            type="button"
            onClick={() => setIsColumnModalOpen(true)}
            className="btn btn-secondary"
            style={{
              flex: '0 0 min(260px, 75vw)',
              height: '80px',
              borderStyle: 'dashed',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              scrollSnapAlign: 'center'
            }}
          >
            <Plus size={18} />
            <span>Agregar Columna</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onSubmit={handleCreateColumn}
      />

      <CreateTicketModal
        isOpen={!!activeColumnForTicket}
        onClose={() => setActiveColumnForTicket(null)}
        columnTitle={activeColumnForTicket?.title}
        onSubmit={handleCreateTicket}
      />

      <EditTicketModal
        isOpen={!!editingTicket}
        onClose={() => setEditingTicket(null)}
        ticket={editingTicket}
        columns={board?.columns || []}
        onSubmit={handleEditTicket}
      />
    </div>
  );
}

export default BoardDetailPage;
