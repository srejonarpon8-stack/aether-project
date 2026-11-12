import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../utils/gsap'
import HeroScene from '../three/HeroScene'
import useReducedMotion from '../../hooks/useReducedMotion'
import './Hero.css'

const LETTERS = 'AETHER'.split('')

export default function Hero({ started, onSceneReady }) {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const [inView, setInView] = useState(true)

  // Pause 3D rendering when the hero is scrolled out of view
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // Intro animation — runs once the loader has exited
  useLayoutEffect(() => {
    if (!started || reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero__letter', { yPercent: 115, rotate: 6, duration: 1.6, stagger: 0.07 })
        .from('.js-fade', { opacity: 0, y: 16, duration: 1, stagger: 0.12 }, '-=1.1')
    }, root)
    return () => ctx.revert()
  }, [started, reduced])

  // Parallax: wordmark drifts up as you leave the hero
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to('.hero__title', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="top"
      ref={root}
      className="hero"
      data-started={started ? '' : undefined}
      aria-label="AETHER introduction"
    >
      <h1 className="hero__title" aria-label="AETHER">
        <span className="hero__word" aria-hidden="true">
          {LETTERS.map((l, i) => (
            <span className="hero__mask" key={i}>
              <span className="hero__letter">{l}</span>
            </span>
          ))}
        </span>
      </h1>

      <div className="hero__canvas" aria-hidden="true">
        <HeroScene started={started} active={inView} reducedMotion={reduced} onReady={onSceneReady} />
      </div>

      <div className="hero__foot">
        <p className="hero__lede js-fade">
          We build <em>digital worlds</em> where light, form and motion meet code.
        </p>
        <div className="hero__cue js-fade" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  )
}
