import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { renderWithProviders } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import { mockProfessionals } from '../../test/mocks/handlers';
import Layout from '../../components/layout/Layout';
import HomePage from '../HomePage';
import ProfessionalDetailPage from '../ProfessionalDetailPage';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * Extract JSON-LD script contents from <head>.
 */
function getJsonLdScripts(): string[] {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  return Array.from(scripts).map((s) => s.textContent || '');
}

/**
 * Parse a JSON-LD string, unescaping Helmet's HTML entities.
 */
function parseJsonLd(raw: string): Record<string, unknown> {
  return JSON.parse(raw.replace(/&quot;/g, '"').replace(/&#x27;/g, "'"));
}

describe('JSON-LD Structured Data', () => {
  describe('Layout (Organization schema)', () => {
    it('renders Organization JSON-LD for every page', () => {
      renderWithProviders(<Layout />);

      const scripts = getJsonLdScripts();
      const orgLd = scripts.find((s) => s.includes('"Organization"'));
      expect(orgLd).toBeTruthy();

      const parsed = parseJsonLd(orgLd!);
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('Directorio Profesional');
      expect(parsed.url).toBeTruthy();
      expect(parsed.contactPoint).toBeTruthy();
    });
  });

  describe('HomePage (WebSite schema)', () => {
    beforeEach(() => {
      server.use(
        http.get('*/api/professionals', () =>
          HttpResponse.json({
            data: [],
            meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
          })
        )
      );
    });

    it('injects WebSite schema in JSON-LD', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(
        () => {
          const scripts = getJsonLdScripts();
          const websiteLd = scripts.find((s) => s.includes('"WebSite"'));
          expect(websiteLd).toBeTruthy();

          const parsed = parseJsonLd(websiteLd!);
          expect(parsed['@type']).toBe('WebSite');
          expect(parsed.name).toBe('Directorio Profesional');
          expect(parsed.url).toBeTruthy();
          expect(parsed.description).toBeTruthy();
          expect(parsed.inLanguage).toBe('es-AR');
        },
        { timeout: 3000 }
      );
    });

    it('WebSite schema includes SearchAction', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(
        () => {
          const scripts = getJsonLdScripts();
          const websiteLd = scripts.find((s) => s.includes('"WebSite"'));
          expect(websiteLd).toBeTruthy();

          const parsed = parseJsonLd(websiteLd!);
          const action = parsed.potentialAction as Record<string, unknown>;
          expect(action['@type']).toBe('SearchAction');
          expect(action['query-input']).toBe('required name=query');
        },
        { timeout: 3000 }
      );
    });
  });

  describe('ProfessionalDetailPage (ProfessionalService + Person schema)', () => {
    beforeEach(() => {
      server.use(
        http.get('*/api/professionals', () =>
          HttpResponse.json({
            data: mockProfessionals[0],
            meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
          })
        )
      );
    });

    it('injects ProfessionalService + Person schema', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/profesionales/:slug" element={<ProfessionalDetailPage />} />
        </Routes>,
        { initialEntries: ['/profesionales/juan-perez'] }
      );

      await waitFor(
        () => {
          const scripts = getJsonLdScripts();
          const personLd = scripts.find(
            (s) => s.includes('"ProfessionalService"') && s.includes('"Person"')
          );
          expect(personLd).toBeTruthy();

          const parsed = parseJsonLd(personLd!);
          const types = Array.isArray(parsed['@type']) ? parsed['@type'] : [parsed['@type']];
          expect(types).toContain('ProfessionalService');
          expect(types).toContain('Person');
          expect(parsed.name).toBe('Juan Pérez');
        },
        { timeout: 3000 }
      );
    });

    it('ProfessionalService schema includes areaServed', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/profesionales/:slug" element={<ProfessionalDetailPage />} />
        </Routes>,
        { initialEntries: ['/profesionales/juan-perez'] }
      );

      await waitFor(
        () => {
          const scripts = getJsonLdScripts();
          const personLd = scripts.find(
            (s) => s.includes('"ProfessionalService"') && s.includes('"Person"')
          );
          expect(personLd).toBeTruthy();

          const parsed = parseJsonLd(personLd!);
          expect(parsed.areaServed).toBe('Argentina');
          expect(parsed.priceRange).toBe('$$');
          expect(parsed.knowsAbout).toBe('Plomería');
        },
        { timeout: 3000 }
      );
    });
  });
});
