'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Building2 } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Chip } from '@/components/ui/Chip'
import { profile } from '@/data/profile'
import type { ExperienceItem } from '@/data/profile'

const typeIcon = (type: ExperienceItem['type']) => {
  if (type === 'full-time') return Briefcase
  if (type === 'research') return GraduationCap
  return Building2
}

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          Experience
        </span>
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Where I&apos;ve worked.
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-cream-200 dark:bg-neutral-800" />

        <div className="space-y-8">
          {profile.experience.map((exp, i) => {
            const Icon = typeIcon(exp.type)
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.1 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1 z-10 w-8 h-8 rounded-xl bg-cream-50 dark:bg-neutral-950 border border-cream-200 dark:border-neutral-800 shadow-sm flex items-center justify-center">
                  <Icon size={13} className="text-neutral-500 dark:text-neutral-400" />
                </div>

                <div className="rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0">
                      {exp.duration}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((a, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400"
                      >
                        <span className="mt-[9px] w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.stack.map((tech) => (
                      <Chip key={tech} label={tech} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
