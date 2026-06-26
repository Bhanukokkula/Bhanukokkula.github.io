'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project, ProjectDomain, ProjectStatus } from '@/data/projects'
import { PortfolioCard } from './PortfolioCard'

const ALL = 'All'

const allDomains: ProjectDomain[] = [
  'AI Engineering',
  'Investment Banking',
  'Commercial Bank',
  'Hedge Fund',
  'Research',
]

const allStatuses: ProjectStatus[] = ['Completed', 'Building', 'Planned']

const statusOrder: Record<ProjectStatus, number> = { Completed: 0, Building: 1, Planned: 2 }

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
        active
          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
          : 'bg-cream-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-cream-200 dark:hover:bg-neutral-700'
      }`}
    >
      {label}
    </button>
  )
}

interface ProjectsGridProps {
  projects: Project[]
  thumbnails?: Record<string, string | null>
}

export function ProjectsGrid({ projects, thumbnails = {} }: ProjectsGridProps) {
  const [activeDomain, setActiveDomain] = useState<ProjectDomain | typeof ALL>(ALL)
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | typeof ALL>(ALL)

  // Stable sort index so featured items preserve the order given by src/lib/projects.ts
  const originalIndex = useMemo(() => new Map(projects.map((p, i) => [p.slug, i])), [projects])

  const presentDomains = useMemo(
    () => allDomains.filter((d) => projects.some((p) => p.domains.includes(d))),
    [projects]
  )
  const presentStatuses = useMemo(
    () => allStatuses.filter((s) => projects.some((p) => p.status === s)),
    [projects]
  )

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        const domainOk = activeDomain === ALL || p.domains.includes(activeDomain as ProjectDomain)
        const statusOk = activeStatus === ALL || p.status === activeStatus
        return domainOk && statusOk
      })
      .sort((a, b) => {
        // Featured before non-featured
        const aFeat = a.featured ? 0 : 1
        const bFeat = b.featured ? 0 : 1
        if (aFeat !== bFeat) return aFeat - bFeat
        // Both featured: preserve original array order (user controls via data file)
        if (a.featured && b.featured) {
          return originalIndex.get(a.slug)! - originalIndex.get(b.slug)!
        }
        // Non-featured: Completed → Building → Planned
        return statusOrder[a.status] - statusOrder[b.status]
      })
  }, [activeDomain, activeStatus, projects, originalIndex])

  return (
    <div>
      {/* Domain filter */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
          Domain
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
          <FilterPill label={ALL} active={activeDomain === ALL} onClick={() => setActiveDomain(ALL)} />
          {presentDomains.map((d) => (
            <FilterPill key={d} label={d} active={activeDomain === d} onClick={() => setActiveDomain(d)} />
          ))}
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
          Status
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          <FilterPill label={ALL} active={activeStatus === ALL} onClick={() => setActiveStatus(ALL)} />
          {presentStatuses.map((s) => (
            <FilterPill key={s} label={s} active={activeStatus === s} onClick={() => setActiveStatus(s)} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-neutral-400 dark:text-neutral-500 py-16 text-center"
          >
            No projects match the selected filters.
          </motion.p>
        ) : (
          <motion.div key="grid" className="grid md:grid-cols-2 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.07 }}
                className={project.featured ? 'md:col-span-2' : ''}
              >
                <PortfolioCard project={project} thumbnail={thumbnails[project.slug]} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
