import { useRef } from 'react'
import gsap from 'gsap'
import ServiceGlyph from './ServiceGlyph'
import useReducedMotion from '../../hooks/useReducedMotion'

/** A card that tilts in 3D toward the pointer, with a light glare that follows it. */
export default function ServiceCard({ service, index, onSelect }) {
  const card = useRef(null)
  const reduced = useReducedMotion()

  const onMove = (e) => {
    if (reduced || e.pointerType === 'touch') return
    const r = card.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    card.current.style.setProperty('--mx', `${px * 100}%`)
    card.current.style.setProperty('--my', `${py * 100}%`)
    gsap.to(card.current, {
      rotationY: (px - 0.5) * 14,
      rotationX: -(py - 0.5) * 14,
      transformPerspective: 1000,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const onLeave = () => {
    if (reduced) return
    gsap.to(card.current, { rotationX: 0, rotationY: 0, duration: 1.1, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
  }

  return (
    <div className="service-wrap" data-fade>
      <article ref={card} className="service" onPointerMove={onMove} onPointerLeave={onLeave}>
        <header className="service__head">
          <span className="service__n">0{index + 1}</span>
          <ServiceGlyph id={service.id} />
        </header>

        <div className="service__body">
          <h3 className="service__name">{service.name}</h3>
          <p className="service__tag"><em>{service.tagline}</em></p>
          <ul className="service__list">
            {service.items.map((it) => <li key={it}>{it}</li>)}
          </ul>
          <button type="button" className="btn" onClick={() => onSelect(service.name)}>
            Discuss this <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    </div>
  )
}
