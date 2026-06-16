/// <reference types="node" />

/**
 * @vitest-environment node
 *
 * Sanity checks for static assets that are referenced in code
 * but could silently go missing (e.g. OG fallback image).
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const PUBLIC_DIR = resolve(__dirname, '../../../public');

describe('static assets', () => {
  it('og-default.svg exists in public/ (referenced by HomePage and ProfessionalDetailPage)', () => {
    expect(existsSync(`${PUBLIC_DIR}/og-default.svg`)).toBe(true);
  });

  it('robots.txt exists in public/', () => {
    expect(existsSync(`${PUBLIC_DIR}/robots.txt`)).toBe(true);
  });

  it('robots.txt Sitemap URL points to the correct domain', () => {
    const content = readFileSync(`${PUBLIC_DIR}/robots.txt`, 'utf-8');
    expect(content).toContain('Sitemap: https://multitecnicos.com.ar/sitemap.xml');
  });
});
