import { BILLING_DISCOUNT } from '../../data/planesContent';

export default function BillingToggle({ value, onChange, compact }) {
  const discountPct = Math.round(BILLING_DISCOUNT * 100);

  if (compact) {
    return (
      <div className="flex p-1.5 items-center gap-0 rounded-2xl bg-[#101C2F] shadow-inner">
        <button
          type="button"
          onClick={() => onChange('monthly')}
          className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
            value === 'monthly'
              ? 'bg-[#D97862] text-[#561406]'
              : 'text-[#DBC1BB]'
          }`}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => onChange('annual')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all ${
            value === 'annual' ? 'bg-[#D97862] text-[#561406]' : 'text-[#DBC1BB]'
          }`}
        >
          Anual
          <span className="text-[#6AD9C0] text-[10px] font-semibold">-{discountPct}%</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex p-1.5 items-center gap-1 rounded-3xl border border-outline-variant/15 bg-[#101C2F]">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={`px-8 py-2.5 rounded-xl text-base font-semibold transition-all ${
          value === 'monthly'
            ? 'bg-[#2A3549] text-[#D7E3FD]'
            : 'text-[#DBC1BB] font-medium hover:text-on-surface'
        }`}
      >
        Mensual
      </button>
      <button
        type="button"
        onClick={() => onChange('annual')}
        className={`px-6 py-2.5 rounded-xl text-base flex items-center gap-2 transition-all ${
          value === 'annual'
            ? 'bg-[#2A3549] text-[#D7E3FD] font-semibold'
            : 'text-[#DBC1BB] font-medium hover:text-on-surface'
        }`}
      >
        Anual
        <span className="text-[#6AD9C0] text-xs font-bold tracking-tight">
          (ahorra {discountPct}%)
        </span>
      </button>
    </div>
  );
}
