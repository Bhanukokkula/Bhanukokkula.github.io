import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Portfolio } from '@/components/sections/Portfolio'
import { Skills } from '@/components/sections/Skills'
import { Research } from '@/components/sections/Research'
import { Contact } from '@/components/sections/Contact'
import { getAllProjects, getThumbnails } from '@/lib/projects'

export default function Home() {
  const projects = getAllProjects()
  const thumbnails = getThumbnails(projects.map((p) => p.slug))
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Portfolio projects={projects} thumbnails={thumbnails} />
        <Skills />
        <Research />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
