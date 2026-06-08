import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BillingToggle from '../components/planes/BillingToggle';
import PricingCard from '../components/planes/PricingCard';
import FaqAccordion from '../components/planes/FaqAccordion';
import {
  PRICING_PLANS,
  PRICING_FAQ,
  MOBILE_FAQ,
} from '../data/planesContent';

export default function PreciosPage() {
  const [billing, setBilling] = useState('monthly');

  const starter = PRICING_PLANS.find((p) => p.id === 'starter');
  const growth = PRICING_PLANS.find((p) => p.id === 'growth');
  const enterprise = PRICING_PLANS.find((p) => p.id === 'enterprise');

  return (
    <div className="bg-[#071326] w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-12 md:pt-24 pb-8 md:pb-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-40 w-[min(800px,120vw)] h-[800px] rounded-full bg-[rgba(255,180,163,0.05)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#2A3549] text-[#6AD9C0] text-sm font-medium tracking-widest uppercase mb-6">
            Planes para empresas
          </span>

          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-center">
            <span className="bg-gradient-to-r from-[#FFB4A3] to-[#D97862] bg-clip-text text-transparent">
              Escala tu equipo
            </span>
            <span className="hidden md:inline text-[#D7E3FD]"> con el plan correcto</span>
          </h1>

          <p className="text-[#DBC1BB] text-base md:text-xl leading-relaxed max-w-2xl mx-auto opacity-90">
            <span className="md:hidden">
              Encuentra el talento perfecto con planes diseñados para cada etapa de crecimiento.
            </span>
            <span className="hidden md:inline">
              Precios transparentes para equipos en El Salvador — facturación mensual. Sin costos
              ocultos, solo talento excepcional.
            </span>
          </p>
        </div>
      </section>

      {/* Billing toggle */}
      <section className="px-4 md:px-8 pb-8 md:pb-12 flex justify-center">
        <div className="hidden md:block">
          <BillingToggle value={billing} onChange={setBilling} />
        </div>
        <div className="md:hidden">
          <BillingToggle value={billing} onChange={setBilling} compact />
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-4 md:px-8 pb-16 md:pb-24" id="planes">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: stacked — Growth second with highlight */}
          <div className="flex flex-col gap-6 md:hidden">
            <PricingCard plan={starter} billing={billing} compact />
            <PricingCard plan={growth} billing={billing} compact />
            <PricingCard plan={enterprise} billing={billing} compact />
          </div>

          {/* Desktop: 3-column, Growth elevated */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-stretch">
            <PricingCard plan={starter} billing={billing} />
            <PricingCard plan={growth} billing={billing} />
            <PricingCard plan={enterprise} billing={billing} />
          </div>

          <button
            type="button"
            className="hidden md:flex w-full justify-center items-center gap-2 mt-12 text-[#DBC1BB] font-medium hover:text-brand-turquoise transition-colors"
            onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
          >
            ¿Necesitas comparar detalles?
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-xl md:text-3xl font-extrabold text-[#D7E3FD] text-center mb-8 md:mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="md:hidden">
            <FaqAccordion items={MOBILE_FAQ} compact />
          </div>
          <div className="hidden md:block">
            <FaqAccordion items={PRICING_FAQ} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8 p-8 md:p-16 rounded-[32px] md:rounded-[40px] border border-outline-variant/15 bg-gradient-to-br from-[#1F2A3E] to-[#101C2F] overflow-hidden">
            <div className="absolute -right-10 top-10 w-64 h-64 rounded-full bg-[rgba(255,180,163,0.10)] pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#6AD9C0]" />
                <span className="text-[#6AD9C0] text-sm font-bold tracking-widest uppercase">
                  Contratación activa
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-extrabold text-[#D7E3FD] leading-tight">
                ¿Listo para publicar tu primera vacante?
              </h2>
              <p className="md:hidden text-[#DBC1BB] text-sm mt-3 opacity-80">
                Únete a cientos de empresas que ya están transformando su reclutamiento.
              </p>
            </div>
            <Link
              to="/login?mode=register"
              className="relative z-10 shrink-0 inline-flex justify-center items-center px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-[#D97862] text-[#561406] text-base md:text-xl font-black hover:opacity-90 transition-opacity shadow-lg"
            >
              Publicar vacante
            </Link>
          </div>

          {/* Mobile CTA variant (turquoise button from mobile Figma) — optional second style; using coral for consistency with desktop */}
        </div>
      </section>

      {/* Quick links */}
      <section className="px-4 md:px-8 pb-12 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto py-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/empresas" className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors">
            Conocer Talentify para empresas
          </Link>
          <Link to="/recursos" className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors">
            Recursos de carrera
          </Link>
          <Link to="/" className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors">
            Bolsa de empleo
          </Link>
          <Link to="/contacto" className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors">
            Contacto
          </Link>
        </div>
      </section>
    </div>
  );
}
