'use client'

import { motion } from 'framer-motion'
import { MapPin, GraduationCap, Calendar, BookOpen, Award, Briefcase } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { profile } from '@/data/profile'

const quickFacts = [
  { Icon: MapPin, label: 'Location', value: profile.location },
  { Icon: BookOpen, label: 'School', value: profile.education.school },
  { Icon: GraduationCap, label: 'Degree', value: profile.education.degree },
  { Icon: Calendar, label: 'Graduating', value: profile.education.graduation },
  { Icon: Award, label: 'GPA', value: profile.education.gpa },
  { Icon: Briefcase, label: 'Status', value: profile.status },
]

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
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Building intelligent systems<br className="hidden md:block" /> that move markets.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-10 md:gap-16">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
        >
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base">
            {profile.summary}
          </p>
        </motion.div>

        <div className="space-y-5 border-l border-cream-200 dark:border-neutral-800 pl-6">
          {quickFacts.map(({ Icon, label, value }, i) => (
            <motion.div
              key={label}
              className="flex items-start gap-3"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Icon size={14} className="mt-0.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <div>
                <div className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {label}
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
