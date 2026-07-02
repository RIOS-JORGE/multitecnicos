import type { Specialty } from '../types/professional';

export const SITE_NAME = 'Multitécnicos';

export const SITE_DESCRIPTION =
  'Multitécnicos — profesionales de mantenimiento y oficios. Encontrá plomeros, electricistas, carpinteros y más, todos verificados y cerca tuyo.';

export const SITE_URL: string =
  import.meta.env.VITE_SITE_URL || 'https://multitecnicos.com.ar';

export const SPECIALTIES: { value: Specialty; label: string; icon: string }[] = [
  { value: 'plomeria', label: 'Plomería', icon: '🔧' },
  { value: 'electricidad', label: 'Electricidad', icon: '⚡' },
  { value: 'gas', label: 'Gas', icon: '🔥' },
  { value: 'pintura', label: 'Pintura', icon: '🎨' },
  { value: 'herreria', label: 'Herrería', icon: '🔩' },
  { value: 'carpinteria', label: 'Carpintería', icon: '🪚' },
  { value: 'jardineria', label: 'Jardinería', icon: '🌿' },
  { value: 'climatizacion', label: 'Climatización', icon: '❄️' },
  { value: 'otros', label: 'Otros', icon: '🛠️' },
];

export const SPECIALTY_MAP: Record<Specialty, string> = Object.fromEntries(
  SPECIALTIES.map((s) => [s.value, s.label])
) as Record<Specialty, string>;

export const SOCIAL_PLATFORMS: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: '#E4405F' },
  facebook: { label: 'Facebook', color: '#1877F2' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  twitter: { label: 'Twitter / X', color: '#000000' },
  youtube: { label: 'YouTube', color: '#FF0000' },
  tiktok: { label: 'TikTok', color: '#000000' },
};

export const DEFAULT_WA_MESSAGE = 'Hola, te contacto desde Multitécnicos.';

export const REFERRAL_EMAIL: string =
  import.meta.env.VITE_REFERRAL_EMAIL || 'referencias@multitecnicos.com.ar';

export const WA_MESSAGE_TEMPLATE = (
  specialty: string,
  clientMessage: string
) =>
  `Hola, te contacto desde Multitécnicos.\n` +
  `Especialidad: ${specialty}\n` +
  `Consulta: ${clientMessage}`;
