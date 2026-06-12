import { Helmet } from 'react-helmet-async';
import { useFeaturedProfessionals } from '../hooks/useProfessionals';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../lib/constants';
import HeroSection from '../components/home/HeroSection';
import SpecialtyLinks from '../components/home/SpecialtyLinks';
import FeaturedProfessionals from '../components/home/FeaturedProfessionals';
import GalleryCarousel from '../components/home/GalleryCarousel';

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'es-AR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/profesionales?especialidad={query}`,
    'query-input': 'required name=query',
  },
};

const defaultOgImage = `${SITE_URL}/og-default.svg`;

export default function HomePage() {
  const { data: featured } = useFeaturedProfessionals(4);

  const galleryImages = featured
    ? featured
        .flatMap((p) => p.workGallery)
        .filter((entry): entry is NonNullable<typeof entry> => entry != null)
    : [];

  return (
    <>
      <Helmet>
        <title>{`${SITE_NAME} — Encontrá al profesional que necesitás`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />

        <meta property="og:title" content={`${SITE_NAME} — Encontrá al profesional que necesitás`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={defaultOgImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SITE_NAME} — Encontrá al profesional que necesitás`} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />

        <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
      </Helmet>
      <div>
        <HeroSection />
        <SpecialtyLinks />
        <FeaturedProfessionals />

        {galleryImages.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
              Galería de trabajos
            </h2>
            <GalleryCarousel images={galleryImages} />
          </section>
        )}
      </div>
    </>
  );
}
