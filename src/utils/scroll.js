// Tiny bridge so any component can scroll / lock scrolling,
// whether or not Lenis (smooth scroll) is active.

let lenis = null
let locks = 0

export function setLenis(instance) {
  lenis = instance
}

export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      ...options,
    })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (typeof target === 'number') window.scrollTo({ top: target })
  else el?.scrollIntoView()
}

export function lockScroll() {
  locks += 1
  if (locks === 1) {
    lenis?.stop()
    document.documentElement.classList.add('is-locked')
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    lenis?.start()
    document.documentElement.classList.remove('is-locked')
  }
}
