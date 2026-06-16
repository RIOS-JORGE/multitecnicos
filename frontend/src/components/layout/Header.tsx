import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle = () => setMenuOpen((prev) => !prev);
  const close = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          onClick={close}
        >
          Multitécnicos
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <Link
            to="/profesionales"
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            Profesionales
          </Link>
          <Link to="/nosotros" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Nosotros
          </Link>
        </nav>

        {/* Hamburger button */}
        <button
          onClick={toggle}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={close}
              className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/profesionales"
              onClick={close}
              className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Profesionales
            </Link>
            <Link
              to="/nosotros"
              onClick={close}
              className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Nosotros
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
