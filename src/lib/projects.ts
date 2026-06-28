// Server-only data layer. Reads content/projects/<slug>/index.md at build/request time.
// Adding a project = adding a folder here; no code changes required.
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Project } from '@/data/projects'
import { stripLeadingH1 } from '@/lib/markdown'
import { pickHeroImage } from '@/lib/images'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

// Display order: featured projects keep this array's order; non-featured fall back to
// status order (Completed → Building → Planned) in ProjectsGrid's sort, not here.
const SLUG_ORDER = [
  'filings-reasoning-engine',
  'mars',
  'quant-factor-backtest',
  'comps-valuation-engine',
  'covenant-compliance-engine',
  'criteo-uplift',
  'learning-mindsets-causal',
  'pharma-ai',
  'loan-approval-prediction',
  'ecommerce-engagement-conversion',
  'seq-lasso-net',
  'evidence-asymmetry-study',
]

let cache: { meta: Project; body: string }[] | null = null

function loadAll(): { meta: Project; body: string }[] {
  if (cache) return cache

  const slugs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  const entries = slugs.map((slug) => {
    const file = fs.readFileSync(path.join(CONTENT_DIR, slug, 'index.md'), 'utf-8')
    const { data, content } = matter(file)
    return { meta: data as Project, body: stripLeadingH1(content.trim()) }
  })

  entries.sort((a, b) => {
    const ai = SLUG_ORDER.indexOf(a.meta.slug)
    const bi = SLUG_ORDER.indexOf(b.meta.slug)
    return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi)
  })

  cache = entries
  return entries
}

export function getAllProjects(): Project[] {
  return loadAll().map((e) => e.meta)
}

export function getProjectBySlug(slug: string): { meta: Project; body: string } | null {
  return loadAll().find((e) => e.meta.slug === slug) ?? null
}

// Same image chosen as the detail page's hero — keeps card thumbnails and the
// detail page consistent for the same project.
export function getProjectThumbnail(slug: string): string | null {
  const entry = getProjectBySlug(slug)
  if (!entry) return null
  return pickHeroImage(slug, entry.body)
}

export function getThumbnails(slugs: string[]): Record<string, string | null> {
  return Object.fromEntries(slugs.map((s) => [s, getProjectThumbnail(s)]))
}
