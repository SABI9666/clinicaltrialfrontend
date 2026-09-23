import { resolveImage } from '../lib/api.js';

/**
 * Renders a WebP source with a JPEG/PNG fallback when the content provides
 * both, and a plain <img> when it only has one file (an admin upload).
 */
export default function Image({ image, className, loading = 'lazy', ...rest }) {
  if (!image?.src) return null;
  const src = resolveImage(image.src);
  const webp = image.webp ? resolveImage(image.webp) : null;
  const img = (
    <img src={src} alt={image.alt ?? ''} className={className} loading={loading} {...rest} />
  );

  if (!webp) return img;
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      {img}
    </picture>
  );
}
