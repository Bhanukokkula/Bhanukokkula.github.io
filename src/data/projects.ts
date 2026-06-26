// Project/Metric types. Runtime data lives in content/projects/<slug>/index.md,
// loaded by src/lib/projects.ts — see that file to add or edit a project.

export type ProjectStatus = 'Completed' | 'Building' | 'Planned'

export type ProjectDomain =
  | 'AI Engineering'
  | 'Investment Banking'
  | 'Commercial Bank'
  | 'Hedge Fund'
  | 'Research'

export interface Metric {
  label: string
  target?: string   // projected value — shown with "Target" label
  result?: string   // achieved value — shown with "Result" label when set
  baseline?: string // e.g. "~50–65% naive-LLM"
  context?: string  // published SOTA / reference points
}

export interface Project {
  slug: string
  title: string
  tagline: string
  domains: ProjectDomain[]
  status: ProjectStatus
  featured?: boolean
  problem: string
  approach: string
  stack: string[]
  metrics?: Metric[]
  highlights?: string[]
  links?: { github?: string; demo?: string; writeup?: string }
}

