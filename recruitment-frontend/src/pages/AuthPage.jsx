import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { getPostLoginPath } from '../lib/authRoutes';
import '../styles/public-theme.css';
import AuthLayout from '../components/auth/AuthLayout';
import AuthTabs from '../components/auth/AuthTabs';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getPostLoginPath(user), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const urlMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
    setMode(urlMode);
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="public-theme min-h-screen bg-[#071326] flex items-center justify-center text-on-surface-variant">
        Cargando…
      </div>
    );
  }

  const switchMode = (next) => {
    setError('');
    setMode(next);
    setSearchParams(next === 'register' ? { mode: 'register' } : {}, { replace: true });
  };

  const handleLogin = async ({ email, password, turnstileToken }) => {
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ email, password, turnstileToken });
      login(res.data);
      navigate(getPostLoginPath(res.data), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (form) => {
    setError('');
    setLoading(true);
    try {
      const res = await registerUser({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        rol: form.rol,
        carrera: form.carrera,
      });
      login(res.data);
      navigate(getPostLoginPath(res.data), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode={mode}>
      <AuthTabs
        mode={mode}
        onLoginClick={() => switchMode('login')}
        onRegisterClick={() => switchMode('register')}
      />

      {mode === 'login' ? (
        <>
          <LoginForm error={error} loading={loading} onSubmit={handleLogin} />
          <div className="text-center mt-6 space-y-1">
            <p className="text-on-surface-variant text-sm">¿No tienes una cuenta?</p>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="text-brand-turquoise font-bold text-sm md:text-base hover:text-brand-turquoise/80 transition-colors"
            >
              Regístrate gratis
            </button>
          </div>
        </>
      ) : (
        <>
          <RegisterForm error={error} loading={loading} onSubmit={handleRegister} />
          <div className="text-center mt-6 space-y-1 py-2">
            <p className="text-on-surface-variant text-sm md:text-base">¿Ya tienes una cuenta?</p>
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-brand-turquoise font-bold text-sm md:text-base hover:text-brand-turquoise/80 transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
