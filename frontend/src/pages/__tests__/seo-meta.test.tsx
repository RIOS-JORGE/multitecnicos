import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { renderWithProviders } from '../../test/test-utils';
import { server } from '../../test/mocks/server';
import { mockProfessionals } from '../../test/mocks/handlers';
import AboutPage from '../AboutPage';
import ProfessionalsListPage from '../ProfessionalsListPage';
import HomePage from '../HomePage';
import ProfessionalDetailPage from '../ProfessionalDetailPage';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * In jsdom, react-helmet-async updates the <title> element only when its
 * children are a single expression (not a JSX interpolated array).
 * Use document.title or querySelector('title') to assert.
 */
function getTitle(): string {
  return document.title || document.querySelector('title')?.textContent || '';
}

describe('SEO Meta Tags', () => {
  describe('HomePage', () => {
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

    it('renders correct document title', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(
        () => {
          expect(getTitle()).toContain('Multitécnicos');
        },
        { timeout: 3000 }
      );
    });

    it('renders meta description', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(
        () => {
          const metaDesc = document.querySelector('meta[name="description"]');
          expect(metaDesc).not.toBeNull();
          expect(metaDesc?.getAttribute('content')).toContain('plomeros');
        },
        { timeout: 3000 }
      );
    });

    it('renders OG meta tags', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(
        () => {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          expect(ogTitle).not.toBeNull();
          expect(ogTitle?.getAttribute('content')).toContain('Multitécnicos');
        },
        { timeout: 3000 }
      );
    });

    it('renders Twitter card meta', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(
        () => {
          const twitterCard = document.querySelector('meta[name="twitter:card"]');
          expect(twitterCard).not.toBeNull();
          expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
        },
        { timeout: 3000 }
      );
    });
  });

  describe('ProfessionalsListPage', () => {
    it('renders default title when no filter is active', async () => {
      renderWithProviders(<ProfessionalsListPage />);

      await waitFor(
        () => {
          expect(getTitle()).toContain('Profesionales');
        },
        { timeout: 3000 }
      );
    });

    it('renders specialty-specific title when filter is active', async () => {
      renderWithProviders(<ProfessionalsListPage />, {
        initialEntries: ['/profesionales?especialidad=plomeria'],
      });

      await waitFor(
        () => {
          expect(getTitle()).toContain('Plomería');
        },
        { timeout: 3000 }
      );
    });

    it('renders meta description with specialty name when filter is active', async () => {
      renderWithProviders(<ProfessionalsListPage />, {
        initialEntries: ['/profesionales?especialidad=electricidad'],
      });

      await waitFor(
        () => {
          const metaDesc = document.querySelector('meta[name="description"]');
          expect(metaDesc).not.toBeNull();
          expect(metaDesc?.getAttribute('content')).toContain('electricidad');
        },
        { timeout: 3000 }
      );
    });
  });

  describe('AboutPage', () => {
    it('renders correct document title', () => {
      renderWithProviders(<AboutPage />);
      expect(getTitle()).toContain('Sobre el Directorio');
    });

    it('renders meta description', () => {
      renderWithProviders(<AboutPage />);
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc).not.toBeNull();
      expect(metaDesc?.getAttribute('content')).toContain('Multitécnicos');
    });
  });

  describe('ProfessionalDetailPage', () => {
    it('renders document title with professional name', async () => {
      server.use(
        http.get('*/api/professionals', () =>
          HttpResponse.json({
            data: mockProfessionals[0],
            meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
          })
        )
      );

      renderWithProviders(
        <Routes>
          <Route path="/profesionales/:slug" element={<ProfessionalDetailPage />} />
        </Routes>,
        { initialEntries: ['/profesionales/juan-perez'] }
      );

      await waitFor(
        () => {
          expect(getTitle()).toContain('Juan Pérez');
        },
        { timeout: 3000 }
      );
    });
  });
});
