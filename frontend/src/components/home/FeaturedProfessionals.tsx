import { Link } from 'react-router-dom';
import { useFeaturedProfessionals } from '../../hooks/useProfessionals';
import { SPECIALTY_MAP } from '../../lib/constants';
import { getStrapiMediaUrl } from '../../lib/strapi';
import ImageWithFallback from '../ui/ImageWithFallback';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function FeaturedProfessionals() {
  const { data: professionals, isLoading, error } = useFeaturedProfessionals(4);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          Profesionales destacados
        </h2>

        {isLoading && <LoadingSpinner />}
        {error && (
          <p className="text-center text-red-500">
            Error al cargar profesionales destacados.
          </p>
        )}

        {professionals && professionals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {professionals.map((pro) => (
              <Link
                key={pro.documentId}
                to={`/profesionales/${pro.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <ImageWithFallback
                  src={getStrapiMediaUrl(pro.photo?.url)}
                  alt={pro.name}
                  className="w-full h-48 object-cover"
                  fallback={pro.name.charAt(0).toUpperCase()}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {pro.name}
                  </h3>
                  <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {SPECIALTY_MAP[pro.specialty]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {professionals && professionals.length === 0 && (
          <p className="text-center text-gray-500">
            No hay profesionales destacados aún.
          </p>
        )}

        <div className="text-center mt-8">
          <Link
            to="/profesionales"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Ver todos los profesionales &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
