'use client'

import { motion } from 'framer-motion'
import { FlaskConical, Award } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { profile } from '@/data/profile'

export function Research() {
  return (
    <SectionWrapper id="research" alt>
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          Research & Certifications
        </span>
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Curiosity, formalized.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FlaskConical size={15} className="text-neutral-400 dark:text-neutral-500" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Research Interests
            </h3>
          </motion.div>
          <ul className="space-y-4">
            {profile.researchInterests.map((interest, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
                className="flex items-start gap-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed"
              >
                <span className="mt-[9px] w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                {interest}
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Award size={15} className="text-neutral-400 dark:text-neutral-500" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Certifications
            </h3>
          </motion.div>
          <div className="space-y-4">
            {profile.certifications.map((cert, i) => {
              const content = (
                <>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {cert.name}
                  </div>
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-wider">
                    {cert.issuer}
                  </div>
                </>
              )

              const className =
                'block rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-shadow duration-200' +
                (cert.url ? ' hover:shadow-md hover:border-cream-300 dark:hover:border-neutral-700' : '')

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.1 }}
                  whileHover={cert.url ? { y: -3, transition: { duration: 0.2 } } : undefined}
                >
                  {cert.url ? (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className={className}>
                      {content}
                    </a>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
