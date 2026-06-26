import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectsGrid } from '@/components/portfolio/ProjectsGrid'
import { getAllProjects, getThumbnails } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Portfolio — Bhanuprasad Kokkula',
  description:
    'Financial-AI builds and research by Bhanuprasad Kokkula: auditable reasoning engines, IB automation, regtech, and alt-data systems.',
  openGraph: {
    title: 'Portfolio — Bhanuprasad Kokkula',
    description:
      'Financial-AI builds and research: auditable reasoning engines, IB automation, regtech, and alt-data systems.',
    type: 'website',
  },
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  const thumbnails = getThumbnails(projects.map((p) => p.slug))
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 dark:bg-neutral-950 pt-11">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
          {/* Page heading */}
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
              Portfolio
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-5">
              What I&apos;m building.
            </h1>
            <p className="text-base text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
              Financial-AI systems designed for the workflows where accuracy, auditability, and
              honest uncertainty quantification are non-negotiable.
            </p>
          </div>

          <ProjectsGrid projects={projects} thumbnails={thumbnails} />
        </div>
      </main>
      <Footer />
    </>
  )
}
