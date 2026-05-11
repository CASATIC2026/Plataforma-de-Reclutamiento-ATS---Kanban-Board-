import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateName,
  getPasswordStrengthLabel,
} from '../utils/validators';

// ─── Decorative floating circles ───
const circles = [
  { x: -40, y: -30, size: 220, color: '#0f1b3d' },
  { x: 60, y: 20, size: 160, color: '#1a2a5e' },
  { x: -20, y: 540, size: 200, color: '#0f1b3d' },
  { x: 100, y: 580, size: 120, color: '#162350' },
  { x: 180, y: 480, size: 60, color: '#1a2a5e' },
  { x: 300, y: 60, size: 30, color: '#162350' },
  { x: 20, y: 680, size: 180, color: '#0a1530' },
  { x: 'calc(100% - 120px)', y: -20, size: 100, color: '#555' },
  { x: 'calc(100% - 40px)', y: 0, size: 140, color: '#1a1a1a' },
  { x: 'calc(100% - 80px)', y: 520, size: 180, color: '#333' },
  { x: 'calc(100% - 160px)', y: 600, size: 140, color: '#444' },
  { x: 'calc(100% + 20px)', y: 400, size: 100, color: '#222' },
  { x: 420, y: 30, size: 20, color: '#555' },
  { x: 250, y: 120, size: 14, color: '#1a2a5e' },
];

function FloatingCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {circles.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animation: `float-${i % 4} ${6 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Icons as inline SVGs ───
const Icons = {
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2 7 12 14 22 7" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  ),
  person: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
    </svg>
  ),
  career: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  role: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="6" r="3" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  ),
  addUser: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10" cy="8" r="4" />
      <path d="M2 21v-1a6 6 0 0 1 10-4.5" />
      <line x1="19" y1="14" x2="19" y2="22" />
      <line x1="15" y1="18" x2="23" y2="18" />
    </svg>
  ),
  arrow: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
  back: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
};

// ─── Input field with per-field error/hint support ───
function InputField({ icon, label, type = 'text', placeholder = '', value, onChange, onBlur, error = '', hint = '' }) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? '#ef4444'
    : focused
    ? '#3B5FE8'
    : 'transparent';

  const bgColor = error
    ? '#fff5f5'
    : focused
    ? '#eef0f8'
    : '#f2f3f7';

  return (
    <div className="mb-4">
      <label
        className="block text-sm font-semibold mb-1.5"
        style={{ color: '#1a2a5e', fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      <div
        className="flex items-center rounded-xl px-3 py-2.5 transition-all duration-300"
        style={{
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
          boxShadow: focused && !error ? '0 0 0 3px rgba(59,95,232,0.1)' : 'none',
        }}
      >
        <span className="mr-3 text-lg" style={{ color: error ? '#ef4444' : '#8a8fa3' }}>
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); onBlur && onBlur(e); }}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: '#1a2a5e', fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>
      {error && (
        <p className="text-xs mt-1" style={{ color: '#ef4444', fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs mt-1" style={{ color: '#3B5FE8', fontFamily: "'DM Sans', sans-serif" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Select field ───
function SelectField({ icon, label, options, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label
        className="block text-sm font-semibold mb-1.5"
        style={{ color: '#1a2a5e', fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      <div
        className="flex items-center rounded-xl px-3 py-2.5 transition-all duration-300"
        style={{
          backgroundColor: focused ? '#eef0f8' : '#f2f3f7',
          border: focused ? '2px solid #3B5FE8' : '2px solid transparent',
        }}
      >
        <span className="mr-3 text-lg" style={{ color: '#8a8fa3' }}>
          {icon}
        </span>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none text-sm appearance-none cursor-pointer"
          style={{ color: '#1a2a5e', fontFamily: "'DM Sans', sans-serif" }}
        >
          <option value="">Seleccionar...</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a2a5e" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

// ─── Password strength bar ───
function PasswordStrengthBar({ strength }) {
  if (strength === 0) return null;
  const { label, color } = getPasswordStrengthLabel(strength);
  const bars = [1, 2, 3];
  return (
    <div className="flex items-center gap-2 mt-1 mb-3">
      <div className="flex gap-1 flex-1">
        {bars.map((level) => (
          <div
            key={level}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: level <= strength ? color : '#e5e7eb' }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Login Form ───
function LoginForm({ onSwitch, error, loading, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const touch = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const validateFields = useCallback(() => {
    const emailRes = validateEmail(email);
    const errors = {
      email: emailRes.error,
      password: password ? '' : 'La contraseña es requerida.',
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }, [email, password]);

  // Validate on blur for individual fields
  const handleEmailBlur = () => {
    touch('email')();
    const res = validateEmail(email);
    setFieldErrors((e) => ({ ...e, email: res.error }));
  };

  const handlePasswordBlur = () => {
    touch('password')();
    setFieldErrors((e) => ({ ...e, password: password ? '' : 'La contraseña es requerida.' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validateFields()) return;
    onSubmit({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-sm mx-auto"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex flex-col items-center mb-8">
        <h1
          className="text-3xl font-bold mt-3"
          style={{ color: '#0f1b3d', fontFamily: "'Playwrite IE', serif" }}
        >
          Talentify sv
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8a8fa3', fontFamily: "'DM Sans', sans-serif" }}>
          Inicia sesión en tu cuenta
        </p>
      </div>

      {error && (
        <div
          className="mb-4 p-3 rounded-xl text-sm text-center"
          style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
        >
          {error}
        </div>
      )}

      <InputField
        icon={Icons.mail}
        label="Email :"
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleEmailBlur}
        error={touched.email ? fieldErrors.email : ''}
      />
      <InputField
        icon={Icons.lock}
        label="Contraseña :"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={handlePasswordBlur}
        error={touched.password ? fieldErrors.password : ''}
      />

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onSwitch}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#2d2d2d', fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.addUser}
          <span>Registrar</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#0f1b3d',
            fontFamily: "'DM Sans', sans-serif",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Entrando...' : <>{Icons.arrow} <span>Entrar</span></>}
        </button>
      </div>
    </form>
  );
}

// ─── Register Form ───
function RegisterForm({ onSwitch, error, loading, onSubmit }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'Candidate',
  });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailHint, setEmailHint] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));

    // Live password strength feedback
    if (key === 'password') {
      const res = validatePassword(value);
      setPasswordStrength(res.strength);
      // Clear error while typing if now valid
      if (touched[key]) {
        setFieldErrors((fe) => ({ ...fe, password: res.error }));
      }
    }
  };

  const touch = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

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
      default:
        return '';
    }
  };

  const handleBlur = (field) => () => {
    touch(field)();
    const err = validateField(field, form[field]);
    setFieldErrors((fe) => ({ ...fe, [field]: err }));
  };

  const validateAll = () => {
    const fields = ['nombre', 'apellido', 'email', 'password'];
    const errors = {};
    fields.forEach((f) => {
      errors[f] = validateField(f, form[f]);
    });
    setFieldErrors(errors);
    setTouched({ nombre: true, apellido: true, email: true, password: true });
    return Object.values(errors).every((e) => !e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md mx-auto"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: '#0f1b3d', fontFamily: "'Playfair Display', serif" }}
        >
          Crear cuenta
        </h1>
      </div>

      {error && (
        <div
          className="mb-4 p-3 rounded-xl text-sm text-center"
          style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InputField
          icon={Icons.person}
          label="Nombre :"
          value={form.nombre}
          onChange={set('nombre')}
          onBlur={handleBlur('nombre')}
          error={touched.nombre ? fieldErrors.nombre : ''}
        />
        <InputField
          icon={Icons.person}
          label="Apellido :"
          value={form.apellido}
          onChange={set('apellido')}
          onBlur={handleBlur('apellido')}
          error={touched.apellido ? fieldErrors.apellido : ''}
        />
      </div>

      <SelectField
        icon={Icons.role}
        label="Rol :"
        options={['Candidate', 'Recruiter', 'Manager']}
        value={form.rol}
        onChange={set('rol')}
      />

      <InputField
        icon={Icons.mail}
        label="Email :"
        type="email"
        placeholder="tu@correo.com"
        value={form.email}
        onChange={set('email')}
        onBlur={handleBlur('email')}
        error={touched.email ? fieldErrors.email : ''}
        hint={!fieldErrors.email ? emailHint : ''}
      />

      <InputField
        icon={Icons.lock}
        label="Contraseña :"
        type="password"
        placeholder="Mín. 8 caracteres"
        value={form.password}
        onChange={set('password')}
        onBlur={handleBlur('password')}
        error={touched.password ? fieldErrors.password : ''}
      />
      <PasswordStrengthBar strength={passwordStrength} />

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onSwitch}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#2d2d2d', fontFamily: "'DM Sans', sans-serif" }}
        >
          {Icons.back}
          <span>Volver</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#0f1b3d',
            fontFamily: "'DM Sans', sans-serif",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Registrando...' : <>{Icons.arrow} <span>Registrar</span></>}
        </button>
      </div>
    </form>
  );
}

// ─── Main Auth Page ───
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [page, setPage] = useState(initialMode);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, isAdminOrManager, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate(isAdminOrManager ? '/admin/vacantes' : '/');
  }, [isAuthenticated, isAdminOrManager, navigate]);

  if (authLoading) return null;

  const changePage = (next) => {
    setError('');
    setTransitioning(true);
    setTimeout(() => {
      setPage(next);
      setTransitioning(false);
    }, 300);
  };

  const handleLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data);
      const role = res.data.rol;
      navigate(role === 'Administrador' || role === 'Manager' ? '/admin/vacantes' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const ROLE_LEGACY_MAP = { Candidate: 'General', Recruiter: 'Manager', Manager: 'Administrador' };

  const handleRegister = async (form) => {
    setError('');
    setLoading(true);
    try {
      const res = await registerUser({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        rol: ROLE_LEGACY_MAP[form.rol] ?? 'General',
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Playwrite+IE:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes float-0 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, -12px); } }
        @keyframes float-1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-6px, 10px); } }
        @keyframes float-2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(10px, 8px); } }
        @keyframes float-3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-8px, -6px); } }
      `}</style>

      <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#f5f4f0' }}>
        <FloatingCircles />

        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative z-10">
          <div style={{ animation: 'float-0 8s ease-in-out infinite' }} className="relative">
            <div
              className="w-64 h-72 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a2a5e 0%, #0f1b3d 60%, #3B5FE8 100%)',
                transform: 'rotate(-12deg)',
                boxShadow: '0 30px 60px rgba(15,27,61,0.4), inset 0 2px 0 rgba(255,255,255,0.1)',
              }}
            >
              <svg width="180" height="200" viewBox="0 0 180 200" className="opacity-20">
                <path d="M20 40 Q60 20, 80 50 T140 40" stroke="white" strokeWidth="3" fill="none" />
                <path d="M20 80 Q60 60, 80 90 T140 80" stroke="white" strokeWidth="3" fill="none" />
                <path d="M20 120 Q60 100, 80 130 T140 120" stroke="white" strokeWidth="3" fill="none" />
                <path d="M20 160 Q60 140, 80 170 T140 160" stroke="white" strokeWidth="3" fill="none" />
              </svg>
              <div
                className="absolute top-0 h-full w-3"
                style={{
                  left: '48%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                }}
              />
            </div>
            {/* Gear decoration */}
            <div className="absolute -bottom-8 -left-12">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="20" fill="none" stroke="#5CE0D8" strokeWidth="5" opacity="0.5" />
                <circle cx="30" cy="30" r="10" fill="#5CE0D8" opacity="0.3" />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <rect key={a} x="27" y="6" width="6" height="12" rx="2" fill="#5CE0D8" opacity="0.5" transform={`rotate(${a} 30 30)`} />
                ))}
              </svg>
            </div>
            {page === 'register' && (
              <div className="absolute -top-10 right-0">
                <svg width="50" height="50" viewBox="0 0 50 50">
                  <rect x="5" y="15" width="20" height="20" rx="3" fill="#5CE0D8" opacity="0.6" />
                  <rect x="25" y="15" width="20" height="20" rx="3" fill="#9B72E8" opacity="0.5" />
                  <circle cx="25" cy="12" r="6" fill="#3B5FE8" opacity="0.5" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center relative z-10 p-6">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            title="Volver al inicio"
          >
            {Icons.back}
          </button>

          <div
            className="w-full max-w-md rounded-3xl p-8"
            style={{
              backgroundColor: 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(15,27,61,0.08), 0 1px 3px rgba(0,0,0,0.04)',
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            {page === 'login' ? (
              <LoginForm
                onSwitch={() => changePage('register')}
                error={error}
                loading={loading}
                onSubmit={handleLogin}
              />
            ) : (
              <RegisterForm
                onSwitch={() => changePage('login')}
                error={error}
                loading={loading}
                onSubmit={handleRegister}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
