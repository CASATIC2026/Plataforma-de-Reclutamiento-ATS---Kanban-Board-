import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f5f4f0', fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="text-center px-6">
        <h1
          className="font-extrabold tracking-tight"
          style={{ fontSize: 'clamp(6rem, 15vw, 10rem)', color: '#131931', lineHeight: 1 }}
        >
          404
        </h1>
        <p className="text-xl font-semibold mt-4" style={{ color: '#131931' }}>
          Página no encontrada
        </p>
        <p className="text-sm mt-2" style={{ color: '#8a8fa3' }}>
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #131931 0%, #1F9DB9 100%)',
            boxShadow: '0 4px 12px rgba(19,25,49,0.2)',
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
