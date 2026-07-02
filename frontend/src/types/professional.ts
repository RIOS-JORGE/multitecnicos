import type { StrapiMedia, StrapiBlock } from './strapi';

export type Specialty =
  | 'plomeria'
  | 'electricidad'
  | 'gas'
  | 'pintura'
  | 'herreria'
  | 'carpinteria'
  | 'jardineria'
  | 'climatizacion'
  | 'otros';

export interface SocialLink {
  id: number;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok';
  url: string;
}

export interface WorkGalleryEntry {
  id: number;
  image: StrapiMedia;
  caption: string | null;
}

export interface Professional {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | StrapiBlock[];
  specialty: Specialty;
  photo: StrapiMedia | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  socialLinks: SocialLink[];
  workGallery: WorkGalleryEntry[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
