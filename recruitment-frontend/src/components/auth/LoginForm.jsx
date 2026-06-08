import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { validateEmail } from '../../utils/validators';
import AuthField from './AuthField';
import AuthOAuthRow from './AuthOAuthRow';
import AuthDivider from './AuthDivider';

export default function LoginForm({ error, loading, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validateFields = useCallback(() => {
    const emailRes = validateEmail(email);
    const errors = {
      email: emailRes.error,
      password: password ? '' : 'La contraseña es requerida.',
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validateFields()) return;
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 font-display">
          Bienvenido de nuevo
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base">
          Ingresa tus credenciales para acceder a tu panel.
        </p>
      </div>

      <AuthOAuthRow />
      <AuthDivider label="O continúa con correo" />

      {error && (
        <div className="p-3 rounded-xl text-sm text-center bg-red-500/10 text-red-300 border border-red-400/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <AuthField
          label="Dirección de correo"
          name="email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            setTouched((t) => ({ ...t, email: true }));
            setFieldErrors((fe) => ({ ...fe, email: validateEmail(email).error }));
          }}
          error={touched.email ? fieldErrors.email : ''}
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
              Contraseña
            </span>
            <span
              className="text-xs font-semibold text-brand-turquoise/60 cursor-not-allowed"
              title="Próximamente"
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
          <AuthField
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              setTouched((t) => ({ ...t, password: true }));
              setFieldErrors((fe) => ({
                ...fe,
                password: password ? '' : 'La contraseña es requerida.',
              }));
            }}
            error={touched.password ? fieldErrors.password : ''}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-base md:text-lg shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-[0.98] transition-all font-display flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? 'Iniciando sesión...' : (
            <>
              Iniciar sesión en Talentify SV
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <p className="text-slate-300 text-xs md:text-sm leading-relaxed text-center">
        Al iniciar sesión, aceptas nuestros{' '}
        <Link to="/legal/terminos" className="text-brand-turquoise hover:underline">
          Términos de Servicio
        </Link>{' '}
        y nuestra{' '}
        <Link to="/legal/privacidad" className="text-brand-turquoise hover:underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </form>
  );
}
