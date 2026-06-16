import type { ProjectDomain } from '@/data/projects'

const styles: Record<ProjectDomain, string> = {
  'AI Engineering':    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Investment Banking':'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Commercial Bank':   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Hedge Fund':        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'Research':          'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
}

export function DomainTag({ domain }: { domain: ProjectDomain }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${styles[domain]}`}
    >
      {domain}
    </span>
  )
}
