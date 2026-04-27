import { useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const confirmStyle =
    variant === 'danger'
      ? { background: '#ba1a1a', color: '#fff' }
      : { background: '#3525cd', color: '#fff' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(19, 27, 46, 0.45)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '16px',
          padding: '28px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          fontFamily: 'sans-serif',
        }}
      >
        <h2
          id="confirm-modal-title"
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 800,
            color: '#131b2e',
          }}
        >
          {title}
        </h2>
        {message && (
          <p
            style={{
              marginTop: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              lineHeight: 1.5,
              color: '#464555',
            }}
          >
            {message}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #c7c4d8',
              background: '#fff',
              color: '#464555',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#faf8ff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
              ...confirmStyle,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
