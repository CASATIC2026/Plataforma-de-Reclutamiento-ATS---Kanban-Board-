import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../../utils/validators';
import AuthField, { AuthSelect } from './AuthField';
import AuthOAuthRow from './AuthOAuthRow';
import AuthDivider from './AuthDivider';
import PasswordStrengthBar from './PasswordStrengthBar';

const ROLE_OPTIONS = [
  { value: 'Candidate', label: 'Candidato — buscar empleo' },
  { value: 'Recruiter', label: 'Reclutador — publicar vacantes' },
  { value: 'Manager', label: 'Manager — supervisar equipo' },
];

const CARRERA_OPTIONS = [
  { value: '', label: 'Selecciona tu especialidad (opcional)' },
  { value: 'Desarrollo Frontend', label: 'Desarrollador Frontend' },
  { value: 'Desarrollo Backend', label: 'Desarrollador Backend' },
  { value: 'Fullstack', label: 'Desarrollador Fullstack' },
  { value: 'DevOps', label: 'DevOps Engineer' },
  { value: 'UX/UI', label: 'Diseñador UX/UI' },
  { value: 'Product Management', label: 'Product Manager' },
];

export default function RegisterForm({ error, loading, onSubmit }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'Candidate',
    carrera: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailHint, setEmailHint] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (key === 'password') {
      const res = validatePassword(value);
      setPasswordStrength(res.strength);
      if (touched.password) setFieldErrors((fe) => ({ ...fe, password: res.error }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'nombre':
        return validateName(value, 'Nombre', 2).error;
      case 'apellido':
        return validateName(value, 'Apellido', 2).error;
      case 'email': {
        const res = validateEmail(value);
        setEmailHint(res.suggestion || '');
        return res.error;
      }
      case 'password':
        return validatePassword(value).error;
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña.';
        if (value !== form.password) return 'Las contraseñas no coinciden.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setFieldErrors((fe) => ({ ...fe, [field]: validateField(field, form[field]) }));
  };

  const validateAll = () => {
    const fields = ['nombre', 'apellido', 'email', 'password', 'confirmPassword'];
    const errors = {};
    fields.forEach((f) => {
      errors[f] = validateField(f, form[f]);
    });
    if (!acceptTerms) errors.terms = 'Debes aceptar los términos y la política de privacidad.';
    setFieldErrors(errors);
    setTouched({
      nombre: true,
      apellido: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
    return Object.values(errors).every((e) => !e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    onSubmit({
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      password: form.password,
      rol: form.rol,
      carrera: form.carrera || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 font-display">Crear cuenta</h2>
        <p className="text-on-surface-variant text-sm md:text-base">
          Empieza tu trayectoria profesional hoy mismo.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-sm text-center bg-red-500/10 text-red-300 border border-red-400/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthField
            label="Nombre"
            name="nombre"
            icon={User}
            placeholder="Nombre"
            value={form.nombre}
            onChange={set('nombre')}
            onBlur={handleBlur('nombre')}
            error={touched.nombre ? fieldErrors.nombre : ''}
            autoComplete="given-name"
          />
          <AuthField
            label="Apellido"
            name="apellido"
            icon={User}
            placeholder="Apellido"
            value={form.apellido}
            onChange={set('apellido')}
            onBlur={handleBlur('apellido')}
            error={touched.apellido ? fieldErrors.apellido : ''}
            autoComplete="family-name"
          />
        </div>

        <AuthSelect
          label="Tipo de cuenta"
          name="rol"
          icon={Briefcase}
          value={form.rol}
          onChange={set('rol')}
          options={ROLE_OPTIONS}
        />

        <AuthField
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="email@ejemplo.com"
          value={form.email}
          onChange={set('email')}
          onBlur={handleBlur('email')}
          error={touched.email ? fieldErrors.email : ''}
          hint={!fieldErrors.email ? emailHint : ''}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <AuthField
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              icon={Lock}
              placeholder="Mín. 8 caracteres"
              value={form.password}
              onChange={set('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? fieldErrors.password : ''}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant"
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
            <PasswordStrengthBar strength={passwordStrength} />
          </div>
          <AuthField
            label="Confirmar contraseña"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            icon={Lock}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword ? fieldErrors.confirmPassword : ''}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant"
                aria-label="Mostrar confirmación"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
        </div>

        <AuthSelect
          label="Especialidad (opcional)"
          name="carrera"
          value={form.carrera}
          onChange={set('carrera')}
          options={CARRERA_OPTIONS}
        />

        <div className="flex gap-3 items-start">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-1 accent-brand-turquoise flex-shrink-0"
          />
          <label htmlFor="terms" className="text-xs text-on-surface-variant/90 leading-relaxed">
            Acepto los{' '}
            <Link to="/legal/terminos" className="text-brand-turquoise hover:underline">
              Términos de Servicio
            </Link>{' '}
            y la{' '}
            <Link to="/legal/privacidad" className="text-brand-turquoise hover:underline">
              Política de Privacidad
            </Link>{' '}
            de Talentify SV.
          </label>
        </div>
        {touched.terms && fieldErrors.terms && (
          <p className="text-xs text-red-400 -mt-2">{fieldErrors.terms}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-base shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-[0.98] transition-all font-display flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? 'Creando cuenta...' : (
            <>
              Crear cuenta en Talentify SV
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <AuthDivider label="O regístrate con" />
        <AuthOAuthRow />
      </div>
    </form>
  );
}
