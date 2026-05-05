import { useNavigate } from 'react-router-dom';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        flexDirection: 'column',
        gap: '24px',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'var(--color-danger-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
        }}
      >
        🔒
      </div>

      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-danger)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 8,
          }}
        >
          Error 403
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            color: 'var(--color-navy)',
            marginBottom: 12,
          }}
        >
          Acceso Denegado
        </h1>
        <p style={{ color: 'var(--color-slate)', maxWidth: 420, lineHeight: 1.6 }}>
          No tienes los permisos necesarios para ver esta página. Si crees que
          esto es un error, contacta a tu administrador.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: '1.5px solid var(--color-border)',
            background: 'white',
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
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--color-navy)',
            color: 'white',
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
