import { useLayoutEffect } from 'react'
import { gsap } from '../utils/gsap'
import useReducedMotion from './useReducedMotion'

/**
 * Scroll-triggered reveals inside a section.
 *  - [data-line] > span  → rises through a mask (headlines)
 *  - [data-fade]         → fades and floats up (everything else)
 */
export default function useReveal(rootRef) {
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return
    const root = rootRef.current

    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll('[data-line] > span')
      const fades = root.querySelectorAll('[data-fade]')

      if (lines.length) {
        gsap.from(lines, {
          yPercent: 115,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        })
      }
      if (fades.length) {
        gsap.from(fades, {
          opacity: 0,
          y: 32,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 68%', once: true },
        })
      }
    }, root)

    return () => ctx.revert()
  }, [reduced, rootRef])
}
