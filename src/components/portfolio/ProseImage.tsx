import Image from 'next/image'
import { getImageDimensions } from '@/lib/images'

export function ProseImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null

  // External badges (e.g. shields.io) — render inline, no local file lookup
  if (/^https?:\/\//.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} className="inline-block h-5 align-middle mr-1.5" loading="lazy" />
  }

  const { width, height } = getImageDimensions(src)
  return (
    <span className="block my-6 rounded-xl overflow-hidden border border-cream-200 dark:border-neutral-800">
      <Image
        src={src}
        alt={alt ?? ''}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 720px"
        style={{ width: '100%', height: 'auto' }}
        loading="lazy"
      />
    </span>
  )
}
