import type { WorkGalleryEntry } from '../../types/professional';
import GalleryCarousel from '../home/GalleryCarousel';

interface WorkGalleryProps {
  entries: WorkGalleryEntry[];
}

export default function WorkGallery({ entries }: WorkGalleryProps) {
  if (!entries || entries.length === 0) return null;

  const images = entries.map((entry) => ({
    image: entry.image,
    caption: entry.caption,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Galería de trabajos
      </h3>
      <GalleryCarousel images={images} showDots={false} />
    </div>
  );
}
