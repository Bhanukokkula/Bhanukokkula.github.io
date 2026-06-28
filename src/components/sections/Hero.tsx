'use client'

import { motion } from 'framer-motion'
import { Eye, Mail } from 'lucide-react'
import { profile } from '@/data/profile'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export function Hero() {
  const heroSummary = profile.summary.split('. ').slice(0, 1).join('. ') + '.'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-11 px-6 md:px-10 overflow-hidden bg-cream-50 dark:bg-neutral-950"
    >
      {/* Subtle radial glow for warmth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(210,195,180,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto w-full py-24 text-center relative">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p
            variants={item}
            className="text-sm font-medium text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-6"
          >
            {profile.status}
          </motion.p>

          <motion.h1
            variants={item}
            className="text-[56px] sm:text-[72px] md:text-[88px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.04] mb-5"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl md:text-2xl font-medium text-neutral-500 dark:text-neutral-400 mb-6"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            variants={item}
            className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto mb-12"
          >
            {heroSummary}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cream-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-cream-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
            >
              <Eye size={14} />
              View Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cream-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-cream-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
            >
              <Mail size={14} />
              Contact
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
