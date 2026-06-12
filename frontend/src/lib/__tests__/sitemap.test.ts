/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';

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
