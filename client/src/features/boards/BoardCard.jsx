import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Kanban, Trash2, ArrowRight, Calendar } from 'lucide-react';

export function BoardCard({ board, onDelete, isDeleting = false }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/boards/${board._id}`);
  };

  const formattedDate = board.createdAt
    ? new Date(board.createdAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : null;

  const columnCount = board.columns ? board.columns.length : 0;

  return (
    <div
      onClick={handleCardClick}
      className="saas-card saas-card-interactive"
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-cyan-subtle)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Kanban size={22} />
          </div>

          {onDelete && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(board._id, board.title);
              }}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
              title="Eliminar tablero"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            lineHeight: 1.3
          }}
        >
          {board.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">
            {columnCount} {columnCount === 1 ? 'columna' : 'columnas'}
          </span>

          {formattedDate && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Calendar size={13} />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--accent-cyan)',
          fontWeight: 600,
          fontSize: '0.8125rem'
        }}
      >
        <span>Abrir Tablero</span>
        <ArrowRight size={15} />
      </div>
    </div>
  );
}

export default BoardCard;
