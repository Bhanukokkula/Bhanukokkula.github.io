'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/GitHubIcon'
import { StatusBadge } from './StatusBadge'
import { DomainTag } from './DomainTag'
import { MetricDisplay } from './MetricDisplay'
import { Chip } from '@/components/ui/Chip'
import type { Project } from '@/data/projects'

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

function CardThumbnail({
  thumbnail,
  title,
  aspect,
}: {
  thumbnail?: string | null
  title: string
  aspect: string
}) {
  if (thumbnail) {
    return (
      <div className={`relative ${aspect} bg-cream-100 dark:bg-neutral-800`}>
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    )
  }
  // No screenshots available for this project — initials placeholder
  return (
    <div className={`relative ${aspect} bg-cream-100 dark:bg-neutral-800 flex items-center justify-center`}>
      <span className="text-4xl font-bold tracking-tight text-cream-300 dark:text-neutral-600 select-none">
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

interface PortfolioCardProps {
  project: Project
  thumbnail?: string | null
  // Pass forceRegular to render a featured project as a standard card (used in homepage section)
  forceRegular?: boolean
}

export function PortfolioCard({ project, thumbnail, forceRegular = false }: PortfolioCardProps) {
  const { slug, title, tagline, domains, status, featured, approach, stack, metrics, highlights, links } =
    project

  if (featured && !forceRegular) {
    return (
      <motion.div
        className="md:col-span-2 rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
        whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <CardThumbnail thumbnail={thumbnail} title={title} aspect="aspect-[16/7]" />

        <div className="p-7 md:p-9">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mr-1">
                Featured
              </span>
              <StatusBadge status={status} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((d) => (
                <DomainTag key={d} domain={d} />
              ))}
            </div>
          </div>

          <Link href={`/projects/${slug}`} className="group block mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:opacity-70 transition-opacity leading-tight">
              {title}
            </h2>
          </Link>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
            {tagline}
          </p>

          {/* Approach snippet */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-6">
            {approach}
          </p>

          {/* Metrics panel */}
          {metrics && metrics.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-cream-50 dark:bg-neutral-950/50 border border-cream-100 dark:border-neutral-800/60">
              {metrics.slice(0, 4).map((m, i) => (
                <MetricDisplay key={i} metric={m} compact={false} />
              ))}
            </div>
          )}

          {/* First 2 highlights */}
          {highlights && highlights.length > 0 && (
            <ul className="space-y-1.5 mb-6">
              {highlights.slice(0, 2).map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400"
                >
                  <span className="mt-[9px] w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                  <span>{renderHighlight(h)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {stack.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cream-100 dark:border-neutral-800">
            <Link
              href={`/projects/${slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity"
            >
              View details <ArrowRight size={14} />
            </Link>
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                <GitHubIcon size={13} /> GitHub
              </a>
            )}
            {links?.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                <ExternalLink size={13} /> Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Standard card (or featured project rendered as regular card via forceRegular)
  return (
    <motion.div
      className="flex flex-col rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.07)' }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <CardThumbnail thumbnail={thumbnail} title={title} aspect="aspect-[16/10]" />

      <div className="flex flex-col flex-1 p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <StatusBadge status={status} />
          <div className="flex flex-wrap justify-end gap-1.5">
            {domains.map((d) => (
              <DomainTag key={d} domain={d} />
            ))}
          </div>
        </div>

        <Link href={`/projects/${slug}`} className="group block mb-2">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:opacity-70 transition-opacity leading-snug">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4">
          {tagline}
        </p>

        {/* Top metric (compact) */}
        {metrics && metrics.length > 0 && (
          <div className="mb-4 pb-4 border-b border-cream-100 dark:border-neutral-800/60">
            <MetricDisplay metric={metrics[0]} compact />
          </div>
        )}

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {stack.slice(0, 6).map((t) => (
            <Chip key={t} label={t} />
          ))}
          {stack.length > 6 && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 self-center">
              +{stack.length - 6} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cream-100 dark:border-neutral-800">
          <Link
            href={`/projects/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity"
          >
            View details <ArrowRight size={12} />
          </Link>
          {links?.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <GitHubIcon size={13} /> GitHub
            </a>
          )}
          {links?.demo && (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ExternalLink size={13} /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
