import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/10 bg-[#0F1B28] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              Talentify <span className="text-brand-turquoise">SV</span>
            </h3>
            <p className="text-sm text-on-surface-variant">
              Búsqueda de excelencia en el mercado de talento moderno. Conectamos pasión con propósito tecnológico.
            </p>
          </div>

          {/* Para Candidatos */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 tracking-widest uppercase">
              Para Candidatos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Buscar Empleo
                </Link>
              </li>
              <li>
                <Link href="/recursos" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Empresas */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 tracking-widest uppercase">
              Para Empresas
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/empresas" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Publicar Vacante
                </Link>
              </li>
              <li>
                <a href="#planes" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Planes
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Soporte */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 tracking-widest uppercase">
              Legal & Soporte
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terminos" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            © 2025 Talentify SV. Conectando pasión con propósito tecnológico.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-on-surface-variant hover:text-brand-turquoise transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-brand-turquoise transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-brand-turquoise transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
