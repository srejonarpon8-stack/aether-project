# AETHER — Immersive 3D Creative Studio Website

React + Vite + Three.js + React Three Fiber + Drei + GSAP + Lenis.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build -> dist/
npm run preview      # test the production build
```

Requires Node 18+.

## Make the contact form real

Copy `.env.example` to `.env` and fill in **one** option:

| Variable | Service |
|---|---|
| `VITE_WEB3FORMS_KEY` | [Web3Forms](https://web3forms.com) — free access key, no backend |
| `VITE_FORMSPREE_ENDPOINT` | [Formspree](https://formspree.io) — paste the endpoint URL |
| `VITE_CONTACT_EMAIL` | Plain email — opens the visitor's mail app, pre-filled |

Restart `npm run dev` after editing `.env`. With nothing set, the form validates and then tells the visitor it isn't connected yet — it never pretends to send.

## Structure

```
src/
├─ App.jsx                 page assembly, loader, smooth scroll
├─ data/content.js         ALL copy: nav, services, projects, 3D objects
├─ hooks/                  useReducedMotion, useQuality, useSmoothScroll, useReveal, useFocusTrap
├─ utils/                  gsap (plugin setup), scroll (Lenis bridge), webgl, sendEnquiry
├─ styles/global.css       tokens, reset, a11y, grain
└─ components/
   ├─ ui/Loader            real loading state (fonts + WebGL)
   ├─ layout/              Header (accessible menu), Footer
   ├─ hero/                masked wordmark + 3D sculpture
   ├─ about/               scroll-lit words, principles
   ├─ services/            3D-tilt cards
   ├─ projects/            index list, cursor preview, full-bleed modal
   ├─ experience/          pinned scroll-travel 3D section (lazy-loaded)
   ├─ contact/             validated form
   └─ three/               Sculpture, HeroScene, ExperienceScene
```

## Customising

- **Copy and projects:** edit `src/data/content.js`.
- **Colours / fonts:** CSS variables at the top of `src/styles/global.css`.
- **Project artwork:** generated in `ProjectArt.jsx`. To use real images, swap `<ProjectArt>` for `<img>` in `Projects.jsx` and `ProjectModal.jsx`.
- **Blender models:** export `.glb` (Draco compression), put it in `public/models/`, then in a scene file:
  ```jsx
  import { useGLTF } from '@react-three/drei'
  const { scene } = useGLTF('/models/my-model.glb', true) // true = Draco from CDN
  <primitive object={scene} />
  ```

## Performance and accessibility built in

- 3D quality drops automatically on phones/tablets (resolution, particles, glass).
- Canvases stop rendering when off-screen; the Experience scene is code-split and loads only near the viewport.
- `prefers-reduced-motion`: no smooth scroll, no intro animation, static sculpture, instant transitions.
- Skip link, keyboard-operable menu with focus trap, labelled form errors, live status messages, `aria-current` navigation.
- Touch devices keep vertical scrolling in the 3D section (orbit-drag is desktop-only).

## Deploy

`npm run build`, then upload `dist/` to Netlify, Vercel or Cloudflare Pages. Set the `.env` variables in the host's dashboard.
