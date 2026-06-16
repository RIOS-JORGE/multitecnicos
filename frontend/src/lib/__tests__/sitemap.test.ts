/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest';

// --- Core logic extracted from scripts/generate-sitemap.mjs ---

interface Route {
  loc: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
}

function buildXml(routes: Route[], baseUrl: string): string {
  const urlElements = routes
    .map((route) => {
      const lastmod = route.lastmod
        ? `\n    <lastmod>${route.lastmod}</lastmod>`
        : '';
      return `  <url>
    <loc>${baseUrl}${route.loc}</loc>${lastmod}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

const STATIC_ROUTES = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/profesionales', priority: 0.8, changefreq: 'weekly' },
  { loc: '/nosotros', priority: 0.5, changefreq: 'monthly' },
];

const BASE_URL = 'https://example.com';

// --- Tests ---

describe('buildXml', () => {
  it('produces valid XML with urlset root', () => {
    const xml = buildXml(STATIC_ROUTES, BASE_URL);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('</urlset>');
  });

  it('includes all static routes', () => {
    const xml = buildXml(STATIC_ROUTES, BASE_URL);
    expect(xml).toContain(`${BASE_URL}/`);
    expect(xml).toContain(`${BASE_URL}/profesionales`);
    expect(xml).toContain(`${BASE_URL}/nosotros`);
  });

  it('sets correct priority per route', () => {
    const xml = buildXml(STATIC_ROUTES, BASE_URL);
    expect(xml).toContain('<priority>1.0</priority>');
    expect(xml).toContain('<priority>0.8</priority>');
    expect(xml).toContain('<priority>0.5</priority>');
  });

  it('sets changefreq per route', () => {
    const xml = buildXml(STATIC_ROUTES, BASE_URL);
    expect(xml).toContain('<changefreq>weekly</changefreq>');
    expect(xml).toContain('<changefreq>monthly</changefreq>');
  });

  it('includes dynamic routes when provided', () => {
    const routes = [
      ...STATIC_ROUTES,
      { loc: '/profesionales/juan-perez', priority: 0.6, changefreq: 'daily', lastmod: '2026-06-01' },
    ];
    const xml = buildXml(routes, BASE_URL);
    expect(xml).toContain(`${BASE_URL}/profesionales/juan-perez`);
    expect(xml).toContain('<lastmod>2026-06-01</lastmod>');
    expect(xml).toContain('<priority>0.6</priority>');
    expect(xml).toContain('<changefreq>daily</changefreq>');
  });

  it('produces well-formed XML with multiple routes', () => {
    const routes = [
      ...STATIC_ROUTES,
      { loc: '/profesionales/a', priority: 0.6, changefreq: 'daily' },
      { loc: '/profesionales/b', priority: 0.6, changefreq: 'daily', lastmod: '2026-06-02' },
    ];
    const xml = buildXml(routes, BASE_URL);

    // Verify total URL entries
    const urlMatches = xml.match(/<url>/g);
    expect(urlMatches).toHaveLength(5);

    // Verify proper nesting
    expect(xml).toContain('<loc>');
    expect(xml).toContain('</loc>');
    expect(xml).toContain('<priority>');
    expect(xml).toContain('</priority>');
    expect(xml).toContain('<changefreq>');
    expect(xml).toContain('</changefreq>');
  });
});

describe('static routes configuration', () => {
  it('has correct number of static routes', () => {
    expect(STATIC_ROUTES).toHaveLength(3);
  });

  it('homepage has highest priority', () => {
    const home = STATIC_ROUTES.find((r) => r.loc === '/');
    expect(home?.priority).toBe(1.0);
  });
});

// --- fetchDynamicRoutes retry/fallback logic ---

interface RouteRaw {
  slug: string;
  updatedAt?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Testable version of fetchDynamicRoutes from scripts/generate-sitemap.mjs.
 */
async function fetchDynamicRoutes(
  strapiUrl: string,
  fetchFn: typeof globalThis.fetch = globalThis.fetch,
): Promise<{ loc: string; priority: number; changefreq: string; lastmod: string }[]> {
  if (!strapiUrl) return [];

  const url = `${strapiUrl}/api/professionals?fields[0]=slug&pagination[limit]=1000`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetchFn(url, { signal: AbortSignal.timeout(8000) } as RequestInit);
      if (!res.ok) {
        throw new Error(`Strapi responded with ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      const data: RouteRaw[] = json.data || [];

      return data.map((entry) => ({
        loc: `/profesionales/${entry.slug}`,
        priority: 0.6,
        changefreq: 'daily' as const,
        lastmod: entry.updatedAt
          ? new Date(entry.updatedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      }));
    } catch (err) {
      if (attempt < 3) {
        await sleep(1000 * attempt);
      }
    }
  }

  throw new Error('All 3 attempts to reach Strapi failed');
}

describe('fetchDynamicRoutes', () => {
  it('returns empty array when STRAPI_URL is empty', async () => {
    const routes = await fetchDynamicRoutes('');
    expect(routes).toEqual([]);
  });

  it('returns mapped routes on successful fetch', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { slug: 'juan-perez', updatedAt: '2026-06-01T12:00:00Z' },
          { slug: 'maria-lopez' },
        ],
      }),
    });

    const routes = await fetchDynamicRoutes('https://api.test.com', mockFetch as unknown as typeof globalThis.fetch);

    expect(routes).toHaveLength(2);
    expect(routes[0].loc).toBe('/profesionales/juan-perez');
    expect(routes[0].priority).toBe(0.6);
    expect(routes[0].changefreq).toBe('daily');
    expect(routes[0].lastmod).toBe('2026-06-01');
    expect(routes[1].loc).toBe('/profesionales/maria-lopez');
    expect(routes[1].lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('falls back after all 3 retries fail and throws', { timeout: 20_000 }, async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(
      fetchDynamicRoutes('https://api.test.com', mockFetch as unknown as typeof globalThis.fetch),
    ).rejects.toThrow('All 3 attempts to reach Strapi failed');

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('retries on non-ok response and eventually throws', { timeout: 20_000 }, async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    });

    await expect(
      fetchDynamicRoutes('https://api.test.com', mockFetch as unknown as typeof globalThis.fetch),
    ).rejects.toThrow('All 3 attempts to reach Strapi failed');

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('succeeds on the second retry after first failure', { timeout: 20_000 }, async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ slug: 'recuperado', updatedAt: '2026-06-15T00:00:00Z' }],
        }),
      });

    const routes = await fetchDynamicRoutes('https://api.test.com', mockFetch as unknown as typeof globalThis.fetch);

    expect(routes).toHaveLength(1);
    expect(routes[0].loc).toBe('/profesionales/recuperado');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('handles empty JSON data array gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const routes = await fetchDynamicRoutes('https://api.test.com', mockFetch as unknown as typeof globalThis.fetch);

    expect(routes).toEqual([]);
  });
});
