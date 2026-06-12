import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getStrapiMediaUrl } from '../../lib/strapi';
import type { StrapiMedia } from '../../types/strapi';

interface GalleryCarouselProps {
  images: { image: StrapiMedia; caption?: string | null }[];
  className?: string;
  autoplay?: boolean;
  showDots?: boolean;
}

export default function GalleryCarousel({
  images,
  className = '',
  autoplay = true,
  showDots = true,
}: GalleryCarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: true })] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((item, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0 relative">
              <img
                src={getStrapiMediaUrl(item.image?.url) || ''}
                alt={item.caption || ''}
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showDots && images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === selectedIndex
                  ? 'bg-blue-600 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
