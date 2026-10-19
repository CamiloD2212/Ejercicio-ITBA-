import React from 'react';
import { useTheme } from '../../hooks/useTheme.jsx';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-secondary btn-sm ${className}`}
      style={{
        borderRadius: 'var(--radius-full)',
        padding: '0.45rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <Sun size={17} style={{ color: 'var(--accent-cyan)' }} />
      ) : (
        <Moon size={17} style={{ color: 'var(--accent-purple)' }} />
      )}
    </button>
  );
}

export default ThemeToggle;
