import { useEffect, useRef, useState } from 'react'
import { CONTACT_TYPES } from '../../data/content'
import sendEnquiry, { CONTACT_EMAIL } from '../../utils/sendEnquiry'
import useReveal from '../../hooks/useReveal'
import './Contact.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (v.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).'
  return e
}

const MESSAGES = {
  sent: 'Thank you — your message is on its way. We reply within two working days.',
  mailto: 'Your email app should open with the message ready to send.',
  'not-configured': 'This form isn’t connected to a mail service yet. See the README to add one.',
  'send-failed': 'Something went wrong sending your message. Please try again in a moment.',
}

export default function Contact({ preset }) {
  const root = useRef(null)
  const [values, setValues] = useState({ name: '', email: '', type: CONTACT_TYPES[0], message: '', company: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', key: '' }) // idle | sending | done | error

  useReveal(root)

  // "Discuss this" buttons elsewhere pre-select a service
  useEffect(() => {
    if (preset?.service) setValues((v) => ({ ...v, type: preset.service }))
  }, [preset])

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (values.company) return // honeypot: bots fill this, people never see it

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      root.current.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }

    setStatus({ state: 'sending', key: '' })
    try {
      const result = await sendEnquiry(values)
      setStatus({ state: 'done', key: result })
      if (result === 'sent') setValues({ name: '', email: '', type: CONTACT_TYPES[0], message: '', company: '' })
    } catch (err) {
      setStatus({ state: 'error', key: err.message === 'not-configured' ? 'not-configured' : 'send-failed' })
    }
  }

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`c-${name}`}>{label}</label>
      {props.as === 'textarea' ? (
        <textarea id={`c-${name}`} name={name} rows={4} value={values[name]} onChange={set(name)}
          aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `e-${name}` : undefined} required />
      ) : (
        <input id={`c-${name}`} name={name} type={props.type || 'text'} autoComplete={props.autoComplete}
          value={values[name]} onChange={set(name)}
          aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `e-${name}` : undefined} required />
      )}
      {errors[name] && <p id={`e-${name}`} className="field__error">{errors[name]}</p>}
    </div>
  )

  return (
    <section id="contact" ref={root} className="section contact" aria-labelledby="contact-title">
      <p className="eyebrow" data-fade>05 — Contact</p>

      <h2 id="contact-title" className="contact__title">
        <span className="line" data-line><span>Let’s build</span></span>
        <span className="line" data-line><span><em>something</em> nobody</span></span>
        <span className="line" data-line><span>has seen yet.</span></span>
      </h2>

      <div className="contact__layout">
        <div className="contact__aside" data-fade>
          <p>Tell us about the project, the timeline and the feeling you’re after. We take on a small number of commissions each quarter.</p>
          {CONTACT_EMAIL && (
            <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          )}
          <p className="contact__avail">
            <span className="header__dot" aria-hidden="true" /> Booking Q1 2027
          </p>
        </div>

        <form className="contact__form" onSubmit={onSubmit} noValidate data-fade>
          {field('name', 'Your name', { autoComplete: 'name' })}
          {field('email', 'Email', { type: 'email', autoComplete: 'email' })}

          <div className="field">
            <label htmlFor="c-type">I’m interested in</label>
            <select id="c-type" name="type" value={values.type} onChange={set('type')}>
              {CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {field('message', 'Tell us about your project', { as: 'textarea' })}

          {/* honeypot */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="c-company">Company</label>
            <input id="c-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
          </div>

          <button type="submit" className="btn contact__submit" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">→</span>
          </button>

          <p className={`contact__status ${status.state === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
            {MESSAGES[status.key] || ''}
          </p>
        </form>
      </div>
    </section>
  )
}
