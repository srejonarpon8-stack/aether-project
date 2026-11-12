import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins exactly once, then import { gsap, ScrollTrigger } from here.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
