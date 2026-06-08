import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { formatPlanPrice } from '../../data/planesContent';

export default function PricingCard({ plan, billing, compact }) {
  const price = formatPlanPrice(plan, billing);
  const isHighlighted = plan.highlighted;

  const cardClass = isHighlighted
    ? 'relative flex flex-col rounded-3xl border-2 border-[rgba(217,120,98,0.30)] bg-[#142033] shadow-[0_12px_32px_rgba(3,14,33,0.5)] p-6 md:p-10'
    : 'flex flex-col rounded-3xl border border-outline-variant/15 bg-[#101C2F] p-6 md:p-10';

  const ctaClass =
    plan.ctaVariant === 'primary'
      ? 'w-full py-4 rounded-xl bg-[#D97862] text-[#561406] font-bold text-center hover:opacity-90 transition-opacity'
      : 'w-full py-4 rounded-xl bg-[#1F2A3E] text-[#D7E3FD] font-bold text-center hover:bg-[#2A3549] transition-colors';

  return (
    <div className={`${cardClass} ${isHighlighted && !compact ? 'lg:-mt-2 lg:mb-2' : ''}`}>
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#D97862] text-[#561406] text-[10px] md:text-[11px] font-black tracking-widest uppercase whitespace-nowrap">
          {plan.badge}
        </span>
      )}

      <div className="mb-8">
        <p
          className={`font-medium mb-2 ${
            isHighlighted ? 'text-[#FFB4A3] text-base md:text-lg font-bold' : 'text-[#DBC1BB]'
          }`}
        >
          {plan.name}
        </p>
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black text-[#D7E3FD] ${
              isHighlighted ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
            }`}
          >
            {price}
          </span>
          {!plan.isCustom && (
            <span className="text-[#DBC1BB] text-base">/mes</span>
          )}
        </div>
        <p className="text-[rgba(215,227,253,0.70)] text-sm mt-2">{plan.description}</p>
      </div>

      <ul className={`flex flex-col gap-4 mb-10 ${compact ? 'gap-3' : 'gap-5'}`}>
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CheckCircle2
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                isHighlighted ? 'text-[#6AD9C0]' : 'text-[#6AD9C0]'
              }`}
              strokeWidth={2}
            />
            <span
              className={
                isHighlighted
                  ? 'text-[#D7E3FD] text-sm md:text-base font-medium'
                  : 'text-[#DBC1BB] text-sm md:text-base'
              }
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {plan.id === 'enterprise' ? (
        <a href="mailto:soporte@talentifysv.com" className={ctaClass}>
          {plan.cta}
        </a>
      ) : (
        <Link to="/login?mode=register" className={ctaClass}>
          {plan.cta}
        </Link>
      )}
    </div>
  );
}
