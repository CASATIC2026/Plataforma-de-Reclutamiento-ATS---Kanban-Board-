import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  LayoutGrid,
  Mail,
} from 'lucide-react';
import LegalSectionHeading from './LegalSectionHeading';
import LegalSidebar from './LegalSidebar';
import {
  BASES_LEGALES,
  CANDIDATO_DATOS,
  DERECHOS_TITULAR,
  EMPRESA_DATOS,
  FINALIDADES,
  PRIVACY_EMAIL,
  PRIVACY_NAV,
  PRIVACY_UPDATED,
  PROVEEDORES,
} from '../../data/privacidadContent';

const PURPOSE_ICONS = [LayoutGrid, BarChart3, Mail];

function DataList({ items }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-brand-turquoise shrink-0 mt-0.5" strokeWidth={2} />
          <span className="text-[#DBC1BB] text-sm md:text-base leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DataCard({ label, items }) {
  return (
    <div className="p-6 md:p-8 rounded-xl border border-[rgba(85,67,62,0.05)] bg-[#101C2F] flex flex-col gap-4 h-full">
      <p className="text-[#FFB4A3] text-xs font-bold tracking-[0.05em] uppercase">{label}</p>
      <DataList items={items} />
    </div>
  );
}

export default function PrivacidadContent() {
  const [activeId, setActiveId] = useState(PRIVACY_NAV[0].id);
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  useEffect(() => {
    const ids = PRIVACY_NAV.map((s) => s.id);
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

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero */}
      <header className="pb-8 md:pb-12 mb-8 md:mb-12 border-b border-[rgba(85,67,62,0.15)]">
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-7xl font-semibold text-[#D7E3FD] tracking-tight leading-tight mb-4 md:mb-6">
          Política de Privacidad
        </h1>
        <p className="text-[#DBC1BB] text-base font-light leading-relaxed mb-6 md:hidden max-w-lg">
          En Talentify SV, valoramos la confianza que depositas en nosotros al compartir tus datos. Esta
          política detalla cómo protegemos tu identidad digital en el mercado laboral moderno.
        </p>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <span className="text-[#DBC1BB] text-xs md:text-sm tracking-[0.1em] uppercase">
            Última actualización: {PRIVACY_UPDATED}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,180,163,0.40)]" aria-hidden />
          <span className="text-[#FFB4A3] text-xs md:text-sm font-bold tracking-[0.1em] uppercase">
            Talentify SV
          </span>
        </div>
      </header>

      <div className="flex gap-12 xl:gap-16 items-start">
        <LegalSidebar
          nav={PRIVACY_NAV}
          activeId={activeId}
          onNavigate={scrollToSection}
          ariaLabel="Secciones de la política de privacidad"
          variant="privacy"
        />

        <div className="flex-1 min-w-0 flex flex-col gap-16 md:gap-20 scroll-mt-28">
          {/* 01 Responsable */}
          <section
            id="responsable"
            ref={setSectionRef('responsable')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={1} title="Responsable del tratamiento" />
            <div className="flex flex-col gap-4 text-[#D7E3FD] md:text-lg font-light leading-relaxed">
              <p>
                El responsable del tratamiento de sus datos personales es Talentify SV, una plataforma
                dedicada a la gestión de talento y reclutamiento. Nos comprometemos a garantizar la seguridad
                y confidencialidad de la información que nos confía.
              </p>
              <p className="text-[#DBC1BB]">
                Para cualquier consulta relacionada con la privacidad o el ejercicio de sus derechos, puede
                contactar con nuestro Delegado de Protección de Datos a través del correo electrónico:{' '}
                <a
                  href={`mailto:${PRIVACY_EMAIL}`}
                  className="text-[#6AD9C0] border-b border-[rgba(106,217,192,0.30)] hover:text-brand-turquoise transition-colors"
                >
                  {PRIVACY_EMAIL}
                </a>
                .
              </p>
            </div>
          </section>

          {/* 02 Datos */}
          <section
            id="datos"
            ref={setSectionRef('datos')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={2} title="Datos que recopilamos" />
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <DataCard label="Para candidatos" items={CANDIDATO_DATOS} />
              <DataCard label="Para empresas" items={EMPRESA_DATOS} />
            </div>
          </section>

          {/* 03 Finalidad */}
          <section
            id="finalidad"
            ref={setSectionRef('finalidad')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={3} title="Finalidad del tratamiento" />
            <p className="text-[#DBC1BB] text-base md:text-lg leading-relaxed">
              Tratamos su información con las siguientes finalidades específicas:
            </p>
            <div className="flex flex-col gap-4">
              {FINALIDADES.map(({ title, description }, i) => {
                const Icon = PURPOSE_ICONS[i] ?? LayoutGrid;
                return (
                  <div
                    key={title}
                    className="flex p-6 items-start md:items-center gap-4 md:gap-6 rounded-lg bg-[#142033]"
                  >
                    <Icon className="w-7 h-7 text-[#FFB4A3]/50 shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-[#D7E3FD] text-lg font-bold mb-1">{title}</p>
                      <p className="text-[#DBC1BB] text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 04 Base legal */}
          <section
            id="base-legal"
            ref={setSectionRef('base-legal')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={4} title="Base legal" />
            <p className="text-[#DBC1BB] text-base leading-relaxed">
              El tratamiento de sus datos se realiza bajo las siguientes bases jurídicas:
            </p>
            <ul className="flex flex-col gap-3 pl-0 md:pl-6">
              {BASES_LEGALES.map(({ label, text }) => (
                <li key={label} className="text-[#DBC1BB] text-base leading-relaxed">
                  <span className="font-bold text-[#D7E3FD]">{label}:</span> {text}
                </li>
              ))}
            </ul>
          </section>

          {/* 05 Conservación */}
          <section
            id="conservacion"
            ref={setSectionRef('conservacion')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={5} title="Conservación" />
            <p className="text-[#DBC1BB] text-base leading-[26px]">
              Sus datos serán conservados mientras se mantenga la relación contractual o hasta que usted
              solicite su supresión. No obstante, conservaremos ciertos datos debidamente bloqueados durante
              los plazos legales de prescripción para atender posibles responsabilidades.
            </p>
          </section>

          {/* 06 Destinatarios */}
          <section
            id="destinatarios"
            ref={setSectionRef('destinatarios')}
            className="flex flex-col gap-6 scroll-mt-28"
          >
            <LegalSectionHeading number={6} title="Destinatarios y transferencias" />
            <p className="text-[#DBC1BB] text-base leading-relaxed">
              Contamos con proveedores de servicios de confianza que actúan como encargados del tratamiento,
              garantizando altos estándares de seguridad:
            </p>
            <div className="flex flex-wrap gap-3">
              {PROVEEDORES.map((name) => (
                <span
                  key={name}
                  className="py-2 px-4 rounded-full border border-[rgba(85,67,62,0.20)] bg-[rgba(42,53,73,0.50)] text-[#D7E3FD] text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </section>

          {/* 07 Derechos */}
          <section
            id="derechos"
            ref={setSectionRef('derechos')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={7} title="Derechos del titular" />
            <p className="text-[#DBC1BB] text-base leading-relaxed">
              Usted tiene el control total sobre su información personal.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {DERECHOS_TITULAR.map((right) => (
                <div
                  key={right}
                  className="p-4 md:p-6 flex flex-col gap-2 border-b-2 border-[rgba(255,180,163,0.20)] bg-[#101C2F] rounded-t-lg min-h-[88px]"
                >
                  <span className="w-5 h-5 rounded-full border-2 border-[#FFB4A3]/40" aria-hidden />
                  <p className="text-[#D7E3FD] text-xs font-bold tracking-wide">{right}</p>
                </div>
              ))}
            </div>
            <p className="text-[#DBC1BB] text-sm leading-relaxed">
              Para ejercer cualquiera de estos derechos, escríbenos a{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-[#6AD9C0] hover:underline">
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </section>

          {/* 08 Cookies */}
          <section
            id="cookies"
            ref={setSectionRef('cookies')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={8} title="Cookies" />
            <p className="text-[#DBC1BB] text-base leading-relaxed">
              Utilizamos cookies técnicas estrictamente necesarias para el funcionamiento de la web y cookies
              analíticas (con su consentimiento) para entender cómo interactúan los usuarios con nuestra
              plataforma y así mejorar su experiencia.
            </p>
          </section>

          {/* 09 Menores */}
          <section
            id="menores"
            ref={setSectionRef('menores')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={9} title="Menores" />
            <div className="flex p-6 items-start gap-4 rounded-xl border border-[rgba(147,0,10,0.20)] bg-[rgba(147,0,10,0.10)]">
              <AlertTriangle className="w-8 h-8 text-[#FFB4AB] shrink-0" />
              <p className="text-[#D7E3FD] text-sm leading-relaxed">
                Nuestros servicios están dirigidos exclusivamente a personas mayores de 18 años. No
                recopilamos conscientemente datos de menores de edad.
              </p>
            </div>
          </section>

          {/* 10 Cambios */}
          <section
            id="cambios"
            ref={setSectionRef('cambios')}
            className="flex flex-col gap-6 md:gap-8 scroll-mt-28"
          >
            <LegalSectionHeading number={10} title="Cambios" />
            <p className="text-[#DBC1BB] text-base leading-relaxed">
              Talentify SV se reserva el derecho de modificar esta política en cualquier momento. Notificaremos
              cambios significativos a través de un aviso destacado en nuestra web o mediante comunicación
              directa al email asociado a su cuenta.
            </p>
          </section>

          {/* Contacto CTA */}
          <section
            id="contacto"
            ref={setSectionRef('contacto')}
            className="pt-8 md:pt-12 border-t border-[rgba(85,67,62,0.10)] scroll-mt-28"
          >
            <div className="relative p-8 md:p-12 rounded-3xl bg-[#8FA0B5] overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-4 max-w-xl">
                <h2 className="font-editorial text-3xl md:text-4xl text-black leading-tight">
                  <span className="md:hidden">¿Tienes dudas?</span>
                  <span className="hidden md:inline">¿Dudas adicionales?</span>
                </h2>
                <p className="text-black/90 text-sm md:text-lg leading-relaxed">
                  <span className="md:hidden">
                    Nuestro Oficial de Privacidad está disponible para resolver cualquier inquietud sobre tus
                    datos.
                  </span>
                  <span className="hidden md:inline">
                    Nuestro equipo de soporte legal está disponible para resolver cualquier inquietud sobre el
                    tratamiento de tus datos.
                  </span>
                </p>
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-3 py-4 px-8 rounded-full bg-[#056C70] text-white font-bold text-base w-fit hover:opacity-90 transition-opacity"
                >
                  <span className="md:hidden">Contactar soporte</span>
                  <span className="hidden md:inline">Contactar ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <p className="text-center text-[#A38C87] text-[10px] font-medium tracking-[0.2em] uppercase mt-8 lg:hidden">
              Talentify SV · El Salvador 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
