import { http, HttpResponse } from 'msw';

export const mockProfessionals = [
  {
    id: 1,
    documentId: 'doc1',
    name: 'Juan Pérez',
    slug: 'juan-perez',
    description: [],
    specialty: 'plomeria',
    photo: null,
    phone: '5491123456789',
    website: null,
    email: null,
    socialLinks: [],
    workGallery: [],
    publishedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    documentId: 'doc2',
    name: 'María García',
    slug: 'maria-garcia',
    description: [],
    specialty: 'electricidad',
    photo: null,
    phone: '5491155555555',
    website: null,
    email: null,
    socialLinks: [],
    workGallery: [],
    publishedAt: '2026-01-02T00:00:00.000Z',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

export const handlers = [
  http.get('*/api/professionals', ({ request }) => {
    const url = new URL(request.url);
    const specialty = url.searchParams.get('filters[specialty][$eq]');

    let data = mockProfessionals;
    if (specialty) {
      data = mockProfessionals.filter((p) => p.specialty === specialty);
    }

    return HttpResponse.json({
      data,
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: data.length } },
    });
  }),
];
