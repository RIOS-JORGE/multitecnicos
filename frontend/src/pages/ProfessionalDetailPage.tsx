import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useProfessional } from '../hooks/useProfessionals';
import { SITE_NAME, SITE_URL, SPECIALTY_MAP, REFERRAL_EMAIL } from '../lib/constants';
import { extractTextFromBlocks } from '../lib/blocks';
import { getStrapiMediaUrl } from '../lib/strapi';
import ProfileHeader from '../components/profile/ProfileHeader';
import DescriptionBlock from '../components/profile/DescriptionBlock';
import WhatsAppButton from '../components/profile/WhatsAppButton';
import SocialLinks from '../components/profile/SocialLinks';
import WorkGallery from '../components/profile/WorkGallery';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';

export default function ProfessionalDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: professional, isLoading, error, refetch } = useProfessional(slug || '');

  if (isLoading) return <LoadingSpinner text="Cargando profesional..." />;

  if (error) {
    return (
      <ErrorState
        message="No pudimos cargar la información del profesional."
        onRetry={() => refetch()}
      />
    );
  }

  if (!professional) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Profesional no encontrado
        </h2>
        <p className="text-gray-500 mb-6">
          El profesional que buscás no existe o fue dado de baja.
        </p>
        <Link
          to="/profesionales"
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Volver al directorio
        </Link>
      </div>
    );
  }

  const rawSpecialty = professional.specialty as string | undefined;
  const specialtyLabel = (rawSpecialty && SPECIALTY_MAP[rawSpecialty as keyof typeof SPECIALTY_MAP]) || rawSpecialty || 'su especialidad';
  const pageTitle = `${professional.name} — ${specialtyLabel} en ${SITE_NAME}`;

  const rawDescription = extractTextFromBlocks(professional.description);
  const metaDescription = rawDescription
    ? rawDescription.slice(0, 160)
    : `${professional.name} es un profesional de ${specialtyLabel.toLowerCase()} en ${SITE_NAME}. Contactalo directamente para solicitar un presupuesto.`;

  const photoUrl = professional.photo
    ? getStrapiMediaUrl(professional.photo.url)
    : null;
  const ogImage = photoUrl || `${SITE_URL}/og-default.svg`;

  const professionalUrl = `${SITE_URL}/profesionales/${professional.slug}`;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'Person'],
    name: professional.name,
    description: `${specialtyLabel} en ${SITE_NAME}`,
    url: professionalUrl,
    image: ogImage,
    telephone: professional.phone || undefined,
    email: professional.email || undefined,
    knowsAbout: specialtyLabel,
    areaServed: 'Argentina',
    priceRange: '$$',
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={professionalUrl} />
        <meta property="og:image" content={ogImage} />
        {photoUrl && (
          <>
            <meta property="og:image:width" content="800" />
            <meta property="og:image:height" content="800" />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {photoUrl && <meta name="twitter:image" content={ogImage} />}

        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/profesionales"
          className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 transition-colors"
        >
          &larr; Volver al directorio
        </Link>

        <ProfileHeader professional={professional} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {professional.description && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Sobre mí
                </h2>
                <DescriptionBlock content={professional.description} />
              </section>
            )}

            <WorkGallery entries={professional.workGallery} />
          </div>

          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contacto
              </h2>

              {professional.phone && (
                <WhatsAppButton
                  phone={professional.phone}
                  specialty={professional.specialty}
                  name={professional.name}
                />
              )}

              {professional.website && (
                <a
                  href={professional.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Visitar sitio web &rarr;
                </a>
              )}

              {professional.email && (
                <a
                  href={`mailto:${professional.email}`}
                  className="block mt-2 text-center text-blue-600 hover:text-blue-800 text-sm font-medium break-all transition-colors"
                >
                  {professional.email}
                </a>
              )}
            </section>

            <SocialLinks links={professional.socialLinks || []} />

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8 text-sm text-gray-600">
              <p>
                <strong>¿Tuviste una experiencia con este profesional?</strong>{' '}
                Ayudanos a mantener la calidad del directorio. Escribinos a{' '}
                <a
                  href={`mailto:${REFERRAL_EMAIL}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {REFERRAL_EMAIL}
                </a>{' '}
                y contanos tu experiencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
