import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PROJECTS } from '../../data/content'
import ProjectArt from './ProjectArt'
import ProjectModal from './ProjectModal'
import useReducedMotion from '../../hooks/useReducedMotion'
import useReveal from '../../hooks/useReveal'
import './Projects.css'

export default function Projects({ onDiscuss }) {
  const root = useRef(null)
  const preview = useRef(null)
  const opener = useRef(null)
  const [hover, setHover] = useState(-1)
  const [open, setOpen] = useState(null) // { index, origin }
  const reduced = useReducedMotion()

  useReveal(root)

  // Preview card follows the cursor
  useEffect(() => {
    const el = preview.current
    gsap.set(el, { x: -9999, y: -9999 })
    const d = reduced ? 0 : 0.6
    const xTo = gsap.quickTo(el, 'x', { duration: d, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: d, ease: 'power3' })
    const onMove = (e) => {
      const h = el.offsetHeight
      xTo(Math.min(e.clientX + 32, window.innerWidth - el.offsetWidth - 16))
      yTo(Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  const openProject = (index, e) => {
    opener.current = e.currentTarget
    // keyboard clicks have no coordinates — expand from the button instead
    let origin = { x: e.clientX, y: e.clientY }
    if (e.detail === 0) {
      const r = e.currentTarget.getBoundingClientRect()
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    setHover(-1)
    setOpen({ index, origin })
  }

  const closeProject = () => {
    setOpen(null)
    opener.current?.focus()
  }

  return (
    <section id="work" ref={root} className="section work" aria-labelledby="work-title">
      <p className="eyebrow" data-fade>03 — Selected Work</p>
      <h2 id="work-title" className="h2 work__title">
        <span className="line" data-line><span>Worlds we</span></span>
        <span className="line" data-line><span>have <em>imagined.</em></span></span>
      </h2>
      <p className="work__note" data-fade>
        Self-initiated concept projects exploring what the studio could build. Hover to preview, click to open.
      </p>

      <ul className="work__list" data-dim={hover >= 0 ? '' : undefined} data-fade>
        {PROJECTS.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              className="work__row"
              data-active={hover === i ? '' : undefined}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
              onPointerLeave={() => setHover(-1)}
              onClick={(e) => openProject(i, e)}
              aria-haspopup="dialog"
            >
              <span className="work__idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="work__name">{p.title}</span>
              <span className="work__cat">{p.category}</span>
              <span className="work__year">{p.year}</span>
              <span className="work__thumb" aria-hidden="true"><ProjectArt kind={p.art} /></span>
            </button>
          </li>
        ))}
      </ul>

      {/* Floating preview (mouse only) */}
      <div ref={preview} className="work__preview" data-show={hover >= 0 ? '' : undefined} aria-hidden="true">
        <div className="work__preview-inner">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className="work__preview-art" data-on={hover === i ? '' : undefined}>
              <ProjectArt kind={p.art} />
            </div>
          ))}
        </div>
      </div>

      {open && (
        <ProjectModal
          index={open.index}
          origin={open.origin}
          onChange={(index) => setOpen((o) => ({ ...o, index }))}
          onClose={closeProject}
          onDiscuss={onDiscuss}
        />
      )}
    </section>
  )
}
