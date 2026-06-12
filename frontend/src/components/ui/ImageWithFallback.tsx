interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallback,
  loading = 'lazy',
  width,
  height,
}: ImageWithFallbackProps) {
  if (!src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <span className="text-2xl font-bold">
          {fallback || alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
        const parent = (e.target as HTMLImageElement).parentElement;
        if (parent) {
          const fallbackEl = document.createElement('div');
          fallbackEl.className =
            'bg-gray-200 flex items-center justify-center text-gray-400 w-full h-full';
          fallbackEl.innerHTML = `<span class="text-2xl font-bold">${fallback || alt.charAt(0).toUpperCase()}</span>`;
          parent.appendChild(fallbackEl);
        }
      }}
    />
  );
}
