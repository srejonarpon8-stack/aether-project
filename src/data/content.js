export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export const STORY =
  'AETHER is a studio for the *in‑between* — where design becomes space, and code becomes *light*. We sculpt interfaces that feel less like pages and more like *places*.'

export const PRINCIPLES = [
  { n: '01', title: 'Light is the material', text: 'Every surface we make is lit on purpose. Reflection, depth and shadow carry the emotion before a single word is read.' },
  { n: '02', title: 'Motion is meaning', text: 'Movement is never decoration. It explains, guides and rewards — and it steps aside for anyone who asks it to.' },
  { n: '03', title: 'Performance is craft', text: 'Spectacle that stutters is just noise. We tune every polygon and pixel so the experience stays smooth on real devices.' },
]

export const SERVICES = [
  {
    id: 'web',
    name: 'Web Design',
    tagline: 'Interfaces with a point of view.',
    items: ['Art direction', 'UI / UX systems', 'Responsive builds', 'Design systems'],
  },
  {
    id: '3d',
    name: '3D Art',
    tagline: 'Sculpture for the screen.',
    items: ['Modelling', 'Materials & lighting', 'Product visualisation', 'Real-time assets'],
  },
  {
    id: 'motion',
    name: 'Motion Design',
    tagline: 'Time, directed.',
    items: ['Brand motion', 'Interface choreography', 'Title sequences', 'Launch films'],
  },
  {
    id: 'dev',
    name: 'Creative Development',
    tagline: 'Code as a craft.',
    items: ['WebGL & Three.js', 'React & GSAP', 'Custom shaders', 'Performance tuning'],
  },
]

// Self-initiated concept work. All artwork is generated procedurally (see ProjectArt.jsx).
export const PROJECTS = [
  { id: 'halcyon', title: 'Halcyon', category: 'Brand world', year: '2026', art: 'rings', service: 'Web Design',
    role: 'Art direction, web design, 3D', stack: 'React, Three.js, GSAP',
    summary: 'A calm, ever-widening identity for an imagined sleep-tech brand — concentric light that breathes with the visitor’s scroll.' },
  { id: 'monolith', title: 'Monolith', category: 'Product launch', year: '2026', art: 'grid', service: '3D Art',
    role: '3D art, motion, development', stack: 'Blender, Three.js',
    summary: 'A launch microsite for a fictional hardware drop. One object, one horizon, rendered in real time.' },
  { id: 'nocturne', title: 'Nocturne', category: 'Audio experience', year: '2025', art: 'waves', service: 'Motion Design',
    role: 'Interaction design, motion', stack: 'Web Audio, GSAP',
    summary: 'An interactive listening room where sound is drawn as terrain you can scrub through.' },
  { id: 'orbital', title: 'Orbital', category: 'Data visualisation', year: '2025', art: 'orbit', service: 'Creative Development',
    role: 'Creative development', stack: 'React, D3, WebGL',
    summary: 'A planetary-scale dashboard concept that treats datasets as bodies in orbit.' },
  { id: 'vantablack', title: 'Vantablack', category: 'Fashion lookbook', year: '2025', art: 'spikes', service: 'Web Design',
    role: 'Art direction, web design', stack: 'React, GSAP',
    summary: 'A lookbook built from contrast and edge — type, light and nothing else.' },
  { id: 'lumen-atlas', title: 'Lumen Atlas', category: 'Virtual gallery', year: '2024', art: 'blob', service: '3D Art',
    role: '3D art, creative development', stack: 'Blender, R3F',
    summary: 'A walkable gallery of soft, glowing forms — a study in material and silence.' },
]

export const EXPERIENCE_OBJECTS = [
  { id: 'mirror', name: 'Mirror', type: 'sphere', position: [-2.4, 0.3, -10], caption: 'Pure reflection. Nothing but what surrounds it.' },
  { id: 'prism', name: 'Prism', type: 'torus', position: [2.6, -0.2, -20], caption: 'Light bends. So does the brief.' },
  { id: 'shard', name: 'Shard', type: 'ico', position: [-1.8, 0.4, -30], caption: 'Faceted thinking, one angle at a time.' },
]

export const CONTACT_TYPES = [...SERVICES.map((s) => s.name), 'Something else']
