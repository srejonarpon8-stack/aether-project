import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../../utils/gsap'
import { EXPERIENCE_OBJECTS } from '../../data/content'
import useReducedMotion from '../../hooks/useReducedMotion'
import { hasWebGL } from '../../utils/webgl'
import './Experience.css'

// The 3D scene is code-split and only loaded when the section is near the viewport.
const ExperienceScene = lazy(() => import('../three/ExperienceScene'))

export default function Experience() {
  const root = useRef(null)
  const bar = useRef(null)
  const progress = useRef(0)
  const reduced = useReducedMotion()

  const [webgl] = useState(() => hasWebGL())
  const [mount, setMount] = useState(false)
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState(null)
  const [pulse, setPulse] = useState({ id: null, n: 0 })
  const [coarse] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  // Mount lazily, render only while on/near screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting)
        if (e.isIntersecting) setMount(true)
      },
      { rootMargin: '60% 0px' }
    )
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // Scroll progress drives the camera "travel"
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])

  const handleReady = useCallback(() => setReady(true), [])
  const select = useCallback((id) => {
    setSelected(id)
    setPulse((p) => ({ id, n: p.n + 1 }))
  }, [])

  const current = EXPERIENCE_OBJECTS.find((o) => o.id === selected)

  return (
    <section id="experience" ref={root} className="xp" aria-labelledby="xp-title">
      <div className="xp__stage">
        <div className="xp__canvas">
          {webgl && mount && (
            <Suspense fallback={null}>
              <ExperienceScene
                progress={progress}
                active={active}
                pulse={pulse}
                onSelect={select}
                onReady={handleReady}
                reducedMotion={reduced}
              />
            </Suspense>
          )}
        </div>

        {webgl && !ready && <p className="xp__loading" role="status">Loading scene…</p>}

        <div className="xp__ui">
          <div className="xp__top">
            <p className="eyebrow">04 — Experience</p>
            <h2 id="xp-title" className="xp__title">Enter the <em>void.</em></h2>
          </div>

          <div className="xp__bottom">
            <div className="xp__caption" aria-live="polite">
              {current ? (
                <>
                  <strong>{current.name}</strong>
                  <span>{current.caption}</span>
                </>
              ) : (
                <span>{webgl ? 'Select an object to wake it.' : 'Your device can’t run WebGL, but here are the objects.'}</span>
              )}
            </div>

            <div className="xp__controls">
              <div className="xp__objects" role="group" aria-label="Objects in the scene">
                {EXPERIENCE_OBJECTS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="xp__chip"
                    aria-pressed={selected === o.id}
                    onClick={() => select(o.id)}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
              <p className="xp__hint">
                {coarse ? 'Scroll to travel · Tap an object' : 'Scroll to travel · Drag to orbit · Click an object'}
              </p>
              <span className="xp__progress" aria-hidden="true"><i ref={bar} /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
