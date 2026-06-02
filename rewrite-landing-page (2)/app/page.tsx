"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { JobDetailModal } from "@/components/JobDetailModal";
import Footer from "@/components/Footer";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Rocket,
  Shield,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cloud,
  ShieldCheck,
  Brain,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  Code,
  Menu,
  X,
} from "lucide-react";
import { mockVacantes, mockStats, CONTRACT_FILTERS, type Vacante } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 9;

const iconMap: Record<string, React.ReactNode> = {
  rocket_launch: <Rocket className="w-6 h-6 md:w-7 md:h-7" />,
  shield: <Shield className="w-6 h-6 md:w-7 md:h-7" />,
  brush: <Palette className="w-6 h-6 md:w-7 md:h-7" />,
  database: <Database className="w-6 h-6 md:w-7 md:h-7" />,
  smartphone: <Smartphone className="w-6 h-6 md:w-7 md:h-7" />,
  analytics: <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />,
  cloud: <Cloud className="w-6 h-6 md:w-7 md:h-7" />,
  verified_user: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />,
  psychology: <Brain className="w-6 h-6 md:w-7 md:h-7" />,
};

function formatSalary(min: number, max: number) {
  return `$${min.toLocaleString("en-US")} - $${max.toLocaleString("en-US")}`;
}

function isRecent(dateString: string) {
  return new Date().getTime() - new Date(dateString).getTime() < 2 * 24 * 60 * 60 * 1000;
}

// ─── Hamburger Sheet ──────────────────────────────────────────────────────────
function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
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
            { label: "Inicio", href: "/", active: true },
            { label: "Empresas", href: "/empresas", active: false },
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

        {/* Auth buttons */}
        <div className="mt-auto flex flex-col gap-2 sm:gap-3 px-4 sm:px-6 pb-6 sm:pb-10 flex-shrink-0">
          <Link href="/auth/login" className="w-full py-2.5 sm:py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold text-xs sm:text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all text-center">
            Iniciar sesión
          </Link>
          <Link href="/register" className="w-full py-2.5 sm:py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-xs sm:text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all text-center">
            Registrarse
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <header className="bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 w-full h-16 md:h-20 shadow-[0_12px_32px_rgba(3,14,33,0.5)]">
        <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto h-full">
          {/* Logo */}
          <div className="text-lg md:text-xl font-extrabold tracking-tighter text-slate-100 font-[var(--font-plus-jakarta)]">
            Talentify SV
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-brand-turquoise font-bold border-b-2 border-brand-turquoise pb-1 font-[var(--font-plus-jakarta)] tracking-tight hover:scale-105 transition-all duration-300" href="/">
              Inicio
            </Link>
            <Link className="text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight hover:text-brand-turquoise hover:scale-105 transition-all duration-300" href="/empresas">
              Empresas
            </Link>
            <Link className="text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight hover:text-brand-turquoise hover:scale-105 transition-all duration-300" href="/recursos">
              Recursos
            </Link>
          </nav>

          {/* Desktop auth + Mobile hamburger */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/auth/login" className="hidden md:block text-slate-300 font-medium font-[var(--font-plus-jakarta)] tracking-tight px-4 py-2 hover:text-brand-turquoise transition-all duration-300 active:scale-95">
              Iniciar sesión
            </Link>
            <Link href="/register" className="hidden md:block bg-brand-turquoise text-on-brand-turquoise font-bold px-6 py-2.5 rounded-xl font-[var(--font-plus-jakarta)] tracking-tight hover:scale-105 transition-all duration-300 active:scale-95 shadow-lg shadow-brand-turquoise/20">
              Registrarse
            </Link>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSheetOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearch,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  locationQuery: string;
  setLocationQuery: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <section className="relative pt-10 md:pt-24 pb-10 md:pb-32 overflow-hidden px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

        {/* Copy column */}
        <div className="lg:col-span-7 z-10">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/50 border border-outline-variant/15 mb-5 md:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-on-surface-variant">
              {mockStats.newVacantesThisWeek} Nuevas vacantes esta semana
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.25rem] leading-[1] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-on-surface mb-4 md:mb-8 font-[var(--font-plus-jakarta)]">
            El futuro del{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-turquoise to-tertiary">
              talento IT
            </span>{" "}
            está aquí
          </h1>

          {/* Subtitle — hide in portrait landscape to save height */}
          <p className="hidden landscape:hidden md:block text-base md:text-xl text-on-surface-variant leading-relaxed mb-6 md:mb-12 max-w-xl font-light">
            Conectamos a la élite tecnológica de El Salvador con las empresas
            globales más disruptivas. Tu próximo gran salto profesional comienza
            con una curaduría de excelencia.
          </p>
          {/* Short version always visible on portrait mobile */}
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6 md:hidden landscape:hidden">
            Conectamos élite tecnológica con empresas globales disruptivas.
          </p>

          {/* Search bar — stacked on mobile, row on md+ */}
          <div className="p-2 bg-surface-container-low/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-outline-variant/15 shadow-2xl">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              {/* Keyword input */}
              <div className="flex items-center px-4 md:px-6 gap-3 bg-transparent">
                <Search className="w-5 h-5 text-brand-turquoise flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 py-3 font-medium text-sm md:text-base"
                  placeholder="Puesto, empresa o palabra clave"
                />
              </div>

              {/* Divider: horizontal on mobile, vertical on md+ */}
              <div className="block md:hidden h-px w-full bg-outline-variant/15 mx-0"></div>
              <div className="hidden md:block w-px h-10 bg-outline-variant/20 flex-shrink-0"></div>

              {/* Location input */}
              <div className="flex items-center px-4 md:px-6 gap-3 bg-transparent">
                <MapPin className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 py-3 font-medium text-sm md:text-base"
                  placeholder="Ubicación"
                />
              </div>

              {/* Buscar — full-width on mobile */}
              <button
                onClick={onSearch}
                className="w-full md:w-auto bg-brand-turquoise text-on-brand-turquoise font-bold px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-[1.5rem] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-brand-turquoise/25 text-sm md:text-base"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Hero image — shown below copy on mobile portrait, hidden in landscape <768px */}
          <div className="mt-6 rounded-2xl overflow-hidden aspect-video relative md:hidden landscape:hidden">
            <img
              className="w-full h-full object-cover object-top"
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=450&fit=crop&crop=faces"
              alt="Profesional tecnológico trabajando"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Hero image — desktop only */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl border border-outline-variant/15">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=750&fit=crop&crop=faces"
              alt="Profesional tecnológico trabajando"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>

          {/* Floating Stats Badge */}
          <div className="absolute -bottom-6 -left-12 p-6 bg-surface-container-highest backdrop-blur-md rounded-3xl border border-outline-variant/15 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-turquoise flex items-center justify-center">
                <Code className="w-6 h-6 text-on-brand-turquoise" />
              </div>
              <div>
                <div className="text-sm text-on-surface-variant font-medium">Salario promedio</div>
                <div className="text-xl font-bold text-on-surface">
                  ${mockStats.averageSalary.toLocaleString()}/mes
                </div>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                  src={`https://i.pravatar.cc/80?img=${i + 10}`}
                  alt={`Usuario ${i}`}
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface">
                +{(mockStats.totalCandidates / 1000).toFixed(0)}k
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────���──��─────
// Mobile: horizontal scroll, no-wrap. Desktop: flex-wrap with label.
function FilterBar({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (v: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-16">
      {/* Desktop label row */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        <span className="text-on-surface-variant font-medium mr-2">
          Filtros rápidos:
        </span>
        {CONTRACT_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeFilter === filter.key
                ? "bg-brand-turquoise text-on-brand-turquoise border border-transparent shadow-lg shadow-brand-turquoise/20"
                : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 text-brand-turquoise font-bold hover:gap-3 transition-all">
          <span>Todos los filtros</span>
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile: horizontal scroll strip, no wrap */}
      <div
        ref={scrollRef}
        className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {CONTRACT_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-semibold text-xs transition-all ${
              activeFilter === filter.key
                ? "bg-brand-turquoise text-on-brand-turquoise border border-transparent shadow-lg shadow-brand-turquoise/20"
                : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
        {/* Filters icon pinned at end */}
        <button
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/10 bg-surface-container-high text-brand-turquoise ml-1"
          aria-label="Todos los filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onViewDetails }: { job: Vacante; onViewDetails: (job: Vacante) => void }) {
  const icon = job.icon ? iconMap[job.icon] : <Rocket className="w-6 h-6 md:w-7 md:h-7" />;
  const badgeType = job.badge || (isRecent(job.createdAt) ? "new" : null);

  return (
    <button
      onClick={() => onViewDetails(job)}
      className="group bg-surface-container-low hover:bg-surface-container p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-outline-variant/5 hover:border-brand-turquoise/30 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 flex flex-col h-full w-full text-left"
    >
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className="w-11 h-11 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-surface-bright flex items-center justify-center border border-outline-variant/10 shrink-0 text-brand-turquoise">
          {icon}
        </div>
        {badgeType && (
          <span
            className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
              badgeType === "urgent"
                ? "bg-error-container/20 text-error border border-error/20"
                : "bg-tertiary/10 text-tertiary border border-tertiary/20"
            }`}
          >
            <span className={`w-1 h-1 rounded-full ${badgeType === "urgent" ? "bg-error" : "bg-tertiary"}`}></span>
            {badgeType === "urgent" ? "Urgente" : "Nuevo"}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-base md:text-xl font-bold text-on-surface group-hover:text-brand-turquoise transition-colors mb-2 line-clamp-2">
          {job.titulo}
        </h3>
        <div className="flex items-center gap-2 text-on-surface-variant font-medium text-xs md:text-sm mb-3 md:mb-4">
          <Building2 className="w-4 h-4" />
          <span>{job.company}</span>
        </div>
        <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs md:text-sm font-light">
            <MapPin className="w-4 h-4 opacity-60" />
            <span>{job.ubicacion}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-turquoise font-bold text-xs md:text-sm">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary(job.salarioMin, job.salarioMax)}</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-surface-container-highest text-on-surface font-bold py-3 md:py-3.5 rounded-xl group-hover:bg-brand-turquoise group-hover:text-on-brand-turquoise transition-all text-xs md:text-sm text-center">
        Ver detalles
      </div>
    </button>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = useMemo(() => {
    const result: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      if (currentPage > 3) result.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        result.push(i);
      }
      if (currentPage < totalPages - 2) result.push("...");
      result.push(totalPages);
    }
    return result;
  }, [currentPage, totalPages]);

  return (
    <div className="mt-8 md:mt-16 flex justify-center items-center gap-1 md:gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <div className="flex gap-1 md:gap-2">
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-on-surface-variant/50 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 md:w-12 md:h-12 rounded-xl font-bold transition-all text-sm ${
                currentPage === page
                  ? "bg-brand-turquoise text-on-brand-turquoise shadow-lg shadow-brand-turquoise/20"
                  : "bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedJob, setSelectedJob] = useState<Vacante | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const location = locationQuery.toLowerCase().trim();

    return mockVacantes.filter((job) => {
      if (!job.estaActiva) return false;

      let matchFilter = true;
      if (activeFilter === "Remoto") {
        matchFilter =
          job.tipoContrato.toLowerCase().includes("remoto") ||
          job.ubicacion.toLowerCase().includes("remoto");
      } else if (activeFilter === "Tiempo completo") {
        matchFilter = job.tipoContrato === "Tiempo completo";
      } else if (activeFilter === "Senior") {
        matchFilter =
          job.titulo.toLowerCase().includes("senior") ||
          job.titulo.toLowerCase().includes("líder");
      } else if (activeFilter === "Junior") {
        matchFilter = job.titulo.toLowerCase().includes("junior");
      } else if (activeFilter === "Diseño UX") {
        matchFilter =
          job.titulo.toLowerCase().includes("diseño") ||
          job.titulo.toLowerCase().includes("ux") ||
          job.titulo.toLowerCase().includes("ui");
      }

      const matchSearch =
        !query ||
        job.titulo.toLowerCase().includes(query) ||
        job.descripcion.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.requisitos.some((r) => r.toLowerCase().includes(query));

      const matchLocation =
        !location || job.ubicacion.toLowerCase().includes(location);

      return matchFilter && matchSearch && matchLocation;
    });
  }, [searchQuery, locationQuery, activeFilter]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery, activeFilter]);

  const handleSearch = () => {
    document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          onSearch={handleSearch}
        />

        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Job Listings */}
        <section id="jobs-section" className="max-w-7xl mx-auto px-4 md:px-8 pb-8 md:pb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 md:mb-12 gap-4">
            <div>
              <h2 className="text-xl md:text-4xl font-extrabold tracking-tight text-on-surface font-[var(--font-plus-jakarta)]">
                Oportunidades destacadas
              </h2>
              <p className="text-on-surface-variant mt-1 md:mt-2 font-light text-sm md:text-base">
                Seleccionadas cuidadosamente por nuestro equipo de expertos.
              </p>
            </div>
            {/* View toggle — hidden on mobile, both modes always single-col anyway */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                  viewMode === "grid"
                    ? "bg-surface-container-high text-brand-turquoise border border-outline-variant/20"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                  viewMode === "list"
                    ? "bg-surface-container-high text-brand-turquoise border border-outline-variant/20"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p className="text-on-surface-variant text-base md:text-lg">
                No se encontraron vacantes con los filtros seleccionados.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLocationQuery("");
                  setActiveFilter("Todos");
                }}
                className="mt-4 text-brand-turquoise font-bold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              {/* Mobile: always single column. sm+: 2-col. lg+: 3-col (or 1-col list) */}
              <div
                className={`grid gap-4 md:gap-6 grid-cols-1 ${
                  viewMode === "grid"
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-1"
                }`}
              >
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={(job) => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}

              <div className="mt-8 md:mt-12 flex justify-center">
                <button className="group flex items-center gap-3 text-base md:text-lg font-bold text-on-surface hover:text-brand-turquoise transition-all">
                  Explorar todas las vacantes
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedJob(null), 300);
        }}
      />

      <Footer />
    </div>
  );
}
