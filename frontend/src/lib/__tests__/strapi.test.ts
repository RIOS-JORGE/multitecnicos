import { describe, it, expect } from 'vitest';
import { buildUrl, getStrapiMediaUrl } from '../strapi';

describe('buildUrl', () => {
  it('returns base path when no params', () => {
    const url = buildUrl('/api/professionals');
    expect(url).toBe('/api/professionals');
  });

  it('adds populate query string via qs', () => {
    const url = buildUrl('/api/professionals', { populate: { photo: true } });
    expect(url).toContain('/api/professionals?');
    expect(url).toContain('populate');
  });
});

describe('getStrapiMediaUrl', () => {
  it('returns null for null input', () => {
    expect(getStrapiMediaUrl(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(getStrapiMediaUrl(undefined)).toBeNull();
  });

  it('returns path as-is when relative and no STRAPI_URL', () => {
    const result = getStrapiMediaUrl('/uploads/photo.jpg');
    expect(result).toBe('/uploads/photo.jpg');
  });

  it('returns full URL when input already starts with http', () => {
    const result = getStrapiMediaUrl('https://example.com/photo.jpg');
    expect(result).toBe('https://example.com/photo.jpg');
  });

});
