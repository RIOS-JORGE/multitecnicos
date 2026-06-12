#!/usr/bin/env node

/**
 * Build-time sitemap generator.
 *
 * Fetches professional slugs from Strapi and merges them with static routes
 * to produce a single sitemap.xml in the dist/ directory.
 *
 * Graceful fallback: if Strapi is unreachable after 3 retries, emits a sitemap
 * with static routes only and logs a warning. The build NEVER fails from this script.
 */

const STRAPI_URL = process.env.VITE_STRAPI_URL || '';
const BASE_URL = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://tudominio.com';
const SITEMAP_PATH = 'dist/sitemap.xml';

const STATIC_ROUTES = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/profesionales', priority: 0.8, changefreq: 'weekly' },
  { loc: '/nosotros', priority: 0.5, changefreq: 'monthly' },
];

/**
 * Sleep for ms milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch slugs from Strapi with retry logic.
 * Returns an array of route objects, or throws if all retries fail.
 */
async function fetchDynamicRoutes() {
  if (!STRAPI_URL) {
    console.warn('[sitemap] VITE_STRAPI_URL is not set — skipping dynamic routes');
    return [];
  }

  const url = `${STRAPI_URL}/api/professionals?fields[0]=slug&pagination[limit]=1000`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        throw new Error(`Strapi responded with ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      const data = json.data || [];

      return data.map((entry) => ({
        loc: `/profesionales/${entry.slug}`,
        priority: 0.6,
        changefreq: 'daily',
        lastmod: entry.updatedAt
          ? new Date(entry.updatedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      }));
    } catch (err) {
      console.warn(`[sitemap] Attempt ${attempt}/3 failed: ${err.message}`);
      if (attempt < 3) {
        const delay = 1000 * attempt; // 1s, 2s
        console.warn(`[sitemap] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error('All 3 attempts to reach Strapi failed');
}

/**
 * Build a sitemap XML string from an array of route objects.
 * Each route object must have: loc, priority, changefreq.
 * Optional: lastmod.
 */
function buildXml(routes) {
  const urlElements = routes
    .map((route) => {
      const lastmod = route.lastmod
        ? `    <lastmod>${route.lastmod}</lastmod>`
        : '';
      return `  <url>
    <loc>${BASE_URL}${route.loc}</loc>${lastmod}
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

async function main() {
  let allRoutes = [...STATIC_ROUTES];

  try {
    const dynamicRoutes = await fetchDynamicRoutes();
    allRoutes = allRoutes.concat(dynamicRoutes);
    console.log(`[sitemap] Fetched ${dynamicRoutes.length} dynamic routes`);
  } catch (err) {
    console.warn(`[sitemap] ${err.message}`);
    console.warn('[sitemap] Generating sitemap with static routes only');
  }

  const xml = buildXml(allRoutes);

  // Write dist/sitemap.xml
  const fs = await import('fs');
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
  console.log(`[sitemap] Wrote ${SITEMAP_PATH} with ${allRoutes.length} URLs`);
}

main().catch((err) => {
  console.error('[sitemap] Unexpected error:', err.message);
  process.exit(1);
});
