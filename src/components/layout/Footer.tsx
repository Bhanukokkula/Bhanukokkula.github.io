import { Linkedin, Mail } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/GitHubIcon'
import { profile } from '@/data/profile'

export function Footer() {
  return (
    <footer className="border-t border-cream-200 dark:border-neutral-800 py-8 px-6 md:px-10 bg-cream-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${profile.contact.email}`}
            aria-label="Email"
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Mail size={15} />
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Linkedin size={15} />
          </a>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <GitHubIcon size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
