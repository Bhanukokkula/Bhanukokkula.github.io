interface ChipProps {
  label: string
  variant?: 'default' | 'accent'
  className?: string
}

export function Chip({ label, variant = 'default', className = '' }: ChipProps) {
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap'
  const variants = {
    default:
      'bg-cream-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
    accent:
      'bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900',
  }
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>{label}</span>
  )
}
