'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
  alt?: boolean
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function SectionWrapper({ id, children, className = '', alt = false }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={sectionVariants}
      className={`py-28 scroll-mt-16 ${
        alt
          ? 'bg-cream-100 dark:bg-neutral-900/60'
          : 'bg-cream-50 dark:bg-neutral-950'
      } ${className}`}
    >
      <div className="px-6 md:px-10 max-w-6xl mx-auto">{children}</div>
    </motion.section>
  )
}
