import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { LayoutDashboard, Kanban, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <NavLink
            to="/boards"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Kanban size={20} />
            </div>
            <span>
              Dev<span style={{ color: 'var(--accent-cyan)' }}>Board</span>
            </span>
          </NavLink>

          {/* Nav Links */}
          {isAuthenticated && (
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <NavLink
                to="/boards"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--accent-cyan-subtle)' : 'transparent',
                  textDecoration: 'none'
                })}
              >
                <LayoutDashboard size={16} />
                <span>Mis Tableros</span>
              </NavLink>
            </nav>
          )}
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <ThemeToggle />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.6rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-purple-subtle)',
                    color: 'var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <User size={14} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name || 'Dev User'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Cerrar sesión"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Iniciar Sesión
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
