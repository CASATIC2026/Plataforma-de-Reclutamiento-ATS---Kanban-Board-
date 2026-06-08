import { useState, useEffect } from 'react';
import { getFeatureFlags, toggleFeatureFlag } from '../../api/featureFlagsApi';

function ToggleSwitch({ value, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? 'var(--color-green)' : 'var(--color-border)',
        border: 'none', cursor: disabled ? 'default' : 'pointer',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
        background: 'white', transition: 'left 0.2s',
        left: value ? 23 : 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

export default function PlatformConfig() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    getFeatureFlags().then(r => setFlags(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (flag) => {
    if (toggling) return;
    setToggling(flag.id);
    try {
      const r = await toggleFeatureFlag(flag.id);
      setFlags(prev => prev.map(f => f.id === flag.id ? r.data : f));
    } catch {
      alert('Error al actualizar flag.');
    } finally {
      setToggling(null);
    }
  };

  const flagDescriptions = {
    screening_automatico: 'Evalúa automáticamente los candidatos al recibir su postulación usando el algoritmo de scoring.',
    email_notificaciones: 'Envía confirmaciones por email a candidatos al postularse y notificaciones de resultado.',
    registro_publico: 'Permite que candidatos se registren públicamente sin invitación de administrador.',
    modo_mantenimiento: 'Bloquea el acceso público al portal de empleos. Solo los admins pueden acceder.',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>Configuración de Plataforma</h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>Solo visible para el rol Owner</p>
      </div>

      {/* Feature Flags */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>
            Feature Flags
          </h2>
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-muted)' }}>Cargando...</div>
        ) : (
          <div>
            {flags.map(flag => (
              <div key={flag.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-navy)', margin: '0 0 4px' }}>{flag.nombre}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: 0 }}>
                    {flagDescriptions[flag.nombre] ?? flag.descripcion}
                  </p>
                  {flag.modificadoPorEmail && (
                    <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: '4px 0 0' }}>
                      Última modificación: {flag.modificadoPorEmail} · {new Date(flag.modifiedAt).toLocaleString('es-SV')}
                    </p>
                  )}
                </div>
                <ToggleSwitch value={flag.estaActivo} onChange={() => handleToggle(flag)} disabled={toggling === flag.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SMTP Config (display only) */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>Configuración SMTP</h2>
        </div>
        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: '0 0 16px' }}>
            La configuración SMTP se gestiona a través de variables de entorno (<code>appsettings.json</code> o <code>.env</code>).
          </p>
          {[
            { label: 'Host',     value: 'smtp-relay.brevo.com' },
            { label: 'Puerto',   value: '587' },
            { label: 'Usuario',  value: '**configurado en .env**' },
            { label: 'Password', value: '••••••••••' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--color-border)', gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', width: 80 }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--color-slate)', fontFamily: 'monospace' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Screening Threshold */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>Umbral de Screening Global</h2>
        </div>
        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: '0 0 16px' }}>
            El umbral por defecto es <strong>60/100</strong>. Cada vacante puede tener su propio umbral, configurable en la sección de Vacantes.
          </p>
          <div style={{ background: 'var(--color-bg)', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-accent)' }}>60</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-navy)', margin: 0 }}>Umbral global actual</p>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '3px 0 0' }}>
                Candidatos con puntaje menor son marcados como Rechazados automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
