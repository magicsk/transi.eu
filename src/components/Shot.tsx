import { getImageProps } from 'next/image'

/**
 * Props for one app screenshot, e.g. screenshot('ios/map') -> /screenshots/ios/map-{dark,light}.webp.
 * Both platforms are captured at the same size (Android with its display set to 1206x2622), so the
 * phones match side by side.
 */
export function screenshot(name: string) {
  return { dark: `/screenshots/${name}-dark.webp`, light: `/screenshots/${name}-light.webp`, width: 1206, height: 2622 }
}

/**
 * An image with a dark and a light version that follows the page theme with no script:
 * the browser picks the source from prefers-color-scheme, so there is nothing to flash on hydration.
 */
export default function Shot({
  dark,
  light,
  width,
  height,
  alt,
  sizes,
  className,
}: {
  dark: string
  light: string
  width: number
  height: number
  alt: string
  sizes: string
  className?: string
}) {
  const common = { alt, width, height, sizes }
  const darkSet = getImageProps({ ...common, src: dark }).props.srcSet
  const { props } = getImageProps({ ...common, src: light })
  return (
    <picture className={className}>
      <source media="(prefers-color-scheme: dark)" srcSet={darkSet} sizes={sizes} />
      {/* a plain <img> on purpose: its props come from next/image (getImageProps), so it is still optimised */}
      {/* aspectRatio: keep the box exactly this shape once the file loads. A resized file's own ratio is a
          fraction of a pixel off, and that shift would make <Route /> redraw the line mid-scroll. */}
      <img {...props} alt={alt} style={{ ...props.style, aspectRatio: `${width} / ${height}` }} />
    </picture>
  )
}
