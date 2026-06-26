import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeReact from 'rehype-react'
import * as jsxRuntime from 'react/jsx-runtime'
import GithubSlugger from 'github-slugger'
import type { ReactNode } from 'react'
import { ProseImage } from '@/components/portfolio/ProseImage'

export interface Heading {
  id: string
  text: string
}

// Each project's prose body starts with an H1 restating the title — the detail
// page already renders that title separately, so drop the duplicate.
export function stripLeadingH1(markdown: string): string {
  const lines = markdown.split('\n')
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++
  if (/^#\s+/.test(lines[i] ?? '')) lines.splice(i, 1)
  return lines.join('\n')
}

// Walks every heading in document order (skipping fenced code blocks, where a
// line starting with "#" is a comment, not a heading) using ONE GithubSlugger
// instance — the same de-duplication behavior rehype-slug uses internally —
// so these ids exactly match the ids rehype-slug assigns when rendering.
export function extractH2Headings(markdown: string): Heading[] {
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = line.match(/^(#{1,6})\s+(.+)$/)
    if (!m) continue
    const depth = m[1].length
    const text = m[2].trim()
    const id = slugger.slug(text)
    if (depth === 2) headings.push({ id, text })
  }
  return headings
}

const renderCache = new Map<string, ReactNode>()

export async function renderMarkdownBody(markdown: string): Promise<ReactNode> {
  const cached = renderCache.get(markdown)
  if (cached) return cached

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeReact, {
      Fragment: jsxRuntime.Fragment,
      jsx: jsxRuntime.jsx,
      jsxs: jsxRuntime.jsxs,
      components: { img: ProseImage },
    })
    .process(markdown)

  const result = file.result as ReactNode
  renderCache.set(markdown, result)
  return result
}
