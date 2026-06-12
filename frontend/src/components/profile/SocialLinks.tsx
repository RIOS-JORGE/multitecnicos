import type { SocialLink as SocialLinkType } from '../../types/professional';
import { SOCIAL_PLATFORMS } from '../../lib/constants';

interface SocialLinksProps {
  links: SocialLinkType[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Redes sociales</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const platform = SOCIAL_PLATFORMS[link.platform];
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
              title={platform?.label || link.platform}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: platform?.color || '#666' }}
              />
              {platform?.label || link.platform}
            </a>
          );
        })}
      </div>
    </div>
  );
}
