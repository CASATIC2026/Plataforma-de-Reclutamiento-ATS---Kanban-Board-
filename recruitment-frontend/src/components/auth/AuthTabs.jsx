export default function AuthTabs({ mode, onLoginClick, onRegisterClick }) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-[#030E21] w-full mb-8">
      <button
        type="button"
        onClick={onLoginClick}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
          mode === 'login'
            ? 'bg-brand-turquoise text-on-brand-turquoise shadow-lg shadow-brand-turquoise/20'
            : 'text-on-surface-variant hover:text-slate-200'
        }`}
      >
        Iniciar Sesión
      </button>
      <button
        type="button"
        onClick={onRegisterClick}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
          mode === 'register'
            ? 'bg-brand-turquoise text-on-brand-turquoise shadow-lg shadow-brand-turquoise/20'
            : 'text-on-surface-variant hover:text-slate-200'
        }`}
      >
        Crear Cuenta
      </button>
    </div>
  );
}
