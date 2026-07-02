import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '../lib/constants';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 | {SITE_NAME}</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
