import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const IMAGE_RE = /\.(png|jpe?g|webp)$/i
const INLINE_IMAGE_RE = /!\[[^\]]*\]\((\/projects\/[^)\s]+)\)/g

const dimensionsCache = new Map<string, { width: number; height: number }>()

export function getImageDimensions(publicSrc: string): { width: number; height: number } {
  const cached = dimensionsCache.get(publicSrc)
  if (cached) return cached
  const buffer = fs.readFileSync(path.join(PUBLIC_DIR, publicSrc))
  const { width, height } = imageSize(buffer)
  const dims = { width: width ?? 1200, height: height ?? 800 }
  dimensionsCache.set(publicSrc, dims)
  return dims
}

export function listProjectImages(slug: string): string[] {
  const dir = path.join(PUBLIC_DIR, 'projects', slug)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .sort()
    .map((f) => `/projects/${slug}/${f}`)
}

function inlineImageSrcs(body: string): Set<string> {
  return new Set([...body.matchAll(INLINE_IMAGE_RE)].map((m) => m[1]))
}

// First image referenced inline in the body (document order); falls back to the
// first image in the project's public folder if the body has no inline images.
export function pickHeroImage(slug: string, body: string): string | null {
  const first = body.matchAll(INLINE_IMAGE_RE).next()
  if (!first.done) return first.value[1]
  return listProjectImages(slug)[0] ?? null
}

// Images in the public folder that the body doesn't already show inline, minus
// whichever image was chosen as the hero — these become the auto-generated Gallery.
export function getGalleryImages(slug: string, body: string, heroSrc: string | null): string[] {
  const referenced = inlineImageSrcs(body)
  return listProjectImages(slug).filter((src) => !referenced.has(src) && src !== heroSrc)
}
