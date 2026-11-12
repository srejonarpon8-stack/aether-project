import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Loader.css'

/**
 * Real loading state: the counter eases to 90% while fonts and the 3D
 * scene initialise, then completes and exits once `ready` is true.
 */
export default function Loader({ ready, reducedMotion, onDone }) {
  const root = useRef(null)
  const counter = useRef({ v: 0 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    const tween = gsap.to(counter.current, {
      v: 90,
      duration: reducedMotion ? 0.3 : 2.4,
      ease: 'power2.out',
      onUpdate: () => setValue(Math.round(counter.current.v)),
    })
    return () => tween.kill()
  }, [reducedMotion])

  useEffect(() => {
    if (!ready) return
    gsap.killTweensOf(counter.current)

    const tl = gsap.timeline({ onComplete: onDone })
    tl.to(counter.current, {
      v: 100,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => setValue(Math.round(counter.current.v)),
    })
    if (reducedMotion) {
      tl.to(root.current, { opacity: 0, duration: 0.4 }, '+=0.15')
    } else {
      tl.to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=0.2')
    }
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading AETHER">
      <span className="loader__label" aria-hidden="true">AETHER — Digital Studio</span>
      <div className="loader__bottom" aria-hidden="true">
        <span className="loader__count">{String(value).padStart(3, '0')}</span>
        <span className="loader__bar"><i style={{ transform: `scaleX(${value / 100})` }} /></span>
      </div>
    </div>
  )
}
