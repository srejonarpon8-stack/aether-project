import { NAV } from '../../data/content'
import { scrollToTarget } from '../../utils/scroll'
import './Footer.css'

const WORDS = Array.from({ length: 8 }, () => 'AETHER ✦ DIGITAL WORLDS ✦')

export default function Footer() {
  const go = (e, id) => {
    e.preventDefault()
    scrollToTarget(`#${id}`)
  }

  return (
    <footer className="footer">
      <div className="footer__marquee" aria-hidden="true">
        <div className="footer__track">
          {WORDS.map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>

      <div className="footer__bar">
        <nav className="footer__nav" aria-label="Footer">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => go(e, n.id)}>{n.label}</a>
          ))}
        </nav>
        <button type="button" className="btn" onClick={() => scrollToTarget(0, { duration: 2 })}>
          Back to top ↑
        </button>
        <p className="footer__copy">© {new Date().getFullYear()} AETHER — A fictional studio.</p>
      </div>
    </footer>
  )
}
