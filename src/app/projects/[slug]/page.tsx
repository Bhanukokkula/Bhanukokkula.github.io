import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/GitHubIcon'
import { projects } from '@/data/projects'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Chip } from '@/components/ui/Chip'
import { StatusBadge } from '@/components/portfolio/StatusBadge'
import { DomainTag } from '@/components/portfolio/DomainTag'
import { MetricDisplay } from '@/components/portfolio/MetricDisplay'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Bhanuprasad Kokkula`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: 'website',
    },
  }
}

function renderHighlight(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-neutral-900 dark:text-neutral-50">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function ProjectDetailPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()

  const { title, tagline, domains, status, problem, approach, stack, metrics, highlights, links } = project
  const hasLinks = links?.github || links?.demo || links?.writeup

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 dark:bg-neutral-950 pt-11">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-16">
          {/* Breadcrumb */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-12"
          >
            <ArrowLeft size={14} />
            Portfolio
          </Link>

          {/* Hero */}
          <header className="mb-14">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <StatusBadge status={status} />
              {domains.map((d) => (
                <DomainTag key={d} domain={d} />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight mb-4">
              {title}
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
              {tagline}
            </p>
          </header>

          {/* Body */}
          <div className="space-y-12">
            {/* Problem */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                The Problem
              </h2>
              <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {problem}
              </p>
            </section>

            {/* Approach */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                The Approach
              </h2>
              <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {approach}
              </p>
            </section>

            {/* Metrics — target or result, driven by data */}
            {metrics && metrics.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                  Metrics
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    >
                      <MetricDisplay metric={m} compact={false} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Stack */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {stack.map((t) => (
                  <Chip key={t} label={t} />
                ))}
              </div>
            </section>

            {/* Notes / qualitative highlights */}
            {highlights && highlights.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
                  Notes
                </h2>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                    >
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                      <span>{renderHighlight(h)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Links */}
            {hasLinks && (
              <section>
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
          </div>

          {/* Back */}
          <div className="mt-20 pt-8 border-t border-cream-200 dark:border-neutral-800">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
