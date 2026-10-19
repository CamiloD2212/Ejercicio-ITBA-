import React from 'react';
import { useToast } from '../../hooks/useToast.jsx';
import { CheckCircle2, AlertOctagon, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`toast ${
              isError ? 'toast-error' : isSuccess ? 'toast-success' : 'toast-info'
            }`}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {isError && <AlertOctagon size={18} style={{ color: 'var(--status-danger)' }} />}
              {isSuccess && <CheckCircle2 size={18} style={{ color: 'var(--status-success)' }} />}
              {!isError && !isSuccess && <Info size={18} style={{ color: 'var(--accent-cyan)' }} />}
            </div>

            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem', marginLeft: '0.25rem', color: 'var(--text-muted)' }}
              aria-label="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
