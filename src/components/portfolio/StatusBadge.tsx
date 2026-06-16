import type { ProjectStatus } from '@/data/projects'

const styles: Record<ProjectStatus, string> = {
  Building:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Planned:   'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const dotColors: Record<ProjectStatus, string> = {
  Building:  'bg-amber-500',
  Planned:   'bg-neutral-400',
  Completed: 'bg-green-500',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[status]} ${
          status === 'Building' ? 'animate-pulse' : ''
        }`}
      />
      {status}
    </span>
  )
}
