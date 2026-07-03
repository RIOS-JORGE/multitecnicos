import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_DESCRIPTION, REFERRAL_EMAIL } from '../lib/constants';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>{`Sobre el Directorio | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content={`Conocé ${SITE_NAME}. ${SITE_DESCRIPTION}`}
        />

        <meta property="og:title" content={`Sobre el Directorio | ${SITE_NAME}`} />
        <meta
          property="og:description"
          content={`Conocé ${SITE_NAME}. ${SITE_DESCRIPTION}`}
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Sobre el Directorio | ${SITE_NAME}`} />
        <meta
          name="twitter:description"
          content={`Conocé ${SITE_NAME}. ${SITE_DESCRIPTION}`}
        />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Sobre el Directorio
        </h1>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>Multitécnicos</strong> nace con la idea de conectar
            a profesionales de distintos rubros con personas que necesitan sus
            servicios. Sabemos lo difícil que es encontrar un buen
            plomero, electricista, carpintero o cualquier otro profesional de
            confianza.
          </p>

          <p>
            Cada profesional en nuestro directorio es gestionado directamente por
            nuestro equipo, asegurando que la información sea correcta y esté
            actualizada.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            ¿Cómo funciona?
          </h2>

          <ol className="list-decimal list-inside space-y-2">
            <li>Buscá la especialidad que necesitás</li>
            <li>Explorá los profesionales disponibles</li>
            <li>Contactalos directamente por WhatsApp</li>
            <li>Describí tu consulta y recibí una respuesta rápida</li>
          </ol>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Aviso importante
          </h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm space-y-2">
            <p>
              Multitécnicos es únicamente un directorio que conecta a profesionales
              con clientes. No somos prestadores de servicios ni empleadores de los profesionales
              listados.
            </p>
            <p>
              Cada profesional es responsable por la calidad, seguridad, y cumplimiento de los
              trabajos que realiza. Recomendamos siempre solicitar un presupuesto por escrito y
              verificar referencias antes de contratar.
            </p>
            <p>
              No manejamos dinero, no facturamos, ni cobramos comisiones por los servicios
              prestados. Los acuerdos económicos y contractuales son exclusiva responsabilidad de
              las partes involucradas.
            </p>
            <p>
              ¿Tuviste una experiencia con algún profesional? Ayudanos a mantener la calidad del
              directorio. Escribinos a{' '}
              <a
                href={`mailto:${REFERRAL_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {REFERRAL_EMAIL}
              </a>{' '}
              y contanos tu experiencia para que podamos tomar las medidas necesarias.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Contacto
          </h2>

          <p>
            Si sos profesional y querés formar parte del directorio, o si tenés
            alguna consulta, escribinos a{' '}
            <a href="mailto:multitecnicos.info@gmail.com" className="text-blue-600 hover:underline">
              multitecnicos.info@gmail.com
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
