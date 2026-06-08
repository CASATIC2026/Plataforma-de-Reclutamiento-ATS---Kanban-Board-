import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Ban,
  Briefcase,
  FileWarning,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  UserSearch,
} from 'lucide-react';
import LegalSidebar from './LegalSidebar';
import TerminosSectionHeading from './TerminosSectionHeading';
import {
  CUENTAS_REGLAS,
  LEGAL_EMAIL,
  SERVICIO_ROLES,
  TERMINOS_NAV,
  TERMINOS_UPDATED,
  USO_PROHIBIDO,
} from '../../data/terminosContent';

const ROLE_ICONS = [Briefcase, UserSearch];
const PROHIBITED_ICONS = [Ban, Mail, FileWarning];

function MobileSection({ number, title, children, hidden }) {
  if (hidden) return null;

  return (
    <section className="relative pl-8 border-l border-[rgba(85,67,62,0.15)] flex flex-col gap-4 lg:hidden">
      <span className="absolute -left-3 top-1 flex items-center justify-center w-6 h-6 rounded-full border border-[rgba(85,67,62,0.15)] bg-[#1F2A3E] text-[#6AD9C0] text-[10px] font-bold">
        {String(number).padStart(2, '0')}
      </span>
      <TerminosSectionHeading number={number} title={title} compact />
      {children}
    </section>
  );
}

function DesktopSection({ id, number, title, children, sectionRef, hidden }) {
  if (hidden) return null;

  return (
    <section
      id={id}
      ref={sectionRef}
      className="hidden lg:flex flex-col gap-6 md:gap-8 scroll-mt-28"
    >
      <TerminosSectionHeading number={number} title={title} />
      {children}
    </section>
  );
}

export default function TerminosContent() {
  const [activeId, setActiveId] = useState(TERMINOS_NAV[0].id);
  const [search, setSearch] = useState('');
  const sectionRefs = useRef({});

  const query = search.trim().toLowerCase();

  const matchesSearch = (keywords) => {
    if (!query) return true;
    return keywords.toLowerCase().includes(query);
  };

  const visibility = useMemo(
    () => ({
      aceptacion: matchesSearch('aceptación términos condiciones plataforma'),
      descripcion: matchesSearch('descripción servicio ats bolsa empleo salvador empresas candidatos'),
      cuentas: matchesSearch('cuentas usuario credenciales perfiles identidad suspender'),
      uso: matchesSearch('uso permitido prohibido scraping spam fraude'),
      vacantes: matchesSearch('vacantes postulaciones empresas candidatos legislación laboral'),
      propiedad: matchesSearch('propiedad intelectual software logotipos marcas'),
      responsabilidad: matchesSearch('limitación responsabilidad disponibilidad contratación'),
      modificaciones: matchesSearch('modificaciones servicio funciones precios'),
      ley: matchesSearch('ley aplicable jurisdicción el salvador san salvador'),
      contacto: matchesSearch('contacto soporte legal dudas términos'),
    }),
    [query],
  );

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  useEffect(() => {
    const ids = TERMINOS_NAV.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    ids.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const anyVisible = Object.values(visibility).some(Boolean);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero */}
      <header className="pb-8 md:pb-12 mb-8 md:mb-12">
        <span className="inline-flex md:hidden py-1 px-3 rounded-full border border-[rgba(106,217,192,0.20)] bg-[rgba(106,217,192,0.10)] text-[#6AD9C0] text-[10px] font-bold tracking-[0.1em] uppercase mb-4">
          Documento oficial
        </span>
        <span className="hidden md:inline-flex py-1 px-4 rounded-full bg-[#1F2A3E] text-[#056C70] text-sm font-semibold tracking-wide mb-6">
          Legal & Privacidad
        </span>

        <h1 className="font-display text-4xl md:text-7xl font-extrabold text-[#FFB4A3] md:text-[#056C70] tracking-tight leading-tight mb-4">
          <span className="md:hidden">Términos y Condiciones</span>
          <span className="hidden md:inline">Términos y Condiciones de Uso</span>
        </h1>

        <p className="text-[#DBC1BB] md:text-[#D7E3FD] text-sm md:text-lg font-medium leading-relaxed max-w-2xl">
          <span className="md:hidden">
            Última actualización: {TERMINOS_UPDATED}. Por favor lea detenidamente estos términos antes de
            utilizar los servicios de Talentify SV.
          </span>
          <span className="hidden md:inline">Última actualización: {TERMINOS_UPDATED}</span>
        </p>

        {/* Mobile search */}
        <div className="mt-8 lg:hidden relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#DBC1BB]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cláusula específica..."
            className="w-full rounded-lg bg-[#030E21] border border-[rgba(85,67,62,0.15)] py-4 pl-12 pr-4 text-sm text-[#D7E3FD] placeholder:text-[rgba(219,193,187,0.50)] outline-none focus:border-brand-turquoise/40"
            aria-label="Buscar en términos y condiciones"
          />
        </div>
      </header>

      {!anyVisible && query && (
        <p className="text-[#DBC1BB] text-center py-12 lg:hidden">
          No encontramos cláusulas que coincidan con &quot;{search}&quot;.
        </p>
      )}

      <div className="flex gap-12 xl:gap-16 items-start">
        <LegalSidebar
          nav={TERMINOS_NAV}
          activeId={activeId}
          onNavigate={scrollToSection}
          variant="terms"
          ariaLabel="Secciones de términos y condiciones"
        />

        <div className="flex-1 min-w-0 flex flex-col gap-12 lg:gap-20">
          {/* 01 Aceptación — mobile */}
          <MobileSection number={1} title="Aceptación de los Términos" hidden={!visibility.aceptacion}>
            <p className="text-[#D7E3FD] text-sm leading-relaxed">
              Al acceder y utilizar el sitio web y los servicios de Talentify SV, usted reconoce que ha leído,
              comprendido y aceptado estar sujeto a los presentes Términos y Condiciones.
            </p>
            <p className="text-[#DBC1BB] text-sm leading-relaxed">
              Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de utilizar
              nuestra plataforma de inmediato. El uso continuado del sitio tras cualquier modificación
              constituirá su aceptación de los nuevos términos.
            </p>
          </MobileSection>

          <DesktopSection
            id="aceptacion"
            number={1}
            title="Aceptación de los Términos"
            sectionRef={setSectionRef('aceptacion')}
            hidden={!visibility.aceptacion}
          >
            <div className="p-8 flex flex-col gap-4 rounded-xl border-l-4 border-l-[#056C70] bg-[#101C2F]">
              <p className="text-[#D7E3FD] text-lg leading-relaxed">
                Al acceder y utilizar el sitio web y los servicios de Talentify SV, usted reconoce que ha leído,
                comprendido y aceptado estar sujeto a los presentes Términos y Condiciones.
              </p>
              <p className="text-[#DBC1BB] text-lg leading-relaxed">
                Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de utilizar
                nuestra plataforma de inmediato. El uso continuado del sitio tras cualquier modificación
                constituirá su aceptación de los nuevos términos.
              </p>
            </div>
          </DesktopSection>

          {/* 02 Descripción */}
          <MobileSection number={2} title="Descripción del Servicio" hidden={!visibility.descripcion}>
            <div className="p-6 rounded-xl bg-[#101C2F] flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[rgba(255,180,163,0.05)] pointer-events-none" />
              <p className="text-[#DBC1BB] text-sm leading-relaxed relative z-10">
                Talentify SV opera como una plataforma digital de vanguardia que integra un Sistema de
                Seguimiento de Candidatos (ATS) y una bolsa de empleo premium diseñada específicamente para el
                ecosistema profesional de El Salvador.
              </p>
              {SERVICIO_ROLES.map(({ title, description }, i) => {
                const Icon = ROLE_ICONS[i];
                return (
                  <div key={title} className="flex items-start gap-3 relative z-10">
                    <Icon className="w-4 h-4 text-brand-turquoise shrink-0 mt-0.5" />
                    <p className="text-[#D7E3FD] text-sm leading-relaxed">
                      <span className="font-bold">{title}</span> — {description}
                    </p>
                  </div>
                );
              })}
            </div>
          </MobileSection>

          <DesktopSection
            id="descripcion"
            number={2}
            title="Descripción del Servicio"
            sectionRef={setSectionRef('descripcion')}
            hidden={!visibility.descripcion}
          >
            <p className="text-[#DBC1BB] text-lg leading-relaxed">
              Talentify SV opera como una plataforma digital de vanguardia que integra un Sistema de
              Seguimiento de Candidatos (ATS) y una bolsa de empleo premium diseñada específicamente para el
              ecosistema profesional de El Salvador.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {SERVICIO_ROLES.map(({ title, description }, i) => {
                const Icon = ROLE_ICONS[i];
                return (
                  <div
                    key={title}
                    className="p-6 rounded-lg border border-[rgba(85,67,62,0.10)] bg-[#142033] flex flex-col gap-2"
                  >
                    <Icon className="w-5 h-5 text-[#056C70]" />
                    <p className="text-[#D7E3FD] text-xl font-bold">{title}</p>
                    <p className="text-[#DBC1BB] text-sm leading-relaxed">{description}</p>
                  </div>
                );
              })}
            </div>
          </DesktopSection>

          {/* 03 Cuentas */}
          <MobileSection number={3} title="Cuentas de Usuario" hidden={!visibility.cuentas}>
            <p className="text-[#DBC1BB] text-sm leading-relaxed">
              Para acceder a ciertas funcionalidades, el usuario debe crear una cuenta proporcionando
              información veraz, exacta y actualizada. Usted es el único responsable de la seguridad de sus
              credenciales de acceso.
            </p>
            <div className="p-4 rounded-lg border border-[rgba(85,67,62,0.30)] bg-[#030E21]">
              <p className="text-[#DBC1BB] text-sm leading-relaxed">
                {CUENTAS_REGLAS.join(' ')}
              </p>
            </div>
          </MobileSection>

          <DesktopSection
            id="cuentas"
            number={3}
            title="Cuentas de Usuario"
            sectionRef={setSectionRef('cuentas')}
            hidden={!visibility.cuentas}
          >
            <p className="text-[#DBC1BB] text-lg leading-relaxed">
              Para acceder a ciertas funcionalidades, el usuario debe crear una cuenta proporcionando
              información veraz, exacta y actualizada. Usted es el único responsable de la seguridad de sus
              credenciales de acceso.
            </p>
            <ul className="flex flex-col gap-4">
              {CUENTAS_REGLAS.map((rule, i) => (
                <li key={rule} className="flex items-start gap-4">
                  {i === 0 ? (
                    <ShieldCheck className="w-4 h-5 text-[#056C70] shrink-0" />
                  ) : (
                    <Lock className="w-4 h-5 text-[#056C70] shrink-0" />
                  )}
                  <span className="text-[#DBC1BB] text-base leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </DesktopSection>

          {/* 04 Uso */}
          <MobileSection number={4} title="Uso Permitido y Prohibido" hidden={!visibility.uso}>
            <p className="text-[#DBC1BB] text-sm leading-relaxed">
              La plataforma debe ser utilizada exclusivamente con fines profesionales de reclutamiento y
              búsqueda de empleo. Queda estrictamente prohibido:
            </p>
            {USO_PROHIBIDO.map((item, i) => {
              const Icon = PROHIBITED_ICONS[i];
              return (
                <div
                  key={item}
                  className="flex p-4 items-start gap-4 rounded-lg border-l-2 border-l-red-400/50 bg-[rgba(31,42,62,0.50)]"
                >
                  <Icon className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-[#DBC1BB] text-sm leading-relaxed">{item}</p>
                </div>
              );
            })}
          </MobileSection>

          <DesktopSection
            id="uso"
            number={4}
            title="Uso Permitido y Prohibido"
            sectionRef={setSectionRef('uso')}
            hidden={!visibility.uso}
          >
            <p className="text-[#DBC1BB] text-lg leading-relaxed">
              La plataforma debe ser utilizada exclusivamente con fines profesionales de reclutamiento y
              búsqueda de empleo. Queda estrictamente prohibido:
            </p>
            <div className="flex flex-col gap-4">
              {USO_PROHIBIDO.map((item, i) => {
                const Icon = PROHIBITED_ICONS[i];
                return (
                  <div
                    key={item}
                    className="flex p-4 items-center gap-4 rounded-lg border-l-2 border-l-red-400/50 bg-[rgba(31,42,62,0.50)]"
                  >
                    <Icon className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-[#DBC1BB] text-base leading-relaxed">{item}</p>
                  </div>
                );
              })}
            </div>
          </DesktopSection>

          {/* 05–09 — shared desktop + simple mobile blocks */}
          {[
            {
              id: 'vacantes',
              num: 5,
              title: 'Contenido de Vacantes y Postulaciones',
              body: 'Las empresas son las únicas responsables por el contenido de las vacantes publicadas, garantizando que cumplen con la legislación laboral vigente en El Salvador. Los candidatos, por su parte, garantizan la veracidad de su experiencia y formación académica en sus postulaciones.',
              keywords: 'vacantes postulaciones',
            },
            {
              id: 'propiedad',
              num: 6,
              title: 'Propiedad Intelectual',
              body: 'Todo el software, logotipos, marcas, diseños de interfaz y contenido presente en el sitio son propiedad exclusiva de Talentify SV. Queda prohibida la reproducción total o parcial sin consentimiento expreso.',
              keywords: 'propiedad intelectual',
              light: true,
            },
            {
              id: 'responsabilidad',
              num: 7,
              title: 'Limitación de Responsabilidad',
              body: 'El servicio se proporciona "tal cual" y "según disponibilidad". Talentify SV no garantiza la contratación efectiva de ningún candidato ni la idoneidad de los postulantes para las empresas. No somos responsables por interrupciones técnicas ajenas a nuestro control.',
              keywords: 'responsabilidad',
            },
            {
              id: 'modificaciones',
              num: 8,
              title: 'Modificaciones del Servicio',
              body: 'Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio, incluyendo funciones premium y estructuras de precios, notificando a los usuarios con una antelación razonable a través de la plataforma o correo electrónico.',
              keywords: 'modificaciones',
            },
            {
              id: 'ley',
              num: 9,
              title: 'Ley Aplicable y Jurisdicción',
              body: 'Estos términos se rigen e interpretan de acuerdo con las leyes de la República de El Salvador. Cualquier disputa será resuelta ante los tribunales competentes de la ciudad de San Salvador.',
              keywords: 'ley jurisdicción',
              light: true,
            },
          ].map(({ id, num, title, body, light }) =>
            visibility[id] ? (
              <div key={id}>
                <MobileSection number={num} title={title}>
                  <p className={`text-sm leading-relaxed ${light ? 'text-[#D7E3FD]' : 'text-[#DBC1BB]'}`}>
                    {body}
                  </p>
                </MobileSection>
                <DesktopSection id={id} number={num} title={title} sectionRef={setSectionRef(id)}>
                  <p
                    className={`text-lg leading-relaxed ${light ? 'text-[#D7E3FD]' : 'text-[#DBC1BB]'}`}
                  >
                    {body}
                  </p>
                </DesktopSection>
              </div>
            ) : null,
          )}

          {/* 10 Contacto */}
          <MobileSection number={10} title="Contacto" hidden={!visibility.contacto}>
            <div className="p-8 rounded-xl bg-[rgba(143,160,181,0.04)] border border-[rgba(85,67,62,0.10)] flex flex-col items-center gap-4 text-center">
              <p className="text-[#F2F2F7] text-xl font-extrabold font-display">¿Dudas Legales?</p>
              <p className="text-[#F2F2F7] text-sm">
                Si tienes preguntas sobre nuestros términos, nuestro equipo legal está listo para ayudarte.
              </p>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-3 py-4 px-8 rounded-xl bg-[#056C70] text-white font-bold text-base"
              >
                Contactar soporte
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-center text-[rgba(219,193,187,0.40)] text-[10px] font-bold tracking-[0.1em] uppercase">
              © 2026 Talentify SV. Todos los derechos reservados.
            </p>
          </MobileSection>

          <section
            id="contacto"
            ref={setSectionRef('contacto')}
            className={`scroll-mt-28 ${visibility.contacto ? '' : 'hidden'} hidden lg:block`}
          >
            <TerminosSectionHeading number={10} title="Contacto" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-10 rounded-xl bg-[#2E394E]">
              <div>
                <p className="text-[#D7E3FD] text-2xl font-bold mb-2">¿Dudas sobre estos términos?</p>
                <p className="text-[#DBC1BB] text-base">
                  Nuestro equipo legal está disponible para resolver sus inquietudes.
                </p>
              </div>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-[#056C70] text-white font-bold hover:opacity-90 transition-opacity shrink-0"
              >
                Contactar soporte
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-[#DBC1BB]">
              También puede escribir a{' '}
              <a href={`mailto:${LEGAL_EMAIL}`} className="text-[#6AD9C0] hover:underline">
                {LEGAL_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
