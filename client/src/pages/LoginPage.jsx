import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { Kanban, ArrowRight, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('dev@itba.edu.ar');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/boards';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!email.includes('@')) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Simular delay de autenticación
      await new Promise(r => setTimeout(r, 400));
      login(email, password);
      addToast({
        type: 'success',
        title: '¡Bienvenido!',
        message: 'Sesión iniciada correctamente'
      });
      // Navegación programática según regla estricta
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({
        form: 'Credenciales inválidas. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)',
        padding: '1.5rem'
      }}
    >
      <div className="saas-card login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Kanban size={28} />
          </div>

          <h2 style={{ fontSize: '1.625rem', marginBottom: '0.5rem' }}>
            Acceder a Dev<span style={{ color: 'var(--accent-cyan)' }}>Board</span>
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            Gestiona tus tableros Kanban con arquitectura SDD
          </p>
        </div>

        {errors.form && (
          <div
            style={{
              backgroundColor: 'var(--status-danger-subtle)',
              color: 'var(--status-danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={16} />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Correo Corporativo"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isSubmitting}
            placeholder="dev@itba.edu.ar"
          />

          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isSubmitting}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            isSubmitting={isSubmitting}
            icon={ArrowRight}
          >
            Ingresar al Panel
          </Button>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            Entorno académico ITBA &bull; Modo Demo Activo
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
