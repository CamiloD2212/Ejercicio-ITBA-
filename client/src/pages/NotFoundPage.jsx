import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 220px)',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--accent-purple-subtle)',
          color: 'var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
        Página no encontrada
      </h2>
      <p style={{ maxWidth: '420px', marginBottom: '2rem' }}>
        La ruta que intentas visitar no existe o fue movida a otra ubicación.
      </p>

      <Button
        variant="primary"
        icon={ArrowLeft}
        onClick={() => navigate('/boards')}
      >
        Volver a Mis Tableros
      </Button>
    </div>
  );
}

export default NotFoundPage;
