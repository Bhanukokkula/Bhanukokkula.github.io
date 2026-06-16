import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Bhanuprasad Kokkula — Data Scientist & GenAI Engineer',
  description:
    'Data Scientist specializing in agentic AI systems, RAG pipelines, and ML for financial services. M.S. Data Science, Rutgers University, GPA 3.7.',
  keywords: [
    'Data Scientist',
    'GenAI Engineer',
    'Agentic AI',
    'RAG',
    'LangGraph',
    'Machine Learning',
    'FinTech',
    'Rutgers',
  ],
  authors: [{ name: 'Bhanuprasad Kokkula' }],
  openGraph: {
    type: 'website',
    title: 'Bhanuprasad Kokkula — Data Scientist & GenAI Engineer',
    description:
      'Data Scientist specializing in agentic AI, RAG pipelines, and ML for financial services.',
    siteName: 'Bhanuprasad Kokkula Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhanuprasad Kokkula — Data Scientist',
    description: 'Agentic AI · RAG pipelines · ML for financial services.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bhanuprasad Kokkula',
  jobTitle: 'Data Scientist',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Rutgers University',
  },
  knowsAbout: [
    'Machine Learning',
    'Generative AI',
    'Data Science',
    'LangGraph',
    'Retrieval-Augmented Generation',
    'Financial Services ML',
  ],
  // TODO: uncomment and fill in after adding contact info to profile.ts
  // sameAs: [profile.contact.linkedin, profile.contact.github],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
