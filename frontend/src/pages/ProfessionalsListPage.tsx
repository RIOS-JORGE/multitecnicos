import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useProfessionals } from '../hooks/useProfessionals';
import { SITE_NAME, SITE_DESCRIPTION, SPECIALTY_MAP } from '../lib/constants';
import type { Specialty } from '../types/professional';
import SpecialtyFilter from '../components/professionals/SpecialtyFilter';
import ProfessionalGrid from '../components/professionals/ProfessionalGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';

export default function ProfessionalsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSpecialty = (searchParams.get('especialidad') as Specialty) || null;

  const { data: professionals, isLoading, error, refetch } = useProfessionals(activeSpecialty);

  const handleFilterChange = (specialty: Specialty | null) => {
    if (specialty) {
      setSearchParams({ especialidad: specialty });
    } else {
      setSearchParams({});
    }
  };

  const pageTitle = activeSpecialty
    ? `${SPECIALTY_MAP[activeSpecialty]} | ${SITE_NAME}`
    : `Profesionales | ${SITE_NAME}`;

  const pageDescription = activeSpecialty
    ? `Encontrá los mejores profesionales de ${SPECIALTY_MAP[activeSpecialty].toLowerCase()} en ${SITE_NAME}. ${SITE_DESCRIPTION}`
    : `Buscá entre cientos de profesionales verificados. ${SITE_DESCRIPTION}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Profesionales
        </h1>
        <p className="text-gray-600 mb-8">
          Encontrá al profesional indicado para tu proyecto.
        </p>

        <div className="mb-8">
          <SpecialtyFilter active={activeSpecialty} onChange={handleFilterChange} />
        </div>

        {isLoading && <LoadingSpinner text="Buscando profesionales..." />}

        {error && (
          <ErrorState
            message="No pudimos cargar los profesionales. Intentalo de nuevo."
            onRetry={() => refetch()}
          />
        )}

        {professionals && professionals.length > 0 && (
          <ProfessionalGrid professionals={professionals} />
        )}

        {professionals && professionals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">
              No hay profesionales en esta especialidad.
            </p>
            {activeSpecialty && (
              <button
                onClick={() => handleFilterChange(null)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Ver todos los profesionales
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
