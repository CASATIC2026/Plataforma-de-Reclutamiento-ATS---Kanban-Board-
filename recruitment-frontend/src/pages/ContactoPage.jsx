import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  HelpCircle,
  FileText,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import {
  CONTACT_EMAIL,
  CONTACT_HOURS,
  CONTACT_LOCATION,
  CONTACT_MOTIVOS,
  INTEREST_LINKS,
  OFFICE_IMAGE,
  QUICK_LINKS,
} from '../data/contactoContent';

const inputClass =
  'w-full rounded-lg border border-[rgba(85,67,62,0.15)] bg-[#030E21] px-4 py-3.5 text-[#D7E3FD] placeholder:text-[rgba(215,227,253,0.35)] text-sm md:text-base outline-none focus:border-brand-turquoise/40 focus:ring-1 focus:ring-brand-turquoise/30 transition-colors';

const labelClass =
  'text-xs font-semibold uppercase tracking-[0.1em] text-[#D97862] md:text-sm md:tracking-[0.05em] md:text-[#DBC1BB] md:font-semibold';

function ContactInfoCard({ icon: Icon, label, value, iconBg, iconClass = 'text-brand-turquoise' }) {
  return (
    <div className="flex p-5 md:p-6 items-center gap-5 rounded-xl md:rounded-2xl border border-[rgba(85,67,62,0.15)] md:border-[rgba(85,67,62,0.05)] bg-[#142033] md:bg-[#101C2F] w-full">
      <div
        className={`flex justify-center items-center rounded-lg md:rounded-full w-12 h-12 md:w-14 md:h-14 shrink-0 ${iconBg}`}
      >
        <Icon className={`w-6 h-6 md:w-7 md:h-7 ${iconClass}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[#DBC1BB] text-xs md:text-sm font-bold tracking-wide uppercase opacity-80 md:text-[rgba(106,217,192,0.60)] md:tracking-[0.1em]">
          {label}
        </p>
        {value.startsWith('mailto:') ? (
          <a
            href={value}
            className="text-[#D7E3FD] text-base md:text-xl font-semibold md:font-normal hover:text-brand-turquoise transition-colors break-all"
          >
            {CONTACT_EMAIL}
          </a>
        ) : (
          <p className="text-[#D7E3FD] text-base md:text-xl font-semibold md:font-normal leading-snug">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function InterestIcon({ type }) {
  if (type === 'faq') {
    return <HelpCircle className="w-8 h-8 text-[#FFB4A3]" strokeWidth={1.5} />;
  }
  return <FileText className="w-8 h-8 text-brand-turquoise" strokeWidth={1.5} />;
}

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    empresa: '',
    telefono: '',
    motivo: '',
    mensaje: '',
    acepta: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => {
    const value = field === 'acepta' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.motivo || !form.mensaje.trim()) {
      setError('Completa los campos obligatorios marcados con *.');
      return;
    }
    if (!form.acepta) {
      setError('Debes aceptar la política de privacidad para enviar el mensaje.');
      return;
    }

    const motivoLabel =
      CONTACT_MOTIVOS.find((m) => m.value === form.motivo)?.label ?? form.motivo;
    const body = [
      `Nombre: ${form.nombre}`,
      `Correo: ${form.correo}`,
      form.empresa ? `Empresa: ${form.empresa}` : null,
      form.telefono ? `Teléfono: ${form.telefono}` : null,
      `Motivo: ${motivoLabel}`,
      '',
      form.mensaje,
    ]
      .filter(Boolean)
      .join('\n');

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[Contacto] ${motivoLabel}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#071326] w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero */}
      <section className="pt-12 md:pt-32 pb-8 md:pb-4 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start gap-4 md:gap-6">
          <h1 className="font-editorial text-5xl md:text-7xl font-semibold text-[#D7E3FD] text-center md:text-left tracking-tight leading-tight">
            Hablemos
          </h1>
          <p className="text-[#DBC1BB] md:text-[#6AD9C0] text-base md:text-2xl font-medium text-center md:text-left max-w-xs md:max-w-2xl leading-relaxed">
            <span className="md:hidden">
              Elevamos el estándar del mercado de talento. Conecta con nosotros para transformar tu
              reclutamiento o carrera profesional.
            </span>
            <span className="hidden md:inline">
              Ventas, soporte y alianzas — respuesta en{' '}
              <span className="text-[#6AD9C0] font-semibold">24–48 horas</span> hábiles.
            </span>
          </p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="px-6 md:px-8 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_minmax(280px,420px)] gap-8 lg:gap-12 items-start">
          {/* Form card */}
          <div className="relative rounded-xl md:rounded-3xl border border-[rgba(85,67,62,0.10)] bg-[#101C2F] md:bg-[rgba(16,28,47,0.60)] p-6 md:p-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10)] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.20)] overflow-hidden">
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br from-[#D97862]/20 to-[#FFB4A3]/10 opacity-50 md:hidden pointer-events-none" />

            {submitted ? (
              <div className="relative z-10 py-12 text-center">
                <p className="text-[#D7E3FD] text-xl font-bold mb-3">¡Gracias por escribirnos!</p>
                <p className="text-[#DBC1BB] text-sm max-w-md mx-auto">
                  Si tu cliente de correo no se abrió, escríbenos directamente a{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-turquoise hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      nombre: '',
                      correo: '',
                      empresa: '',
                      telefono: '',
                      motivo: '',
                      mensaje: '',
                      acepta: false,
                    });
                  }}
                  className="mt-8 text-sm text-brand-turquoise font-semibold hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5 md:gap-6">
                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contacto-nombre" className={labelClass}>
                      <span className="md:hidden">Nombre</span>
                      <span className="hidden md:inline">Nombre completo *</span>
                    </label>
                    <input
                      id="contacto-nombre"
                      type="text"
                      required
                      value={form.nombre}
                      onChange={update('nombre')}
                      placeholder="Ej. Juan Pérez"
                      className={inputClass}
                      autoComplete="name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contacto-correo" className={labelClass}>
                      <span className="md:hidden">Correo</span>
                      <span className="hidden md:inline">Correo corporativo *</span>
                    </label>
                    <input
                      id="contacto-correo"
                      type="email"
                      required
                      value={form.correo}
                      onChange={update('correo')}
                      placeholder="nombre@empresa.com"
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contacto-empresa" className={labelClass}>
                      Empresa
                    </label>
                    <input
                      id="contacto-empresa"
                      type="text"
                      value={form.empresa}
                      onChange={update('empresa')}
                      placeholder="Nombre de la empresa"
                      className={inputClass}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contacto-telefono" className={labelClass}>
                      Teléfono
                    </label>
                    <input
                      id="contacto-telefono"
                      type="tel"
                      value={form.telefono}
                      onChange={update('telefono')}
                      placeholder="+503 …"
                      className={inputClass}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contacto-motivo" className={labelClass}>
                    <span className="md:hidden">Motivo</span>
                    <span className="hidden md:inline">Motivo de contacto *</span>
                  </label>
                  <div className="relative">
                    <select
                      id="contacto-motivo"
                      required
                      value={form.motivo}
                      onChange={update('motivo')}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                    >
                      {CONTACT_MOTIVOS.map(({ value, label }) => (
                        <option key={value || 'empty'} value={value} disabled={!value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none"
                      aria-hidden
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contacto-mensaje" className={labelClass}>
                    Mensaje *
                  </label>
                  <textarea
                    id="contacto-mensaje"
                    required
                    rows={5}
                    value={form.mensaje}
                    onChange={update('mensaje')}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    className={`${inputClass} resize-y min-h-[120px] md:min-h-[140px]`}
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.acepta}
                    onChange={update('acepta')}
                    className="mt-1 w-5 h-5 rounded border-[rgba(85,67,62,0.3)] bg-[#030E21] text-brand-turquoise focus:ring-brand-turquoise/30 shrink-0"
                  />
                  <span className="text-[#6AD9C0] text-sm leading-relaxed group-hover:text-brand-turquoise transition-colors">
                    Acepto que Talentify SV contacte mi empresa según la{' '}
                    <Link to="/legal/privacidad" className="underline font-medium">
                      política de privacidad
                    </Link>
                    .
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-[#FFB4A3]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex justify-center items-center gap-2 w-full py-4 md:py-5 rounded-xl bg-[#2AA48D] text-[#003229] font-bold text-base md:text-lg hover:opacity-90 active:scale-[0.99] transition-all shadow-[0_10px_15px_-3px_rgba(106,217,192,0.2)]"
                >
                  Enviar mensaje
                  <Send className="w-4 h-4 md:hidden" aria-hidden />
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 md:gap-6">
            <ContactInfoCard
              icon={Mail}
              label="Correo"
              value={`mailto:${CONTACT_EMAIL}`}
              iconBg="bg-[rgba(217,120,98,0.20)] md:bg-[rgba(106,217,192,0.10)]"
              iconClass="text-[#D97862] md:text-brand-turquoise"
            />
            <ContactInfoCard
              icon={Clock}
              label="Horario"
              value={CONTACT_HOURS}
              iconBg="bg-[rgba(106,217,192,0.20)] md:bg-[rgba(106,217,192,0.10)]"
            />
            <ContactInfoCard
              icon={MapPin}
              label="Ubicación"
              value={CONTACT_LOCATION}
              iconBg="bg-[rgba(103,63,53,0.20)] md:bg-[rgba(106,217,192,0.10)]"
              iconClass="text-[#F2B9AC] md:text-brand-turquoise"
            />

            {/* Quick links — desktop */}
            <div className="hidden md:flex p-8 flex-col gap-6 rounded-3xl border border-[rgba(85,67,62,0.10)] bg-[rgba(42,53,73,0.30)] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[rgba(106,217,192,0.05)] pointer-events-none" />
              <p className="text-[#D7E3FD] text-xl font-bold relative z-10">Enlaces rápidos</p>
              <ul className="flex flex-col gap-4 relative z-10">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="flex items-center gap-3 text-[#DBC1BB] font-medium hover:text-brand-turquoise transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Office image — desktop */}
            <div className="hidden md:block relative rounded-3xl overflow-hidden">
              <img
                src={OFFICE_IMAGE}
                alt="Oficina Talentify SV"
                className="w-full h-[273px] object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#071326] via-transparent to-transparent" />
              <div className="absolute bottom-5 right-6">
                <span className="inline-block py-1 px-3 rounded-full bg-[rgba(106,217,192,0.20)] text-[#6AD9C0] text-xs font-bold tracking-[0.1em] uppercase">
                  Sede central
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile interest links */}
      <section className="px-6 pb-12 md:hidden">
        <p className="text-center text-[#D97862] text-xs font-bold tracking-[0.1em] uppercase mb-6">
          Enlaces de interés
        </p>
        <div className="grid grid-cols-2 gap-4">
          {INTEREST_LINKS.map(({ label, href, icon }) => (
            <Link
              key={href}
              to={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[rgba(85,67,62,0.05)] bg-[#101C2F] hover:border-brand-turquoise/20 transition-colors"
            >
              <InterestIcon type={icon} />
              <span className="text-[#D7E3FD] text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
