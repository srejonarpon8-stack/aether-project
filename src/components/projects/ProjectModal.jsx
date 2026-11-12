import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { PROJECTS } from '../../data/content'
import ProjectArt from './ProjectArt'
import useFocusTrap from '../../hooks/useFocusTrap'
import useReducedMotion from '../../hooks/useReducedMotion'
import { lockScroll, unlockScroll } from '../../utils/scroll'

const radius = () => Math.hypot(window.innerWidth, window.innerHeight) * 1.05

/** Full-bleed project view that expands from the point you clicked. */
export default function ProjectModal({ index, origin, onChange, onClose, onDiscuss }) {
  const root = useRef(null)
  const closeBtn = useRef(null)
  const closing = useRef(false)
  const reduced = useReducedMotion()
  const project = PROJECTS[index]
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  useFocusTrap(root, true)

  // Open transition
  useLayoutEffect(() => {
    const el = root.current
    if (reduced) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    } else {
      gsap.fromTo(
        el,
        { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` },
        {
          clipPath: `circle(${radius()}px at ${origin.x}px ${origin.y}px)`,
          duration: 1.1,
          ease: 'expo.inOut',
          clearProps: 'clipPath',
        }
      )
    }
    closeBtn.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    lockScroll()
    return unlockScroll
  }, [])

  const close = (after) => {
    if (closing.current) return
    closing.current = true
    const el = root.current
    const done = () => {
      onClose()
      after?.()
    }
    if (reduced) {
      gsap.to(el, { opacity: 0, duration: 0.25, onComplete: done })
    } else {
      gsap.fromTo(
        el,
        { clipPath: `circle(${radius()}px at ${origin.x}px ${origin.y}px)` },
        { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`, duration: 0.8, ease: 'expo.inOut', onComplete: done }
      )
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') onChange((index + 1) % PROJECTS.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + PROJECTS.length) % PROJECTS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div
      ref={root}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — project details`}
      data-lenis-prevent
    >
      <div className="modal__bar">
        <span>{String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span>
        <button ref={closeBtn} type="button" className="btn" onClick={() => close()}>Close ✕</button>
      </div>

      <div className="modal__grid" key={project.id}>
        <div className="modal__art">
          <ProjectArt kind={project.art} label={`Generative artwork for ${project.title}`} />
        </div>

        <div className="modal__info">
          <p className="eyebrow">{project.category}</p>
          <h3 className="modal__title">{project.title}</h3>
          <p className="modal__summary">{project.summary}</p>

          <dl className="modal__meta">
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Stack</dt><dd>{project.stack}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Type</dt><dd>Self-initiated concept</dd></div>
          </dl>

          <button type="button" className="btn" onClick={() => close(() => onDiscuss(project.service))}>
            Start a project like this <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="modal__nav">
        <button type="button" className="btn" onClick={() => onChange((index - 1 + PROJECTS.length) % PROJECTS.length)}>
          <span aria-hidden="true">←</span> {prev.title}
        </button>
        <button type="button" className="btn" onClick={() => onChange((index + 1) % PROJECTS.length)}>
          {next.title} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
