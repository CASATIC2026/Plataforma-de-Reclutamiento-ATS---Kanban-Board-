export default function PrivacidadContent() {
  return (
    <div className="w-full">
      <div className="inline-block bg-brand-turquoise/10 border border-brand-turquoise/20 rounded-full px-3 py-1 mb-6">
        <span className="text-xs font-bold text-brand-turquoise tracking-widest">LEGAL & PRIVACIDAD</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-brand-turquoise mb-4">
        Política de <br />Privacidad
      </h1>
      
      <p className="text-sm text-on-surface-variant mb-12">
        Última actualización: mayo 2025 | Talentify SV
      </p>

      {/* Sections */}
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">01.</span> Responsable del Tratamiento
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Responsables del tratamiento de sus datos es Talentify SV, una plataforma dedicada a la gestión de talento y reclutamiento editorial. Nos comprometemos a garantizar la seguridad y confidencialidad de la información que nos confiado. Para cualquier consulta sobre la privacidad de sus datos, póngase en contacto con nosotros a través de privacy@talentifysv.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">02.</span> Datos que Recopilamos
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Recopilamos diferentes tipos de información según su rol en la plataforma:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-slate-100 mb-3 text-brand-turquoise">Para Candidatos</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Nombre completo y datos de contacto básicos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Información sobre formación y experiencia laboral</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Historial de aplicaciones y comunicaciones</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Preferencias laborales y validación de ubicación</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Disponibilidad horaria y geográfica</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 mb-3 text-brand-turquoise">Para Empresas</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Datos de la cuenta corporativa</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Información de contacto y perfiles profesionales</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Historial de vacantes publicadas y candidatos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-turquoise">•</span>
                  <span>Interacciones con candidatos a través de la plataforma</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">03.</span> Finalidad del Tratamiento
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Tratamos su información con las siguientes finalidades específicas:
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-3 bg-surface-container-high p-4 rounded-lg">
              <span className="flex-shrink-0 text-brand-turquoise text-xl">📊</span>
              <div>
                <p className="font-semibold text-slate-100">Gestión de la plataforma</p>
                <p className="text-sm text-on-surface-variant">Permitir el acceso y uso de las herramientas y empleadores.</p>
              </div>
            </div>
            <div className="flex gap-3 bg-surface-container-high p-4 rounded-lg">
              <span className="flex-shrink-0 text-brand-turquoise text-xl">📈</span>
              <div>
                <p className="font-semibold text-slate-100">Scoring y Matching</p>
                <p className="text-sm text-on-surface-variant">Utilizar algoritmos para conectar el matching de candidatos adecuados.</p>
              </div>
            </div>
            <div className="flex gap-3 bg-surface-container-high p-4 rounded-lg">
              <span className="flex-shrink-0 text-brand-turquoise text-xl">💬</span>
              <div>
                <p className="font-semibold text-slate-100">Comunicaciones transaccionales</p>
                <p className="text-sm text-on-surface-variant">Envío de notificaciones sobre el estado de postulaciones y ofertas.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">04.</span> Base Legal
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            El tratamiento de sus datos se realiza bajo los siguientes bases jurídicas: Consentimiento: al registrarse y aceptar esta política, nos otorga su consentimiento para procesar sus datos. Ejecución de contrato: necesario para prestar los servicios de intermediación laboral solicitados. Interés legítimo: para mejorar nuestros servicios y garantizar la plataforma de información solicitada.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">05.</span> Conservación
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Sus datos serán conservados durante la relación contractual y posiblemente después en caso de obligaciones legales. Específicamente:
          </p>
          <div className="bg-surface-container-high rounded-lg p-4 space-y-2 text-sm text-on-surface-variant">
            <p>Datos de perfiles activos: mientras mantenga su cuenta abierta</p>
            <p>Historial de aplicaciones: mínimo 3 años por ley laboral</p>
            <p>Información financiera: 7 años de acuerdo con normativa fiscal</p>
            <p>Datos de comunicación: por períodos específicos según retención interna</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">06.</span> Derechos del Titular
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Usted tiene el control total sobre su información personal:
          </p>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="bg-surface-container-high p-3 rounded-lg text-center">
              <p className="font-semibold text-slate-100 mb-2">👁️ Acceso</p>
              <p className="text-on-surface-variant text-xs">Solicitar copia de sus datos</p>
            </div>
            <div className="bg-surface-container-high p-3 rounded-lg text-center">
              <p className="font-semibold text-slate-100 mb-2">✏️ Rectificación</p>
              <p className="text-on-surface-variant text-xs">Corregir información incorrecta</p>
            </div>
            <div className="bg-surface-container-high p-3 rounded-lg text-center">
              <p className="font-semibold text-slate-100 mb-2">🗑️ Eliminación</p>
              <p className="text-on-surface-variant text-xs">Solicitar borrado de datos</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">07.</span> Cookies
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Utilizamos cookies técnicas estrictamente necesarias para el funcionamiento de la web y cookies analíticas (con su consentimiento) para entender cómo interactúan los usuarios con nuestra plataforma y mejorar su experiencia editorial.
          </p>
          <p className="text-sm text-on-surface-variant">
            Para obtener más información sobre las cookies específicas y sus preferencias, consulte nuestro gestor de cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">08.</span> Cambios
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Talentify SV se reserva el derecho de modificar esta política en cualquier momento. Notificaremos cambios significativos a través de un aviso destacado en nuestra plataforma o mediante comunicación directa por correo electrónico asociado a la cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            <span className="text-brand-turquoise">09.</span> Contacto
          </h2>
          <div className="bg-surface-container-high rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-2">¿Dudas adicionales?</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Nuestro equipo de soporte legal está disponible para resolver cualquier inquietud sobre el tratamiento de sus datos.
            </p>
            <a 
              href="mailto:privacy@talentifysv.com"
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
