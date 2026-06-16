import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { SITE_NAME, SITE_URL } from '../../lib/constants';
import Header from './Header';
import Footer from './Footer';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'Multitécnicos — profesionales de mantenimiento y oficios',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@directorioprofesional.com',
    contactType: 'customer service',
  },
};

const strapiUrl = import.meta.env.VITE_STRAPI_URL as string | undefined;

export default function Layout() {
  return (
    <>
      <Helmet>
        {strapiUrl && (
          <>
            <link rel="preconnect" href={strapiUrl} />
            <link rel="dns-prefetch" href={strapiUrl} />
          </>
        )}
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
