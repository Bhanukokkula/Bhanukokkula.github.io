'use client'

import { useEffect, useRef, useState } from 'react'

export function useActiveHeading(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (ids.length === 0) return

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.current.observe(el)
    }

    return () => observer.current?.disconnect()
  }, [ids])

  return activeId
}
