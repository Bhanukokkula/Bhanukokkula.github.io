'use client'

import { useActiveHeading } from '@/lib/useActiveHeading'

export interface NavItem {
  id: string
  text: string
}

// Desktop: sticky sidebar list
export function ProjectNavSidebar({ items }: { items: NavItem[] }) {
  const activeId = useActiveHeading(items.map((i) => i.id))
  if (items.length === 0) return null

  return (
    <nav aria-label="Sections" className="sticky top-24 hidden lg:block">
      <ul className="space-y-2 border-l border-cream-200 dark:border-neutral-800 pl-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={`block text-sm leading-snug transition-colors ${
                activeId === item.id
                  ? 'text-neutral-900 dark:text-neutral-50 font-medium'
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Mobile/tablet: horizontal scrolling jump-bar
export function ProjectNavMobile({ items }: { items: NavItem[] }) {
  const activeId = useActiveHeading(items.map((i) => i.id))
  if (items.length === 0) return null

  return (
    <nav
      aria-label="Sections"
      className="lg:hidden -mx-6 px-6 mb-8 flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]"
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? 'true' : undefined}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            activeId === item.id
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
              : 'bg-cream-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
