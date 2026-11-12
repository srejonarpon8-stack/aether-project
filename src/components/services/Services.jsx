import { useRef } from 'react'
import { SERVICES } from '../../data/content'
import ServiceCard from './ServiceCard'
import useReveal from '../../hooks/useReveal'
import './Services.css'

export default function Services({ onSelect }) {
  const root = useRef(null)
  useReveal(root)

  return (
    <section id="services" ref={root} className="section services" aria-labelledby="services-title">
      <p className="eyebrow" data-fade>02 — Services</p>
      <h2 id="services-title" className="h2 services__title">
        <span className="line" data-line><span>Four crafts,</span></span>
        <span className="line" data-line><span>one <em>vision.</em></span></span>
      </h2>

      <div className="services__grid">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
