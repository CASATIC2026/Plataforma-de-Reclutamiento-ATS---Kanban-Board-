export default function DashboardDesktop() {
  return (
    <div className="min-h-screen bg-[#050A14] pt-8">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main content grid */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Left column - Welcome section */}
          <div className="col-span-2">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F2A3E] mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-turquoise"></div>
              <span className="text-xs font-bold text-brand-turquoise tracking-widest uppercase">
                Activo en el mercado
              </span>
            </div>

            {/* Welcome heading */}
            <h1 className="text-5xl font-extrabold text-brand-turquoise leading-tight mb-6">
              Bienvenido, Alex.
              <br />
              Tu próximo salto espera.
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-xl">
              Hemos seleccionado 12 nuevos roles que coinciden con tu experiencia Senior Fullstack y tu preferencia por el trabajo remoto.
            </p>

            {/* Recommended section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Recomendado para ti</h2>
                <a href="#" className="text-brand-turquoise font-semibold text-sm hover:text-brand-turquoise/80">
                  VER TODOS
                </a>
              </div>
              <p className="text-on-surface-variant text-sm mb-6">
                Basado en tu preferencia de "Senior Fullstack" y "TypeScript"
              </p>

              {/* Job cards */}
              <div className="space-y-4">
                {/* Featured card */}
                <div className="rounded-2xl bg-surface-container border border-outline-variant/10 p-6 hover:border-brand-turquoise/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-bold text-slate-300 bg-surface-container-high mb-3">
                        FEATURED EDITORIAL
                      </span>
                      <h3 className="text-2xl font-bold text-slate-100 mb-2">Lead Systems Architect</h3>
                      <p className="text-on-surface-variant text-sm">
                        Lumina Systems • Remoto, Global
                      </p>
                    </div>
                    <button className="p-2 hover:bg-surface-container-high rounded transition-colors">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-600/30 text-orange-300">RUST</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant">
                      DISTRIBUTED SYSTEMS
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant">AWS</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <div>
                      <p className="text-xs text-on-surface-variant font-semibold mb-1">ESTIMATED ANNUAL SALARY</p>
                      <p className="text-xl font-bold text-slate-100">$180k - $240k/yr</p>
                    </div>
                    <button className="px-6 py-2 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold hover:scale-105 transition-transform">
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Regular job cards */}
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
                  <div key={idx} className="rounded-xl bg-surface-container border border-outline-variant/10 p-4 hover:border-brand-turquoise/30 transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-100 mb-1">{job.title}</h4>
                        <p className="text-sm text-on-surface-variant mb-3">{job.company}</p>
                        <div className="flex gap-2 mb-3">
                          {job.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 rounded text-xs font-semibold bg-surface-container-highest text-on-surface-variant">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors flex-shrink-0">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-lg font-bold text-slate-100 pt-2">{job.salary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Progress and alerts */}
          <div className="space-y-6">
            {/* Progress card */}
            <div className="rounded-2xl bg-surface-container border border-outline-variant/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300">Progreso de la Aplicación</h3>
                <span className="text-2xl font-bold text-brand-turquoise">75%</span>
              </div>
              
              <div className="w-full bg-surface-container-high rounded-full h-2 mb-4 overflow-hidden">
                <div className="bg-brand-turquoise h-full rounded-full" style={{ width: "75%" }}></div>
              </div>

              <p className="text-xs text-on-surface-variant mb-4">
                Completa tu portafolio para desbloquear el estado "Fast Track" para el Nivel 1.
              </p>

              <button className="w-full px-4 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold hover:scale-105 transition-transform mb-3">
                Mis Aplicaciones
              </button>

              <button className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold hover:border-brand-turquoise/30 transition-colors">
                ⚙️
              </button>
            </div>

            {/* Saved searches */}
            <div className="rounded-xl bg-surface-container border border-outline-variant/10 p-6">
              <h3 className="font-bold text-slate-100 mb-4">Búsquedas Guardadas</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest cursor-pointer transition-colors">
                  <p className="text-sm font-semibold text-slate-300">Fullstack + Remoto + $130k+</p>
                  <p className="text-xs text-on-surface-variant">4 resultados hoy</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest cursor-pointer transition-colors">
                  <p className="text-sm font-semibold text-slate-300">Staff Engineer • NYC</p>
                  <p className="text-xs text-on-surface-variant">Última vista: ayer</p>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-3 rounded-lg border border-dashed border-brand-turquoise/30 text-brand-turquoise font-semibold text-sm hover:border-brand-turquoise/60 transition-colors">
                + CREAR NUEVA ALERTA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
