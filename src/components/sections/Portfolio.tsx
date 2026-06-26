'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import type { Project } from '@/data/projects'

interface PortfolioProps {
  projects: Project[]
  thumbnails?: Record<string, string | null>
}

export function Portfolio({ projects, thumbnails = {} }: PortfolioProps) {
  // Featured flagship (first in data array)
  const featuredProject = projects[0]
  // Two more completed projects to show alongside the flagship
  const completedPreviews = projects
    .filter((p) => p.slug !== featuredProject.slug && p.status === 'Completed')
    .slice(0, 2)
  const remaining = projects.length - 1 - completedPreviews.length

  return (
    <motion.section
      id="portfolio"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-28 scroll-mt-16 bg-neutral-950"
    >
      <div className="px-6 md:px-10 max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
            Portfolio
          </span>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-5">
            Financial-AI builds.
          </h2>
          <p className="text-base text-neutral-400 max-w-xl leading-relaxed">
            Systems designed for the workflows where accuracy, auditability, and honest
            uncertainty quantification are non-negotiable.
          </p>
        </motion.div>

        {/* Preview cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {/* Featured flagship — full width */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
          >
            <PortfolioCard project={featuredProject} thumbnail={thumbnails[featuredProject.slug]} />
          </motion.div>

          {/* Two completed projects with real results */}
          {completedPreviews.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 + i * 0.1 }}
            >
              <PortfolioCard project={project} thumbnail={thumbnails[project.slug]} forceRegular />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          {remaining > 0 && (
            <p className="text-sm text-neutral-500">
              +{remaining} more project{remaining > 1 ? 's' : ''} in the full portfolio
            </p>
          )}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:opacity-85 transition-opacity"
          >
            Open Full Portfolio
            <ArrowRight size={15} />
          </Link>
        </motion.div>

      </div>
    </motion.section>
  )
}
