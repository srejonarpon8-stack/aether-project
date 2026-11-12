import { useEffect, useRef, useState } from 'react'
import { NAV } from '../../data/content'
import { scrollToTarget, lockScroll, unlockScroll } from '../../utils/scroll'
import useFocusTrap from '../../hooks/useFocusTrap'
import './Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const root = useRef(null)
  const toggle = useRef(null)

  // Highlight the section currently in view
  useEffect(() => {
    const ids = ['top', ...NAV.map((n) => n.id)]
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === 'top' ? '' : e.target.id)
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Mobile menu: lock scroll, Esc to close, return focus
  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open])

  useFocusTrap(root, open)

  const go = (e, id) => {
    e.preventDefault()
    const wasOpen = open
    setOpen(false)
    // wait a frame so the scroll lock is released before scrolling
    setTimeout(() => {
      scrollToTarget(id === 'top' ? 0 : `#${id}`)
      history.replaceState(null, '', id === 'top' ? '#' : `#${id}`)
    }, wasOpen ? 60 : 0)
  }

  const links = (cls) =>
    NAV.map((n) => (
      <a
        key={n.id}
        className={cls}
        href={`#${n.id}`}
        aria-current={active === n.id ? 'true' : undefined}
        onClick={(e) => go(e, n.id)}
      >
        {n.label}
      </a>
    ))

  return (
    <header ref={root} className="header">
      <a className="header__logo" href="#top" aria-label="AETHER — back to top" onClick={(e) => go(e, 'top')}>
        AETHER
      </a>

      <nav className="header__nav" aria-label="Primary">{links('header__link')}</nav>

      <p className="header__status">
        <span className="header__dot" aria-hidden="true" />
        Booking Q1 2027
      </p>

      <button
        ref={toggle}
        type="button"
        className="header__toggle"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <div id="menu" className="menu" data-open={open ? '' : undefined}>
        <nav aria-label="Mobile">{links('menu__link')}</nav>
      </div>
    </header>
  )
}
