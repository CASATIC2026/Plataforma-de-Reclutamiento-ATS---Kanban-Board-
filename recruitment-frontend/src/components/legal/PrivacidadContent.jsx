export default function PrivacidadContent() {
  return (
    <div className="w-full">
      <div className="inline-block bg-brand-turquoise/10 border border-brand-turquoise/20 rounded-full px-3 py-1 mb-6">
        <span className="text-xs font-bold text-brand-turquoise tracking-widest">LEGAL & PRIVACIDAD</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-brand-turquoise mb-4 font-display">
        Política de <br />
        Privacidad
      </h1>
      <p className="text-sm text-on-surface-variant mb-12">Última actualización: mayo 2025 | Talentify SV</p>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">01.</span> Responsable del Tratamiento
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Talentify SV es responsable del tratamiento de sus datos personales. Para consultas:
            privacy@talentifysv.com.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">02.</span> Datos que Recopilamos
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Recopilamos datos de contacto, formación, historial de postulaciones, preferencias laborales y
            disponibilidad según su rol (candidato o empresa).
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">03.</span> Finalidad del Tratamiento
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Usamos sus datos para operar la plataforma, realizar matching de candidatos, enviar notificaciones
            transaccionales y mejorar nuestros servicios.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">04.</span> Derechos del Titular
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Puede solicitar acceso, rectificación o eliminación de sus datos contactando a nuestro equipo de
            soporte legal.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">05.</span> Contacto
          </h2>
          <div className="bg-surface-container-high rounded-lg p-6">
            <p className="text-sm text-on-surface-variant mb-4">¿Dudas sobre privacidad?</p>
            <a
              href="mailto:privacy@talentifysv.com"
              className="inline-block bg-brand-turquoise hover:opacity-90 text-on-brand-turquoise px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Contactar Soporte
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
