import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LandingFooter() {
  const { isAdminOrManager } = useAuth();

  return (
    <footer className="border-t border-outline-variant/10 bg-[#0F1B28] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4 font-display">
              Talentify <span className="text-brand-turquoise">SV</span>
            </h3>
            <p className="text-sm text-on-surface-variant">
              Búsqueda de excelencia en el mercado de talento moderno. Conectamos pasión con propósito tecnológico.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 tracking-widest uppercase">Para Candidatos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#jobs-section" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Buscar Empleo
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link to="/login?mode=register" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 tracking-widest uppercase">Para Empresas</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/empresas" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Publicar Vacante
                </Link>
              </li>
              <li>
                <Link to="/empresas#planes" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Planes
                </Link>
              </li>
              <li>
                <a href="mailto:soporte@talentifysv.com" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4 tracking-widest uppercase">Legal & Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/legal/terminos" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/legal/privacidad" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              {isAdminOrManager && (
                <li>
                  <Link to="/admin/vacantes" className="text-sm text-on-surface-variant hover:text-brand-turquoise transition-colors">
                    Panel Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            © 2026 Talentify SV. Conectando pasión con propósito tecnológico.
          </p>
        </div>
      </div>
    </footer>
  );
}
