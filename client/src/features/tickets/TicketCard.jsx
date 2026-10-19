import React from 'react';
import { Trash2, Edit3, GripVertical, ArrowRight } from 'lucide-react';

/**
 * Componente Presentacional (Dumb Component)
 * Cumple estrictamente con la consigna:
 * - Recibe ticket ({ _id, title, description, column }) y callbacks por props
 * - No contiene useEffect ni llamadas a API interna
 */
export function TicketCard({
  ticket,
  columns = [],
  onDelete,
  onEdit,
  onMove,
  isMoving = false
}) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      ticketId: ticket._id,
      sourceColumnId: ticket.column
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const otherColumns = columns.filter(c => c._id !== ticket.column);

  return (
    <div
      draggable={!isMoving}
      onDragStart={handleDragStart}
      className="saas-card"
      style={{
        padding: '0.875rem 1rem',
        marginBottom: '0.75rem',
        cursor: isMoving ? 'wait' : 'grab',
        opacity: isMoving ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        backgroundColor: 'var(--bg-card)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
          <GripVertical size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <h4
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              wordBreak: 'break-word',
              lineHeight: 1.3
            }}
          >
            {ticket.title}
          </h4>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(ticket)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.25rem', color: 'var(--text-secondary)' }}
              title="Editar ticket"
            >
              <Edit3 size={13} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(ticket._id)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.25rem', color: 'var(--status-danger)' }}
              title="Eliminar ticket"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {ticket.description && (
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginTop: '0.35rem',
            marginBottom: '0.625rem',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {ticket.description}
        </p>
      )}

      {/* Quick Move between columns dropdown/buttons */}
      {otherColumns.length > 0 && onMove && (
        <div
          style={{
            marginTop: '0.625rem',
            paddingTop: '0.5rem',
            borderTop: '1px dashed var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowRight size={11} /> Mover a:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {otherColumns.map((col) => (
              <button
                key={col._id}
                type="button"
                onClick={() => onMove(ticket, col._id)}
                disabled={isMoving}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)'
                }}
                title={`Mover a ${col.title}`}
              >
                {col.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketCard;
