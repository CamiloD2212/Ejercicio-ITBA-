import React, { useState } from 'react';
import TicketCard from '../tickets/TicketCard.jsx';
import { Plus, Trash2, Layers } from 'lucide-react';

/**
 * Componente Presentacional de Columna Kanban
 */
export function ColumnCard({
  column,
  columns = [],
  onDeleteColumn,
  onOpenCreateTicket,
  onDeleteTicket,
  onEditTicket,
  onMoveTicket,
  movingTicketId = null
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const tickets = column.tickets || [];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.ticketId && data.sourceColumnId !== column._id) {
        onMoveTicket({ _id: data.ticketId, column: data.sourceColumnId }, column._id);
      }
    } catch (err) {
      console.error('Error al parsear drop data:', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: '0 0 320px',
        maxWidth: '340px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: isDragOver
          ? '2px dashed var(--accent-cyan)'
          : '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 220px)',
        transition: 'border-color var(--transition-fast), background-color var(--transition-fast)'
      }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}
          >
            {column.title}
          </h3>
          <span className="badge badge-cyan">
            {tickets.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => onOpenCreateTicket(column)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.25rem', color: 'var(--accent-cyan)' }}
            title="Crear ticket en esta columna"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDeleteColumn(column._id)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.25rem', color: 'var(--text-muted)' }}
            title="Eliminar columna"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Column Tickets Container */}
      <div
        style={{
          padding: '0.75rem',
          overflowY: 'auto',
          flex: 1
        }}
      >
        {tickets.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              fontSize: '0.8125rem'
            }}
          >
            <Layers size={22} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Sin tareas en esta columna</p>
            <button
              type="button"
              onClick={() => onOpenCreateTicket(column)}
              className="btn btn-ghost btn-sm"
              style={{ marginTop: '0.5rem', color: 'var(--accent-cyan)' }}
            >
              + Agregar primera tarea
            </button>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              columns={columns}
              onDelete={onDeleteTicket}
              onEdit={onEditTicket}
              onMove={onMoveTicket}
              isMoving={movingTicketId === ticket._id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ColumnCard;
