import { Link } from 'react-router-dom';
import { SPECIALTY_MAP } from '../../lib/constants';
import { getStrapiMediaUrl } from '../../lib/strapi';
import type { Professional } from '../../types/professional';
import ImageWithFallback from '../ui/ImageWithFallback';

interface ProfessionalCardProps {
  professional: Professional;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const { slug, name, photo, specialty } = professional;

  return (
    <Link
      to={`/profesionales/${slug}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <ImageWithFallback
        src={getStrapiMediaUrl(photo?.formats?.thumbnail?.url || photo?.url)}
        alt={name}
        className="w-full h-48 object-cover"
        fallback={name.charAt(0).toUpperCase()}
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
          {SPECIALTY_MAP[specialty]}
        </span>
      </div>
    </Link>
  );
}
