import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Portfolio } from '@/components/sections/Portfolio'
import { Skills } from '@/components/sections/Skills'
import { Research } from '@/components/sections/Research'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Portfolio />
        <Skills />
        <Research />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
