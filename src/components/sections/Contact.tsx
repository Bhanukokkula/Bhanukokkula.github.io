'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/GitHubIcon'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { profile } from '@/data/profile'

const contactItems = [
  {
    Icon: Mail,
    label: 'Email',
    display: profile.contact.email,
    href: `mailto:${profile.contact.email}`,
    external: false,
  },
  {
    Icon: Linkedin,
    label: 'LinkedIn',
    display: 'LinkedIn Profile',
    href: profile.contact.linkedin,
    external: true,
  },
  {
    Icon: GitHubIcon,
    label: 'GitHub',
    display: 'GitHub Profile',
    href: profile.contact.github,
    external: true,
  },
]

export function Contact() {
  return (
    <SectionWrapper id="contact">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          Contact
        </span>
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mb-4">
          Let&apos;s connect.
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-base leading-relaxed">
          Open to Data Scientist roles in FinTech, Legal Tech, and Financial Services. Feel free to
          reach out.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 max-w-xl">
        {contactItems.map(({ Icon, label, display, href, external }, i) => (
          <motion.a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.1 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group flex flex-col gap-3 rounded-2xl border border-cream-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-md hover:border-cream-300 dark:hover:border-neutral-700 transition-shadow duration-200 cursor-pointer"
          >
            <Icon size={18} className="text-neutral-400 dark:text-neutral-500" />
            <div>
              <div className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {label}
              </div>
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors truncate mt-0.5">
                {display}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  )
}
