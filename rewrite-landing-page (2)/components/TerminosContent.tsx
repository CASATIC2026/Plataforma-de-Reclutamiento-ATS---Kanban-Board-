export default function TerminosContent() {
  return (
    <div className="w-full">
      <div className="inline-block bg-brand-turquoise/10 border border-brand-turquoise/20 rounded-full px-3 py-1 mb-6">
        <span className="text-xs font-bold text-brand-turquoise tracking-widest">DOCUMENTO OFICIAL</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-brand-turquoise mb-4">
        Términos y <br />Condiciones
      </h1>
      
      <p className="text-sm text-on-surface-variant mb-12">
        Última actualización: mayo 2025
      </p>

      {/* Sections */}
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">01.</span> Aceptación de los Términos
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Al acceder y utilizar al sitio web y los servicios de Talentify SV, usted reconoce que ha leído, comprendido y aceptado estar sujeto a estas Términos y Condiciones. Si en algún momento no está de acuerdo con parte de estos términos, le solicitamos abstenerse de utilizar nuestra plataforma de inmediato. El uso continuado del sitio tras cualquier modificación constituirá su aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">02.</span> Descripción del Servicio
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Talentify SV opera como una plataforma digital de vanguardia que integra un Sistema de Seguimiento de Candidatos (ATS) y una bolsa de empleo premium diseñada específicamente para el ecosistema profesional de El Salvador.
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <span className="text-brand-turquoise">•</span>
              <div>
                <p className="font-semibold text-slate-100">Para Empresas</p>
                <p className="text-sm text-on-surface-variant">Herramientas de publicación, filtrado inteligente y gestión de talento editorial.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-brand-turquoise">•</span>
              <div>
                <p className="font-semibold text-slate-100">Para Candidatos</p>
                <p className="text-sm text-on-surface-variant">Acceso a vacantes exclusivas, perfiles profesionales y seguimiento de postulaciones.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">03.</span> Cuentas de Usuario
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Para acceder a ciertas funcionalidades, el usuario debe crear una cuenta proporcionando información veraz, exacta y actualizada. Usted es el único responsable de la seguridad de sus credenciales de acceso.
          </p>
          <div className="bg-surface-container-high rounded-lg p-4">
            <p className="text-sm text-on-surface-variant">
              Los perfiles deben representar identidades reales o empresas legalmente constituidas. Talentify SV se reserva el derecho de suspender cuentas que presenten actividad sospechosa o violen la integridad del sistema.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">04.</span> Uso Permitido y Prohibido
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            La plataforma debe ser utilizada exclusivamente con fines profesionales de reclutamiento y búsqueda de empleo. Queda estrictamente prohibido:
          </p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs">×</span>
              <p className="text-sm text-on-surface-variant">El scraping automatizado de datos sin autorización previa por escrito.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs">×</span>
              <p className="text-sm text-on-surface-variant">El envío de spam, contenido promocional no solicitado o esquemas piramidales.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs">×</span>
              <p className="text-sm text-on-surface-variant">La suplantación de identidad o la publicación de ofertas de empleo fraudulentas.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">05.</span> Contenido de Vacantes y Postulaciones
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Las empresas son las únicas responsables por el contenido de las vacantes publicadas, garantizando que cumplen con la legislación laboral vigente en El Salvador. Los candidatos, por su parte, garantizan la veracidad de la información y formación académica en sus postulaciones.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">06.</span> Propiedad Intelectual
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Todo el software, logotipos, marcas, diseños de interfaz y contenido editorial presente en el sitio son propiedad exclusiva de Talentify SV. Queda prohibida la reproducción total o parcial sin consentimiento expreso.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">07.</span> Limitación de Responsabilidad
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            El servicio se proporciona "tal cual" y "según disponibilidad". Talentify SV no garantiza la corrección efectiva ni ningún resultado específico de las transacciones en la plataforma. No somos responsables por interrupciones técnicas ajenas a nuestro control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">08.</span> Modificaciones del Servicio
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio, incluyendo funciones, precios, políticas, términos de la plataforma con una notificación razonable a través de la plataforma o correo electrónico.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">09.</span> Ley Aplicable y Jurisdicción
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Estos términos se rigen e interpretan de acuerdo con las leyes de la República de El Salvador. Cualquier disputa será resuelta ante los tribunales competentes de la ciudad de San Salvador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">10.</span> Contacto
          </h2>
          <div className="bg-surface-container-high rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-2">¿Dudas sobre estos términos?</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Nuestro equipo legal está disponible para resolver sus inquietudes.
            </p>
            <a 
              href="mailto:legal@talentifysv.com"
              className="inline-block bg-brand-turquoise hover:bg-brand-turquoise/90 text-[#050A14] px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Contactar Soporte
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
