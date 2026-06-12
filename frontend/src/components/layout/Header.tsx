import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Directorio Profesional
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <Link to="/profesionales" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Profesionales
          </Link>
          <Link to="/nosotros" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Nosotros
          </Link>
        </nav>
      </div>
    </header>
  );
}
