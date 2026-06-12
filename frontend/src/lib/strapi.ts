import qs from 'qs';
import type { StrapiResponse, StrapiSingleResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || '';

export function getStrapiMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (STRAPI_URL) return `${STRAPI_URL}${path}`;
  return path;
}

export function buildUrl(
  path: string,
  params?: Record<string, any>
): string {
  const base = `${STRAPI_URL}${path}`;
  if (!params) return base;
  const query = qs.stringify(params, { encodeValuesOnly: true });
  return query ? `${base}?${query}` : base;
}

async function strapiFetch<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = buildUrl(path, params);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Strapi error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function fetchProfessionals(
  params?: Record<string, any>
): Promise<StrapiResponse<import('../types/professional').Professional>> {
  return strapiFetch('/api/professionals', {
    populate: {
      photo: true,
      socialLinks: true,
      workGallery: { populate: { image: true } },
    },
    ...params,
  });
}

export function fetchProfessional(
  slug: string
): Promise<StrapiSingleResponse<import('../types/professional').Professional>> {
  return strapiFetch('/api/professionals', {
    filters: { slug: { $eq: slug } },
    populate: {
      photo: true,
      socialLinks: true,
      workGallery: { populate: { image: true } },
    },
  });
}
