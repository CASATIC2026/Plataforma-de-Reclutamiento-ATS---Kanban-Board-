export default function DashboardMobile() {
  return (
    <div className="min-h-screen bg-[#050A14] pb-8 overflow-x-hidden">
      <div className="space-y-6 pt-6 px-3 sm:px-4 max-w-full overflow-hidden">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F2A3E]">
          <div className="w-2 h-2 rounded-full bg-brand-turquoise"></div>
          <span className="text-xs font-bold text-brand-turquoise tracking-widest uppercase">
            Activo en el mercado
          </span>
        </div>

        {/* Welcome heading */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 leading-tight">
            Bienvenido de
            <br />
            nuevo, Alex.
          </h1>
          <h2 className="text-3xl font-extrabold text-brand-turquoise leading-tight mt-1">
            Tu próximo gran
            <br />
            salto te espera.
          </h2>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed">
          Hemos seleccionado 12 nuevos roles que coinciden con tu experiencia Senior Fullstack y tu preferencia por el trabajo remoto.
        </p>

        {/* Progress card */}
        <div className="rounded-2xl bg-surface-container border border-outline-variant/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-300">Progreso de la Aplicación</h3>
            <span className="text-xl font-bold text-brand-turquoise">75%</span>
          </div>
          
          <div className="w-full bg-surface-container-high rounded-full h-2 mb-3 overflow-hidden">
            <div className="bg-brand-turquoise h-full rounded-full" style={{ width: "75%" }}></div>
          </div>

          <p className="text-xs text-on-surface-variant mb-4">
            Completa tu portafolio para desbloquear el estado "Fast Track" para el Nivel 1.
          </p>

          <button className="w-full px-4 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold">
            Mis Aplicaciones
          </button>
        </div>

        {/* Recommended section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-100">Recomendado para ti</h2>
            <a href="#" className="text-brand-turquoise font-semibold text-xs">
              VER TODOS
            </a>
          </div>
          <p className="text-on-surface-variant text-xs mb-4">
            Basado en tu preferencia de "Senior Fullstack" y "TypeScript"
          </p>

          {/* Featured card */}
          <div className="rounded-2xl bg-surface-container border border-outline-variant/10 p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="inline-block px-2 py-1 rounded text-xs font-bold text-slate-300 bg-surface-container-high mb-2">
                  FEATURED
                </span>
                <h3 className="text-lg font-bold text-slate-100">Lead Systems Architect</h3>
                <p className="text-xs text-on-surface-variant">Lumina Systems • Remoto</p>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-600/30 text-orange-300">RUST</span>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-surface-container-highest text-on-surface-variant">
                DISTRIBUTED SYSTEMS
              </span>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-surface-container-highest text-on-surface-variant">AWS</span>
            </div>

            <div className="pt-3 border-t border-outline-variant/10">
              <p className="text-xs text-on-surface-variant font-semibold mb-1">SALARY</p>
              <p className="text-lg font-bold text-slate-100 mb-3">$180k - $240k/yr</p>
              <button className="w-full px-4 py-2 rounded-lg bg-brand-turquoise text-on-brand-turquoise font-bold text-sm">
                Postular
              </button>
            </div>
          </div>

          {/* Job cards */}
          {[
            {
              title: "Senior Frontend Engineer",
              company: "Stellar Creative Agency",
              skills: ["REACT", "THREE.JS"],
              salary: "$150k+"
            },
            {
              title: "DevSecOps Specialist",
              company: "Vault Technologies",
              skills: ["KBS", "SECURITY"],
              salary: "$170k - $210k"
            }
          ].map((job, idx) => (
            <div key={idx} className="rounded-xl bg-surface-container border border-outline-variant/10 p-4 mb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-100 mb-1">{job.title}</h4>
                  <p className="text-xs text-on-surface-variant mb-2">{job.company}</p>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs font-semibold bg-surface-container-highest text-on-surface-variant">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="p-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                  </svg>
                </button>
              </div>
              <p className="text-base font-bold text-slate-100">{job.salary}</p>
            </div>
          ))}
        </div>

        {/* Saved searches */}
        <div className="rounded-xl bg-surface-container border border-outline-variant/10 p-4">
          <h3 className="font-bold text-slate-100 mb-3">Búsquedas Guardadas</h3>
          <div className="space-y-2 mb-4">
            <div className="p-2 rounded-lg bg-surface-container-high">
              <p className="text-xs font-semibold text-slate-300">Fullstack + Remoto + $130k+</p>
              <p className="text-xs text-on-surface-variant">4 resultados hoy</p>
            </div>
            <div className="p-2 rounded-lg bg-surface-container-high">
              <p className="text-xs font-semibold text-slate-300">Staff Engineer • NYC</p>
              <p className="text-xs text-on-surface-variant">Última vista: ayer</p>
            </div>
          </div>
          
          <button className="w-full px-4 py-2 rounded-lg border border-dashed border-brand-turquoise/30 text-brand-turquoise font-semibold text-xs hover:border-brand-turquoise/60">
            + CREAR NUEVA ALERTA
          </button>
        </div>
      </div>
    </div>
  );
}
