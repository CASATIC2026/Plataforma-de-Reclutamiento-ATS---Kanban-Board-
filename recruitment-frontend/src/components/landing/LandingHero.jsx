import { Search, MapPin, Code } from 'lucide-react';

export default function LandingHero({
  eyebrow,
  searchQuery,
  onSearchQueryChange,
  locationFilter,
  onLocationFilterChange,
  departments,
  onSearch,
  averageSalary,
}) {
  return (
    <section className="relative pt-10 md:pt-24 pb-10 md:pb-32 overflow-hidden px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        <div className="lg:col-span-7 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/50 border border-outline-variant/15 mb-5 md:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
            </span>
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-on-surface-variant">
              {eyebrow}
            </span>
          </div>

          <h1 className="text-[2.25rem] leading-[1] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-on-surface mb-4 md:mb-8 font-display">
            El futuro del{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-turquoise to-tertiary">
              talento IT
            </span>{' '}
            está aquí
          </h1>

          <p className="hidden md:block text-base md:text-xl text-on-surface-variant leading-relaxed mb-6 md:mb-12 max-w-xl font-light">
            Conectamos a la élite tecnológica de El Salvador con las empresas globales más disruptivas. Tu próximo
            gran salto profesional comienza con una curaduría de excelencia.
          </p>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6 md:hidden">
            Conectamos élite tecnológica con empresas globales disruptivas.
          </p>

          <div className="p-2 bg-surface-container-low/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-outline-variant/15 shadow-2xl">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="flex items-center px-4 md:px-6 gap-3 bg-transparent flex-1">
                <Search className="w-5 h-5 text-brand-turquoise flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 py-3 font-medium text-sm md:text-base"
                  placeholder="Puesto, empresa o palabra clave"
                />
              </div>
              <div className="block md:hidden h-px w-full bg-outline-variant/15" />
              <div className="hidden md:block w-px h-10 bg-outline-variant/20 flex-shrink-0" />
              <div className="flex items-center px-4 md:px-4 gap-2 md:min-w-[200px]">
                <MapPin className="w-5 h-5 text-brand-turquoise flex-shrink-0 hidden sm:block" />
                <select
                  value={locationFilter}
                  onChange={(e) => onLocationFilterChange(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface py-3 font-medium text-sm md:text-base cursor-pointer"
                >
                  <option value="" className="bg-[#101C2F] text-on-surface">
                    Todas las ciudades
                  </option>
                  {departments.filter(Boolean).map((dept) => (
                    <option key={dept} value={dept} className="bg-[#101C2F] text-on-surface">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={onSearch}
                className="mx-2 mb-2 md:mb-0 md:mx-0 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm md:text-base shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative hidden md:block">
          <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] max-h-[520px] border border-outline-variant/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Equipo tecnológico colaborando"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-12 p-6 bg-surface-container-highest backdrop-blur-md rounded-3xl border border-outline-variant/15 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-turquoise flex items-center justify-center">
                <Code className="w-6 h-6 text-on-brand-turquoise" />
              </div>
              <div>
                <div className="text-sm text-on-surface-variant font-medium">Salario promedio</div>
                <div className="text-xl font-bold text-on-surface font-display">
                  {averageSalary ? `$${averageSalary.toLocaleString('en-US')}/mes` : '—'}
                </div>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-surface-container object-cover"
                  src={`https://i.pravatar.cc/80?img=${i + 10}`}
                  alt=""
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface">
                +12k
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
