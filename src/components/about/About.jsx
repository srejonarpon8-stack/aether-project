import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../utils/gsap'
import { STORY, PRINCIPLES } from '../../data/content'
import useReducedMotion from '../../hooks/useReducedMotion'
import useReveal from '../../hooks/useReveal'
import './About.css'

// "*word*" marks an emphasised (serif italic) word
function parseStory(text) {
  return text.split(' ').map((raw) => {
    const m = raw.match(/^\*(.+?)\*(.*)$/)
    return m ? { text: m[1], tail: m[2], em: true } : { text: raw, tail: '', em: false }
  })
}

export default function About() {
  const root = useRef(null)
  const story = useRef(null)
  const reduced = useReducedMotion()
  const words = useMemo(() => parseStory(STORY), [])

  useReveal(root)

  // Words light up one by one as you scroll through the paragraph
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to('.about__word', {
        opacity: 1,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: { trigger: story.current, start: 'top 78%', end: 'bottom 48%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="about" ref={root} className="section about" aria-labelledby="about-label">
      <p id="about-label" className="eyebrow" data-fade>01 — About</p>

      <p ref={story} className={`about__story ${reduced ? 'about__story--static' : ''}`}>
        {words.map((w, i) => (
          <span key={i} className="about__word">
            {w.em ? <em>{w.text}</em> : w.text}
            {w.tail}
          </span>
        ))}
      </p>

      <ul className="about__principles">
        {PRINCIPLES.map((p) => (
          <li key={p.n} className="about__principle" data-fade>
            <span className="about__n">{p.n}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
