import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/GitHubIcon'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import { renderMarkdownBody, extractH2Headings } from '@/lib/markdown'
import { pickHeroImage, getGalleryImages, getImageDimensions } from '@/lib/images'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Chip } from '@/components/ui/Chip'
import { StatusBadge } from '@/components/portfolio/StatusBadge'
import { DomainTag } from '@/components/portfolio/DomainTag'
import { MetricDisplay } from '@/components/portfolio/MetricDisplay'
import { ProjectNavSidebar, ProjectNavMobile } from '@/components/portfolio/ProjectNav'
import { Gallery } from '@/components/portfolio/Gallery'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)?.meta
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Bhanuprasad Kokkula`,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline, type: 'website' },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const entry = getProjectBySlug(params.slug)
  if (!entry) notFound()
  const { meta: project, body } = entry
  const { title, tagline, domains, status, stack, metrics, links, slug } = project

  const heroSrc = pickHeroImage(slug, body)
  const heroDims = heroSrc ? getImageDimensions(heroSrc) : null
  const galleryImages = getGalleryImages(slug, body, heroSrc).map((src) => ({
    src,
    ...getImageDimensions(src),
  }))

  const headings = extractH2Headings(body)
  const navItems = galleryImages.length > 0 ? [...headings, { id: 'gallery', text: 'Gallery' }] : headings

  const renderedBody = await renderMarkdownBody(body)
  const hasLinks = links?.github || links?.demo || links?.writeup

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 dark:bg-neutral-950 pt-11">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          {/* Breadcrumb */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            Portfolio
          </Link>

          {/* Header */}
          <header className="max-w-3xl mb-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <StatusBadge status={status} />
              {domains.map((d) => (
                <DomainTag key={d} domain={d} />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight mb-4">
              {title}
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">{tagline}</p>
          </header>

          {/* Hero image */}
          {heroSrc && heroDims && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-cream-200 dark:border-neutral-800">
              <Image
                src={heroSrc}
                alt={title}
                width={heroDims.width}
                height={heroDims.height}
                sizes="(max-width: 1024px) 100vw, 1152px"
                style={{ width: '100%', height: 'auto' }}
                priority
              />
            </div>
          )}

          {/* Stat grid */}
          {metrics && metrics.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <MetricDisplay metric={m} compact={false} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile jump nav */}
          <ProjectNavMobile items={navItems} />

          {/* Sidebar nav + prose body */}
          <div className="grid lg:grid-cols-[200px_1fr] gap-10">
            <ProjectNavSidebar items={navItems} />

            <div className="max-w-3xl">
              <article className="prose prose-neutral dark:prose-invert prose-img:rounded-xl prose-headings:scroll-mt-24 prose-headings:font-bold prose-h2:text-2xl prose-h3:text-lg prose-a:underline">
                {renderedBody}
              </article>

              {/* Stack */}
              <section className="mt-14">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                  Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {stack.map((t) => (
                    <Chip key={t} label={t} />
                  ))}
                </div>
              </section>

              {/* Gallery — auto-generated from images not already shown inline */}
              {galleryImages.length > 0 && (
                <section id="gallery" className="mt-14 scroll-mt-24">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                    Gallery
                  </h2>
                  <Gallery images={galleryImages} />
                </section>
              )}

              {/* Links */}
              {hasLinks && (
                <section className="mt-14">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                    Links
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {links?.github && (
                      <a
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-cream-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all"
                      >
                        <GitHubIcon size={14} /> GitHub
                      </a>
                    )}
                    {links?.demo && (
                      <a
                        href={links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-cream-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {links?.writeup && (
                      <a
                        href={links.writeup}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-cream-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all"
                      >
                        <FileText size={14} /> Write-up
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Back */}
              <div className="mt-16 pt-8 border-t border-cream-200 dark:border-neutral-800">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
