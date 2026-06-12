import { SPECIALTY_MAP } from '../../lib/constants';
import { getStrapiMediaUrl } from '../../lib/strapi';
import type { Professional } from '../../types/professional';
import ImageWithFallback from '../ui/ImageWithFallback';

interface ProfileHeaderProps {
  professional: Professional;
}

export default function ProfileHeader({ professional }: ProfileHeaderProps) {
  const { name, photo, specialty } = professional;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
      <ImageWithFallback
        src={getStrapiMediaUrl(photo?.url)}
        alt={name}
        className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover flex-shrink-0"
        fallback={name.charAt(0).toUpperCase()}
      />
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {name}
        </h1>
        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {SPECIALTY_MAP[specialty]}
        </span>
      </div>
    </div>
  );
}
