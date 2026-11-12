import { useCallback, useEffect, useState } from 'react'
import Loader from './components/ui/Loader'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/hero/Hero'
import About from './components/about/About'
import Services from './components/services/Services'
import Projects from './components/projects/Projects'
import Experience from './components/experience/Experience'
import Contact from './components/contact/Contact'
import useReducedMotion from './hooks/useReducedMotion'
import useSmoothScroll from './hooks/useSmoothScroll'
import { ScrollTrigger } from './utils/gsap'
import { scrollToTarget } from './utils/scroll'

export default function App() {
  const reduced = useReducedMotion()
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [preset, setPreset] = useState(null) // { service, n } — pre-selects the contact form

  useSmoothScroll(reduced)

  const handleSceneReady = useCallback(() => setSceneReady(true), [])

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
    // Failsafe: never trap the user behind the loader
    const t = setTimeout(() => {
      setFontsReady(true)
      setSceneReady(true)
    }, 6000)
    return () => clearTimeout(t)
  }, [])

  // Lock scroll while loading; recalculate scroll triggers once the page is live
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !loaded)
    if (loaded) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 100)
      return () => clearTimeout(t)
    }
  }, [loaded])

  // Services / projects → contact, with the service pre-selected
  const discuss = useCallback((service) => {
    setPreset((p) => ({ service, n: (p?.n || 0) + 1 }))
    scrollToTarget('#contact')
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      {!loaded && (
        <Loader ready={fontsReady && sceneReady} reducedMotion={reduced} onDone={() => setLoaded(true)} />
      )}

      <Header />

      <main id="main">
        <Hero started={loaded} onSceneReady={handleSceneReady} />
        <About />
        <Services onSelect={discuss} />
        <Projects onDiscuss={discuss} />
        <Experience />
        <Contact preset={preset} />
      </main>

      <Footer />
    </>
  )
}
