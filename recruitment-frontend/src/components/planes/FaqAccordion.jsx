import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ items, compact }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={`flex flex-col w-full ${compact ? 'gap-3' : 'gap-4'}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`rounded-3xl border border-outline-variant/15 bg-[#101C2F] overflow-hidden ${
              compact ? 'rounded-2xl' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className={`w-full flex justify-between items-center gap-4 text-left transition-colors hover:bg-[#142033]/50 ${
                compact ? 'py-4 px-6' : 'py-6 px-8'
              }`}
            >
              <span
                className={`text-[#D7E3FD] font-semibold ${
                  compact ? 'text-sm' : 'text-lg'
                }`}
              >
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#D7E3FD] shrink-0 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div
                className={`border-t border-outline-variant/10 text-[#DBC1BB] leading-relaxed ${
                  compact ? 'px-6 pb-4 text-sm' : 'px-8 pb-6 text-base'
                }`}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
