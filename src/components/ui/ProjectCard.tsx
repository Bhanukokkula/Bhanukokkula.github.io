'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ChevronDown } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/GitHubIcon'
import { Chip } from './Chip'
import type { Project } from '@/data/profile'

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="flex flex-col h-full rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm cursor-default"
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {project.imageUrl ? (
        <div className="h-40 bg-cream-100 dark:bg-neutral-800 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-36 bg-cream-100 dark:bg-neutral-800 flex items-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-cream-300 dark:text-neutral-600 select-none">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {project.title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
              {project.subtitle}
            </p>
          </div>
          <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-cream-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-cream-200 dark:border-neutral-700 font-medium">
            {project.domain}
          </span>
        </div>

        <div className="flex gap-6 mb-4 pb-4 border-b border-cream-100 dark:border-neutral-800">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 leading-none">
                {m.value}
              </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((tech) => (
            <Chip key={tech} label={tech} />
          ))}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors w-fit mb-1"
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <ChevronDown size={13} />
          </motion.span>
          {expanded ? 'Hide details' : 'Show details'}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="desc"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1 pb-3">
                {project.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-4 flex gap-4 border-t border-cream-100 dark:border-neutral-800">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <GitHubIcon size={13} /> GitHub
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-neutral-300 dark:text-neutral-700">
              <GitHubIcon size={13} /> GitHub (soon)
            </span>
          )}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ExternalLink size={13} /> Live demo
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-neutral-300 dark:text-neutral-700">
              <ExternalLink size={13} /> Demo (soon)
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
