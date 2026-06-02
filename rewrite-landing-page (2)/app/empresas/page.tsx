"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Filter,
  Shield,
  LayoutGrid,
  Settings,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/Footer";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const POOL_STATS = {
  seniorDevs: "1.2k+",
  avgScore: "92%",
  topSkill: "React",
  topSkillFollowUp: "Seguido por Node & Python",
  hiringRate: "3.4x",
  hiringRateDesc: "Más rápido que la media",
};

const FEATURES = [
  {
    icon: Filter,
    title: "Screening Inteligente",
    description:
      "Nuestro algoritmo evalúa habilidades técnicas y blandas, asegurando que solo recibas perfiles que encajan perfectamente con tu cultura.",
  },
  {
    icon: Shield,
    title: "Acceso a la Élite",
    description:
      "Conecta con un pool exclusivo de talento verificado en El Salvador. Desarrolladores, diseñadores y líderes de producto de alto nivel.",
  },
  {
    icon: LayoutGrid,
    title: "Gestión Centralizada",
    description:
      "Un panel ATS intuitivo para gestionar candidatos, programar entrevistas y colaborar con tu equipo en tiempo real.",
  },
];

const STEPS = [
  {
    title: "Crea tu perfil de empresa",
    description:
      "Muestra tu cultura, beneficios y visión para atraer al talento que comparte tus valores.",
  },
  {
    title: "Publica tu primera vacante",
    description:
      "Define requisitos específicos y deja que nuestra IA identifique a los mejores prospectos instantáneamente.",
  },
  {
    title: "Recibe candidatos pre-calificados",
    description:
      "Olvida revisar cientos de CVs. Recibe una lista curada de profesionales listos para entrevistar.",
  },
];

const SKILL_TAGS = [
  "Cloud Computing",
  "Cyber Security",
  "AI & Machine Learning",
  "Mobile Development",
];

// ─── MobileSheet Component ────────────────────────────────────────────────────
function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-full w-[min(100%_-_2rem,18rem)] bg-[#071326] border-l border-outline-variant/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-outline-variant/10 flex-shrink-0">
          <span className="text-base sm:text-lg font-extrabold tracking-tighter text-slate-100 font-[var(--font-plus-jakarta)] truncate">
            Talentify SV
          </span>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col px-4 sm:px-6 py-6 sm:py-8 gap-1 flex-shrink-0">
          {[
            { label: "Inicio", href: "/", active: false },
            { label: "Empresas", href: "/empresas", active: true },
            { label: "Recursos", href: "/recursos", active: false },
          ].map(({ label, href, active }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all font-[var(--font-plus-jakarta)] tracking-tight truncate ${
                active
                  ? "text-brand-turquoise bg-brand-turquoise/10"
                  : "text-slate-300 hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-outline-variant/10 px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-1 flex-shrink-0">
          <p className="text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-2">Legal</p>
          {[
            { label: "Términos y Condiciones", href: "/legal/terminos" },
            { label: "Política de Privacidad", href: "/legal/privacidad" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-sm text-slate-300 hover:text-brand-turquoise transition-colors rounded-lg hover:bg-surface-container-high"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:gap-3 px-4 sm:px-6 pb-6 sm:pb-10 flex-shrink-0">
          <button className="w-full py-2.5 sm:py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold text-xs sm:text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all">
            Iniciar sesión
          </button>
          <button className="w-full py-2.5 sm:py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-xs sm:text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all">
            Registrarse
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Header Component ─────────────────────────────────────────────────────────
function Header() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <header className="bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 w-full h-16 md:h-20 shadow-[0_12px_32px_rgba(3,14,33,0.5)]">
        <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto h-full">
          <Link
            href="/"
            className="text-lg md:text-xl font-extrabold tracking-tighter text-slate-100 font-[var(--font-plus-jakarta)]"
          >
            Talentify SV
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight hover:text-brand-turquoise hover:scale-105 transition-all duration-300"
            >
              Inicio
            </Link>
            <Link
              href="/empresas"
              className="text-brand-turquoise font-bold border-b-2 border-brand-turquoise pb-1 font-[var(--font-plus-jakarta)] tracking-tight hover:scale-105 transition-all duration-300"
            >
              Empresas
            </Link>
            <Link
              href="/recursos"
              className="text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight hover:text-brand-turquoise hover:scale-105 transition-all duration-300"
            >
              Recursos
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-300 font-medium hover:text-brand-turquoise transition-all">
              Iniciar sesión
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all">
              Registrarse
            </button>
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            aria-label="Abrir menú"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-100 hover:bg-surface-container-high transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmpresasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071326] to-[#071326]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-brand-turquoise/5 blur-3xl" />
        {/* Mobile decorative circle */}
        <div className="absolute -right-20 top-20 w-64 h-64 rounded-full bg-[rgba(217,120,98,0.10)] md:hidden" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Copy */}
            <div className="flex flex-col gap-5 md:gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A3549] w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint" />
                </span>
                <span className="text-brand-mint text-xs font-bold tracking-widest uppercase">
                  Reclutamiento de próxima generación
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-brand-turquoise leading-[1.1] tracking-tight font-[var(--font-plus-jakarta)]">
                Encuentra el mejor talento IT de El Salvador
              </h1>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl">
                Optimiza tu proceso de selección con nuestra plataforma impulsada por IA. Filtrado
                inteligente por habilidades, ubicación y perfil cultural para conectar con la élite
                tecnológica.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-turquoise text-white font-bold text-lg shadow-xl shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all">
                  Publicar Vacante
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1F2A3E] text-slate-200 font-semibold text-lg hover:bg-[#2A3549] transition-all">
                  Hablar con un experto
                </button>
              </div>
            </div>

            {/* Hero Image Card - Desktop Only */}
            <div className="hidden lg:block relative">
              <div className="rounded-3xl border border-outline-variant/15 bg-[#101C2F] shadow-2xl overflow-hidden p-4">
                <div className="aspect-video bg-gradient-to-br from-brand-turquoise/20 to-brand-mint/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Settings className="w-16 h-16 text-brand-turquoise mx-auto mb-4 opacity-60" />
                    <p className="text-slate-400 text-sm">Dashboard Preview</p>
                  </div>
                </div>

                {/* Floating Card */}
                <div className="absolute left-8 bottom-12 max-w-md p-6 rounded-2xl border border-outline-variant/15 bg-[#142033]/90 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-turquoise flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-400 text-sm">Candidato Destacado</p>
                      <p className="text-slate-100 font-bold text-base truncate">
                        Senior Fullstack Developer
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Node.js", "AWS"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-mint text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats Card - Below CTA */}
          <div className="lg:hidden mt-10">
            <div className="p-6 sm:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F]">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-brand-mint text-3xl sm:text-4xl font-bold font-[var(--font-plus-jakarta)]">98%</p>
                  <p className="text-on-surface-variant text-xs font-semibold tracking-widest uppercase mt-1">Match Rate</p>
                </div>
                <div>
                  <p className="text-[#D97862] text-3xl sm:text-4xl font-bold font-[var(--font-plus-jakarta)]">15k+</p>
                  <p className="text-on-surface-variant text-xs font-semibold tracking-widest uppercase mt-1">Élite Activa</p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  &quot;La plataforma más sofisticada para encontrar perfiles C-Level en el sector creativo.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-mint/30 flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.8 10.5L2.85 8.9L1.05 8.5L1.225 6.65L0 5.25L1.225 3.85L1.05 2L2.85 1.6L3.8 0L5.5 0.725L7.2 0L8.15 1.6L9.95 2L9.775 3.85L11 5.25L9.775 6.65L9.95 8.5L8.15 8.9L7.2 10.5L5.5 9.775L3.8 10.5ZM4.975 7.025L7.8 4.2L7.1 3.475L4.975 5.6L3.9 4.55L3.2 5.25L4.975 7.025Z" fill="#6AD9C0"/>
                    </svg>
                  </div>
                  <p className="text-on-surface text-xs font-bold tracking-tight">Editorial Director, Vogue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-[#030E21] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 font-[var(--font-plus-jakarta)] mb-4">
              ¿Por qué elegir TALENT?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Diseñamos soluciones editoriales para el mercado de talento moderno, priorizando la
              calidad sobre el volumen.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 md:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F] hover:border-brand-turquoise/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-turquoise/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-turquoise" />
                </div>
                <h3 className="text-slate-100 text-lg md:text-xl font-bold mb-2 pt-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#071326] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Steps */}
            <div className="flex flex-col gap-8 md:gap-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-turquoise font-[var(--font-plus-jakarta)]">
                Cómo transformar tu reclutamiento
              </h2>

              <div className="flex flex-col gap-8 md:gap-12">
                {STEPS.map((step, idx) => (
                  <div key={step.title} className="flex gap-4 md:gap-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-turquoise bg-[#1F2A3E] flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-turquoise font-bold">{idx + 1}</span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className="w-0.5 h-12 md:h-16 bg-outline-variant/20 mt-2" />
                      )}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-slate-100 text-lg md:text-xl font-bold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-400 text-sm md:text-base">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Card */}
            <div className="p-6 md:p-8 rounded-3xl border border-outline-variant/15 bg-[#101C2F]">
              <div className="p-4 md:p-6 rounded-2xl border border-outline-variant/15 bg-[#142033] mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-brand-mint text-sm font-semibold">PROCESO ACTIVO</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    { color: "bg-brand-mint", width: "w-32" },
                    { color: "bg-brand-turquoise", width: "w-24" },
                    { color: "bg-[#8DC7C9]", width: "w-40" },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#2A3549]/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${row.color}`} />
                        <div className={`h-2 ${row.width} rounded bg-slate-600/40`} />
                      </div>
                      <div className="w-8 h-2 rounded bg-slate-600/40" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="aspect-video rounded-2xl border border-outline-variant/15 bg-gradient-to-br from-brand-turquoise/10 to-transparent opacity-80 flex items-center justify-center">
                <p className="text-slate-500 text-sm">Analytics Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#030E21] py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-outline-variant/20 bg-[#071326] relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-turquoise/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-12 md:gap-16">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 font-[var(--font-plus-jakarta)] tracking-tight mb-2">
                    Estadísticas del Pool
                  </h2>
                  <p className="text-slate-400">Calidad técnica respaldada por datos precisos.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-mint/20 w-fit">
                  <TrendingUp className="w-3 h-3 text-brand-mint" />
                  <span className="text-brand-mint text-sm font-bold">Actualizado hoy</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="p-6 md:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F]">
                  <p className="text-slate-400 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
                    Senior Devs
                  </p>
                  <p className="text-slate-100 text-3xl md:text-5xl font-extrabold mb-3">
                    {POOL_STATS.seniorDevs}
                  </p>
                  <div className="h-1 bg-[#2A3549] rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-brand-turquoise rounded-full" />
                  </div>
                </div>

                <div className="p-6 md:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F]">
                  <p className="text-slate-400 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
                    Avg. Score
                  </p>
                  <p className="text-brand-mint text-3xl md:text-5xl font-extrabold mb-3">
                    {POOL_STATS.avgScore}
                  </p>
                  <div className="h-1 bg-[#2A3549] rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-brand-mint rounded-full" />
                  </div>
                </div>

                <div className="p-6 md:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F]">
                  <p className="text-slate-400 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
                    Top Skill
                  </p>
                  <p className="text-slate-100 text-2xl md:text-4xl font-extrabold">
                    {POOL_STATS.topSkill}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">{POOL_STATS.topSkillFollowUp}</p>
                </div>

                <div className="p-6 md:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F]">
                  <p className="text-slate-400 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
                    Hiring Rate
                  </p>
                  <p className="text-brand-turquoise text-3xl md:text-5xl font-extrabold">
                    {POOL_STATS.hiringRate}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">{POOL_STATS.hiringRateDesc}</p>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {SKILL_TAGS.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full border border-outline-variant/20 bg-[#142033]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-turquoise" />
                    <span className="text-slate-400 text-xs md:text-sm">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-16 md:py-20 border-t border-b border-outline-variant/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-slate-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-8 md:mb-12">
            Empresas que confían en nosotros
          </p>
          <div className="flex justify-center items-center gap-8 md:gap-20 opacity-40 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg bg-slate-600/30 flex items-center justify-center"
              >
                <span className="text-slate-500 text-xs font-bold">Logo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 md:p-16 lg:p-20 rounded-[2rem] md:rounded-[3rem] bg-brand-turquoise shadow-2xl shadow-brand-turquoise/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 font-[var(--font-plus-jakarta)]">
                  ¿Listo para contratar al próximo 1%?
                </h2>
                <p className="text-white/80 text-base md:text-xl font-medium">
                  Comienza hoy mismo a publicar tus vacantes o agenda una demo personalizada con
                  nuestro equipo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white text-brand-turquoise font-black text-lg md:text-xl hover:bg-slate-100 active:scale-95 transition-all">
                  Empezar Ahora
                </button>
                <button className="px-8 md:px-10 py-4 md:py-5 rounded-2xl border-2 border-white text-white font-bold text-lg md:text-xl hover:bg-white/10 transition-all">
                  Ver Planes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
