'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, FlaskConical, MapPin } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { profile } from '@/data/profile'

const rutgersResearch = profile.experience.find((e) => e.id === 'rutgers-research')!

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.07 },
  }),
}

export function About() {
  return (
    <SectionWrapper id="about" alt>
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          About
        </span>
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mb-3">
          Researching agentic AI systems,<br className="hidden md:block" /> building ones that ship.
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
          <MapPin size={13} />
          {profile.location} · {profile.status}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Work Summary */}
        <motion.div
          className="rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={15} className="text-neutral-400 dark:text-neutral-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Work Summary
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            ~2 years in production ML for financial services (fraud detection, model
            deployment), plus {rutgersResearch.duration} of independent GenAI research at
            Rutgers on retrieval-augmented generation and LLM adaptation — reproducibility
            and honest benchmarking over headline metrics.
          </p>
        </motion.div>

        {/* Education — university names highlighted */}
        <motion.div
          className="rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={15} className="text-neutral-400 dark:text-neutral-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Education
            </span>
          </div>
          <div className="space-y-4">
            {profile.education.map((edu, i) => (
              <div
                key={i}
                className={i > 0 ? 'pt-4 border-t border-cream-100 dark:border-neutral-800/60' : ''}
              >
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {edu.school}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {edu.degree}
                </div>
                {(edu.graduation || edu.gpa) && (
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5 uppercase tracking-wider">
                    {[edu.graduation, edu.gpa && `GPA ${edu.gpa}`].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          className="rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={15} className="text-neutral-400 dark:text-neutral-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Interests
            </span>
          </div>
          <ul className="space-y-2">
            {profile.researchInterests.map((interest, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed"
              >
                <span className="mt-[7px] w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                {interest}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
