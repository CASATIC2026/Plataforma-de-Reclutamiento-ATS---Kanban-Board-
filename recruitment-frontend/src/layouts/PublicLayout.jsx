import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className="navbar"
        style={{ boxShadow: scrolled ? '0 2px 20px rgba(28,43,58,0.12)' : 'none' }}
      >
        <div className="navbar__brand">
          <div className="navbar__logo">
            <span className="logo-icon">TB</span>
          </div>
          <span className="navbar__name">TalentBridge</span>
        </div>

        <nav className="navbar__links">
          <a href="#" className="nav-link">Inicio</a>
          <a href="#" className="nav-link">Empresas</a>
          <a href="#" className="nav-link">Recursos</a>
        </nav>

        <div className="navbar__actions">
          {live && <span className="live-badge">En vivo</span>}
          <button className="btn btn--ghost">Iniciar Sesión</button>
          <Link to="/admin/vacantes" className="admin-link">⚙ Panel Admin</Link>
        </div>
      </header>

      <Outlet context={{ setLive }} />

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="navbar__brand">
              <div className="navbar__logo">
                <span className="logo-icon">TB</span>
              </div>
              <span className="navbar__name">TalentBridge</span>
            </div>
            <p className="footer__tagline">Conectando talento con oportunidad.</p>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4>Candidatos</h4>
              <a href="#">Buscar empleos</a>
              <a href="#">Mi perfil</a>
              <a href="#">Recursos</a>
            </div>
            <div className="footer__col">
              <h4>Empresas</h4>
              <a href="#">Publicar vacante</a>
              <a href="#">Planes</a>
              <a href="#">Contacto</a>
            </div>
            <div className="footer__col">
              <h4>Administración</h4>
              <Link to="/admin/vacantes">Panel Admin</Link>
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2025 TalentBridge. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
