"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Download,
  Mail,
  CheckCircle,
  Menu,
  X,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/Footer";

// ─────────────────────────────────────────────────────────────
// Mock Data - Artículos de recursos para candidatos
// ─────────────────────────────────────────────────────────────
const MOCK_ARTICLES = [
  {
    id: 1,
    category: "Guías",
    title: "Dominando la Entrevista de Ingeniería Senior",
    description:
      "Exploramos las preguntas técnicas y comportamentales más complejas en el ecosistema tech de El Salvador.",
    readTime: 8,
    image: "/placeholder-article-1.jpg",
  },
  {
    id: 2,
    category: "Tendencias",
    title: "El Futuro del Trabajo Remoto",
    description:
      "Cómo las empresas salvadoreñas están adoptando modelos híbridos y qué significa para tu flexibilidad.",
    readTime: 6,
    image: "/placeholder-article-2.jpg",
  },
  {
    id: 3,
    category: "Salarios",
    title: "Estrategias de Negociación Salarial",
    description:
      "Aprende a valorar tu experiencia y a navegar la conversación de compensación con confianza absoluta.",
    readTime: 10,
    image: "/placeholder-article-3.jpg",
  },
  {
    id: 4,
    category: "IT",
    title: "Habilidades más Demandadas en 2025",
    description:
      "Desde AI hasta Ciberseguridad: lo que los reclutadores locales están buscando activamente hoy.",
    readTime: 5,
    image: "/placeholder-article-4.jpg",
  },
  {
    id: 5,
    category: "Entrevistas",
    title: "Entrevista con CTOs de El Salvador",
    description:
      "Una mirada interna a cómo los líderes tecnológicos construyen sus equipos de alto rendimiento.",
    readTime: 12,
    image: "/placeholder-article-5.jpg",
  },
  {
    id: 6,
    category: "Carrera",
    title: "Tu Marca Personal en el Mercado Digital",
    description:
      "Cómo destacar tu perfil en un mercado global sin perder tu identidad profesional local.",
    readTime: 7,
    image: "/placeholder-article-6.jpg",
  },
];

const FILTER_TABS = [
  "Todos los Recursos",
  "Guías para Candidatos",
  "Entrevistas",
  "Carrera & Salarios",
  "Tendencias IT",
];

const CURATED_FEATURES = [
  {
    title: "Datos Reales del Mercado",
    description: "Nada de estimaciones genéricas. Usamos datos locales de El Salvador.",
  },
  {
    title: "Enfoque en Liderazgo",
    description: "Guías diseñadas para llevarte de perfiles junior a roles de impacto estratégico.",
  },
  {
    title: "Acceso Exclusivo",
    description: "Entrevistas con tomadores de decisiones que no encontrarás en otro lugar.",
  },
];

// ─────────────────────────────────────────────────────────────
// Mobile Sheet Navigation Component
// ─────────────────────────────────────────────────────────────
function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-full w-[min(100%_-_2rem,18rem)] bg-[#071326] border-l border-outline-variant/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sheet header */}
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

        {/* Nav links */}
        <nav className="flex flex-col px-4 sm:px-6 py-6 sm:py-8 gap-1 flex-shrink-0">
          {[
            { label: "Inicio", href: "/", active: false },
            { label: "Empresas", href: "/empresas", active: false },
            { label: "Recursos", href: "/recursos", active: true },
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

        {/* Legal Links */}
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

        {/* Auth buttons */}
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

// ─────────────────────────────────────────────────────────────
// Article Card Component
// ─────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: (typeof MOCK_ARTICLES)[0] }) {
  return (
    <article className="flex flex-col rounded-2xl border border-[rgba(85,67,62,0.05)] bg-[#101C2F] overflow-hidden group hover:border-brand-turquoise/20 transition-all">
      {/* Image */}
      <div className="relative bg-[#142033] aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-turquoise/20 to-brand-coral/10 flex items-center justify-center">
          <FileText className="w-12 h-12 text-brand-turquoise/40" />
        </div>
        <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[rgba(7,19,38,0.80)] text-brand-turquoise text-[10px] font-bold tracking-widest uppercase">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 gap-2">
        <h3 className="text-[#D7E3FD] font-[var(--font-plus-jakarta)] text-xl font-bold leading-7 group-hover:text-brand-turquoise transition-colors">
          {article.title}
        </h3>
        <p className="text-[#DBC1BB] text-sm leading-relaxed line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-[#A38C87]">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium uppercase">{article.readTime} min lectura</span>
          </div>
          <ArrowRight className="w-5 h-5 text-brand-coral group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────
export default function RecursosPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos los Recursos");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[rgba(7,19,38,0.95)] backdrop-blur-lg border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-brand-coral hover:bg-surface-container-high transition-all"
              onClick={() => setSheetOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="text-lg md:text-xl font-extrabold tracking-tighter text-slate-100 font-[var(--font-plus-jakarta)]">
              Talentify SV
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight hover:text-brand-turquoise hover:scale-105 transition-all duration-300" href="/">
              Inicio
            </Link>
            <Link className="text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight hover:text-brand-turquoise hover:scale-105 transition-all duration-300" href="/empresas">
              Empresas
            </Link>
            <Link className="text-brand-turquoise font-bold border-b-2 border-brand-turquoise pb-1 font-[var(--font-plus-jakarta)] tracking-tight hover:scale-105 transition-all duration-300" href="/recursos">
              Recursos
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all">
              Iniciar sesión
            </button>
            <button className="px-5 py-2 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all">
              Registrarse
            </button>
          </div>

          {/* Mobile avatar placeholder */}
          <div className="md:hidden w-8 h-8 rounded-full bg-[#2A3549] border border-outline-variant/15" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-brand-turquoise/20 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10 hidden md:block" />
        
        {/* Background image placeholder for desktop */}
        <div className="absolute inset-0 hidden md:block">
          <div className="w-full h-full bg-gradient-to-br from-brand-turquoise/10 to-brand-coral/5" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-20">
          <div className="max-w-2xl flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-brand-turquoise/20 bg-brand-turquoise/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-turquoise" />
              <span className="text-brand-turquoise text-[10px] font-bold tracking-widest uppercase">
                Destacado
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-brand-turquoise leading-[1.1] tracking-tight font-[var(--font-plus-jakarta)]">
              Recursos para impulsar tu carrera
            </h1>

            <p className="text-[#DBC1BB] text-base md:text-xl font-light leading-relaxed max-w-xl">
              Guías, entrevistas y análisis de salarios para profesionales en El Salvador. 
              Curaduría editorial para el talento del futuro.
            </p>

            <div className="pt-2">
              <button className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-brand-coral text-[#561406] font-bold text-sm md:text-base hover:opacity-90 active:scale-95 transition-all">
                Explorar Guías
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 z-20 bg-[rgba(7,19,38,0.80)] backdrop-blur-lg border-b border-[rgba(85,67,62,0.10)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Filter pills - horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`flex-shrink-0 whitespace-nowrap px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === tab
                      ? "bg-brand-turquoise text-[#003229]"
                      : "bg-[#1F2A3E] text-[#DBC1BB] hover:bg-[#2A3549]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search - desktop only */}
            <div className="hidden md:flex items-center relative w-72">
              <Search className="absolute left-3 w-4 h-4 text-[#DBC1BB]" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#030E21] text-on-surface text-sm placeholder:text-[rgba(219,193,187,0.50)] border-none focus:outline-none focus:ring-2 focus:ring-brand-turquoise/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ARTICLES.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Salary Guide Download Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="relative rounded-3xl bg-[#1F2A3E] overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-[#101C2F]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-12">
            <div className="flex flex-col gap-6 max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold text-[#D7E3FD] leading-tight font-[var(--font-playfair)]">
                Guía de salarios IT en El Salvador 2025
              </h2>
              <p className="text-[#DBC1BB] text-base md:text-lg leading-relaxed">
                Accede a datos reales y actualizados sobre bandas salariales, beneficios y 
                tendencias de compensación en el mercado tecnológico salvadoreño.
              </p>
              <button className="flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-[#D7E3FD] text-[#071326] font-bold w-fit hover:opacity-90 active:scale-95 transition-all">
                <Download className="w-5 h-5" />
                Descargar guía
              </button>
            </div>

            {/* Guide preview card */}
            <div className="flex-shrink-0 p-6 rounded-2xl border border-[rgba(85,67,62,0.20)] bg-[#2E394E] shadow-2xl w-72 h-96 flex flex-col">
              <div className="flex-1 flex items-center justify-center rounded-lg">
                <BarChart3 className="w-12 h-14 text-brand-turquoise" />
              </div>
              <div className="flex flex-col gap-4 pb-18">
                <div className="h-2 rounded bg-[rgba(215,227,253,0.20)] w-[70%]" />
                <div className="h-2 rounded bg-[rgba(215,227,253,0.10)] w-full" />
                <div className="h-2 rounded bg-[rgba(215,227,253,0.10)] w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Content Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-32 border-t border-[rgba(85,67,62,0.10)]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#D7E3FD] leading-tight font-[var(--font-playfair)]">
              Contenido Curado para Mentes Ambiciosas
            </h2>
            <p className="text-[#DBC1BB] text-base md:text-lg leading-relaxed">
              Nuestra misión es eliminar el ruido del mercado laboral tradicional. Cada recurso en 
              Talentify SV es seleccionado por expertos en reclutamiento técnico y editorial.
            </p>

            <div className="flex flex-col gap-6 pt-2">
              {CURATED_FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[#D7E3FD] font-bold">{feature.title}</h3>
                    <p className="text-[#DBC1BB] text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image placeholder */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-turquoise/20 to-brand-coral/10 aspect-square lg:aspect-auto lg:h-[500px] flex items-center justify-center">
            <Users className="w-24 h-24 text-brand-turquoise/30" />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#101C2F] py-16 md:py-32">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#D7E3FD] mb-6 font-[var(--font-playfair)]">
            Mantente Curado.
          </h2>
          <p className="text-[#DBC1BB] text-base md:text-lg mb-8">
            Únete a más de 25,000 profesionales suscritos a nuestra dosis semanal de 
            inteligencia laboral y oportunidades de alto nivel.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 p-2 rounded-2xl bg-[#142033] shadow-xl max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico profesional"
              className="flex-1 px-6 py-4 bg-transparent text-on-surface placeholder:text-[rgba(219,193,187,0.40)] focus:outline-none"
            />
            <button className="px-8 md:px-10 py-4 rounded-xl bg-brand-turquoise text-white font-bold hover:opacity-90 active:scale-95 transition-all">
              Suscribirme
            </button>
          </div>

          <p className="text-[rgba(219,193,187,0.50)] text-xs mt-4">
            Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </section>

      {/* Mobile Newsletter Card - shown only on mobile, positioned differently */}
      <section className="md:hidden px-6 -mt-8 mb-8">
        <div className="relative p-8 rounded-3xl border border-brand-turquoise/10 bg-[#1F2A3E] overflow-hidden">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-brand-coral/10" />
          
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <Mail className="w-8 h-8 text-brand-turquoise" />
            <h3 className="text-2xl font-bold text-[#D7E3FD] font-[var(--font-plus-jakarta)] pt-2">
              Curaduría Semanal
            </h3>
            <p className="text-[#DBC1BB] text-sm">
              Recibe los mejores recursos y ofertas de trabajo directamente en tu bandeja de entrada.
            </p>

            <div className="flex flex-col gap-3 w-full pt-4">
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[rgba(85,67,62,0.20)] bg-[#030E21] text-on-surface placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise/50"
              />
              <button className="w-full py-3 rounded-xl bg-brand-turquoise text-[#003229] font-bold hover:opacity-90 active:scale-95 transition-all">
                Suscribirme
              </button>
            </div>

            <p className="text-[#A38C87] text-[10px] pt-2">
              Sin spam. Solo excelencia editorial.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
