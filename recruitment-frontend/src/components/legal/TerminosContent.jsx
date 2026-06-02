export default function TerminosContent() {
  return (
    <div className="w-full">
      <div className="inline-block bg-brand-turquoise/10 border border-brand-turquoise/20 rounded-full px-3 py-1 mb-6">
        <span className="text-xs font-bold text-brand-turquoise tracking-widest">DOCUMENTO OFICIAL</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-brand-turquoise mb-4 font-display">
        Términos y <br />
        Condiciones
      </h1>
      <p className="text-sm text-on-surface-variant mb-12">Última actualización: mayo 2025</p>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">01.</span> Aceptación de los Términos
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Al acceder y utilizar al sitio web y los servicios de Talentify SV, usted reconoce que ha leído,
            comprendido y aceptado estar sujeto a estas Términos y Condiciones. Si en algún momento no está de
            acuerdo con parte de estos términos, le solicitamos abstenerse de utilizar nuestra plataforma de
            inmediato.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">02.</span> Descripción del Servicio
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Talentify SV opera como una plataforma digital que integra un Sistema de Seguimiento de Candidatos
            (ATS) y una bolsa de empleo premium diseñada para el ecosistema profesional de El Salvador.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">03.</span> Cuentas de Usuario
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Para acceder a ciertas funcionalidades, el usuario debe crear una cuenta con información veraz y
            actualizada. Usted es responsable de la seguridad de sus credenciales.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">04.</span> Uso Permitido y Prohibido
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            La plataforma debe usarse con fines profesionales de reclutamiento y búsqueda de empleo. Queda
            prohibido el scraping no autorizado, spam y ofertas fraudulentas.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">05.</span> Ley Aplicable
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Estos términos se rigen por las leyes de la República de El Salvador. Cualquier disputa se resolverá
            ante los tribunales competentes de San Salvador.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 font-display">
            <span className="text-brand-turquoise">06.</span> Contacto
          </h2>
          <div className="bg-surface-container-high rounded-lg p-6">
            <p className="text-sm text-on-surface-variant mb-4">¿Dudas sobre estos términos?</p>
            <a
              href="mailto:legal@talentifysv.com"
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
