"use client";

import { useState } from "react";
import { X, MapPin, Clock, DollarSign } from "lucide-react";
import { ApplicationFormModal } from "./ApplicationFormModal";

export function JobDetailModal({ job, isOpen, onClose }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (!isOpen || !job) return null;

  return (
    <>
      <ApplicationFormModal
        jobTitle={job.title}
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
      />

      {!showApplicationForm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Desktop Modal */}
          <div className="fixed inset-0 z-50 hidden md:flex items-center justify-center p-4 md:p-0">
            <div className="flex flex-col max-w-2xl w-full max-h-[90vh] rounded-3xl border border-outline-variant/10 bg-[#101C2F] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-8 border-b border-outline-variant/10">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-turquoise/30 to-brand-mint/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-brand-turquoise font-[var(--font-plus-jakarta)]">
                      {job.company?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-brand-turquoise font-[var(--font-plus-jakarta)] mb-2">
                      {job.title}
                    </h2>
                    <p className="text-on-surface-variant text-sm">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Meta Cards */}
              <div className="grid grid-cols-2 gap-4 p-8">
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/5 bg-[#142033]">
                  <MapPin className="w-5 h-5 text-brand-turquoise flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ubicación</p>
                    <p className="text-sm font-semibold text-on-surface">{job.location || "Remoto"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/5 bg-[#142033]">
                  <Clock className="w-5 h-5 text-brand-turquoise flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Modalidad</p>
                    <p className="text-sm font-semibold text-on-surface">{job.type || "Tiempo completo"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/5 bg-[#142033]">
                  <DollarSign className="w-5 h-5 text-brand-turquoise flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Salario</p>
                    <p className="text-sm font-semibold text-on-surface">{job.salary || "$3,500 - $5,200 USD"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/5 bg-[#142033]">
                  <Clock className="w-5 h-5 text-brand-turquoise flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Publicado</p>
                    <p className="text-sm font-semibold text-on-surface">{job.publishedDate || "Hace 2 días"}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-8">
                  {job.description && (
                    <div>
                      <h3 className="text-lg font-bold text-on-surface font-[var(--font-plus-jakarta)] mb-4">
                        Descripción del puesto
                      </h3>
                      <p className="text-on-surface-variant leading-relaxed text-sm">{job.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 p-6 border-t border-outline-variant/10 bg-[#142033]">
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="flex-1 px-6 py-3 rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  Aplicar a esta vacante
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl border border-outline-variant/20 text-on-surface-variant font-semibold text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Modal */}
          <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="flex flex-col w-full max-h-[95vh] rounded-3xl border border-outline-variant/10 bg-[#101C2F] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-outline-variant/10">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-turquoise/30 to-brand-mint/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-brand-turquoise font-[var(--font-plus-jakarta)]">
                      {job.company?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-brand-turquoise font-[var(--font-plus-jakarta)] mb-1">
                      {job.title}
                    </h2>
                    <p className="text-on-surface-variant text-xs">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Meta Cards */}
              <div className="grid grid-cols-2 gap-2 p-4">
                <div className="flex items-start gap-2 p-3 rounded-lg border border-outline-variant/5 bg-[#142033]">
                  <MapPin className="w-4 h-4 text-brand-turquoise flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Ubicación</p>
                    <p className="text-xs font-semibold text-on-surface">{job.location || "Remoto"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg border border-outline-variant/5 bg-[#142033]">
                  <Clock className="w-4 h-4 text-brand-turquoise flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Modalidad</p>
                    <p className="text-xs font-semibold text-on-surface">{job.type || "Tiempo completo"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg border border-outline-variant/5 bg-[#142033]">
                  <DollarSign className="w-4 h-4 text-brand-turquoise flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Salario</p>
                    <p className="text-xs font-semibold text-on-surface">{job.salary || "$3,500 - $5,200"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg border border-outline-variant/5 bg-[#142033]">
                  <Clock className="w-4 h-4 text-brand-turquoise flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Publicado</p>
                    <p className="text-xs font-semibold text-on-surface">{job.publishedDate || "Hace 2 días"}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {job.description && <p className="text-on-surface-variant text-sm">{job.description}</p>}
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-2 p-4 border-t border-outline-variant/10 bg-[#142033]">
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  Aplicar
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
