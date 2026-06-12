import { useQuery } from '@tanstack/react-query';
import { fetchProfessionals, fetchProfessional } from '../lib/strapi';
import type { Professional, Specialty } from '../types/professional';

export function useProfessionals(specialty?: Specialty | null) {
  return useQuery({
    queryKey: ['professionals', specialty],
    queryFn: () =>
      fetchProfessionals(
        specialty
          ? { filters: { specialty: { $eq: specialty } } }
          : undefined
      ),
    select: (data) => data.data,
  });
}

export function useProfessional(slug: string) {
  return useQuery({
    queryKey: ['professional', slug],
    queryFn: () => fetchProfessional(slug),
    select: (data) => {
      const pros = data.data;
      return Array.isArray(pros) ? pros[0] ?? null : (pros as Professional);
    },
    enabled: !!slug,
  });
}

export function useFeaturedProfessionals(limit = 4) {
  return useQuery({
    queryKey: ['professionals', 'featured', limit],
    queryFn: () =>
      fetchProfessionals({
        pagination: { pageSize: limit },
        sort: 'createdAt:desc',
      }),
    select: (data) => data.data,
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: ['professionals', 'specialties'],
    queryFn: () => fetchProfessionals({ pagination: { pageSize: 100 } }),
    select: (data) => {
      const specialties = new Set(data.data.map((p) => p.specialty));
      return Array.from(specialties).sort();
    },
  });
}
