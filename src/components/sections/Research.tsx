'use client'

import { motion } from 'framer-motion'
import { FlaskConical, Award } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { profile } from '@/data/profile'

const ISSUER_BRAND: Record<string, { bg: string; text: string; short: string }> = {
  Microsoft:           { bg: '#0078D4', text: '#fff', short: 'MS' },
  Bloomberg:           { bg: '#F26724', text: '#fff', short: 'BBG' },
  'LinkedIn Learning': { bg: '#0A66C2', text: '#fff', short: 'in' },
}

const DEFAULT_BRAND = { bg: '#404040', text: '#fff', short: '★' }

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
        {/* Research interests */}
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
          <ul className="space-y-5">
            {profile.researchInterests.map((interest, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="mt-[9px] w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {interest.title}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {interest.description}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Certifications — vertical rows with branded snapshot header */}
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

          <div className="grid grid-cols-2 gap-4">
            {profile.certifications.map((cert, i) => {
              const brand = ISSUER_BRAND[cert.issuer] ?? DEFAULT_BRAND
              const inner = (
                <div className="rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden h-full flex flex-col transition-shadow duration-200 hover:shadow-md hover:border-cream-300 dark:hover:border-neutral-700">
                  {/* Branded snapshot header */}
                  <div
                    className="flex flex-col items-center justify-center gap-1 py-5"
                    style={{ backgroundColor: brand.bg }}
                  >
                    <span className="text-2xl font-black tracking-tight" style={{ color: brand.text }}>
                      {brand.short}
                    </span>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest opacity-80"
                      style={{ color: brand.text }}
                    >
                      {cert.issuer}
                    </span>
                  </div>
                  {/* Cert details */}
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                      {cert.name}
                    </div>
                    {cert.url && (
                      <div className="mt-auto pt-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          View certificate →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
                  whileHover={cert.url ? { y: -3, transition: { duration: 0.2 } } : undefined}
                  className="h-full"
                >
                  {cert.url ? (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                      {inner}
                    </a>
                  ) : (
                    inner
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
