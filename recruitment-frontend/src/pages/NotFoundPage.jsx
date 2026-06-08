import { useNavigate } from 'react-router-dom';
import '../styles/admin-theme.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="admin-theme"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        flexDirection: 'column',
        gap: '24px',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(5rem, 14vw, 9rem)',
          fontWeight: 800,
          lineHeight: 1,
          margin: 0,
          color: 'var(--color-accent)',
          letterSpacing: '-0.04em',
        }}
      >
        404
      </p>

      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            color: 'var(--color-navy)',
            margin: '0 0 12px',
          }}
        >
          Página no encontrada
        </h1>
        <p style={{ color: 'var(--color-slate)', maxWidth: 420, lineHeight: 1.6, margin: 0 }}>
          La página que buscas no existe o fue movida.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: '1.5px solid var(--color-border)',
            background: 'var(--color-surface-2)',
            color: 'var(--color-navy)',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Volver
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--color-accent)',
            color: 'var(--color-on-brand-turquoise)',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
