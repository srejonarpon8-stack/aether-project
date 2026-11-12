import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import Sculpture from './Sculpture'
import useQuality from '../../hooks/useQuality'
import { hasWebGL } from '../../utils/webgl'

// Baked "light strips" — gives chrome something contrasty to reflect
const LIGHTS = [
  { form: 'rect', intensity: 5, color: '#ffffff', scale: [12, 2.5, 1], position: [0, 6, -3] },
  { form: 'rect', intensity: 3, color: '#b9c4ff', scale: [2, 10, 1], position: [-7, 0, 2] },
  { form: 'rect', intensity: 2.2, color: '#ffd9b8', scale: [1.5, 6, 1], position: [7, -2, 3] },
  { form: 'ring', intensity: 4, color: '#ffffff', scale: 6, position: [0, 0, -8] },
]

export default function HeroScene({ started, active, reducedMotion, onReady }) {
  const quality = useQuality()
  const webgl = hasWebGL()

  useEffect(() => {
    if (!webgl) onReady?.() // never block the loader if WebGL is unavailable
  }, [webgl, onReady])

  if (!webgl) return null

  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : active ? 'always' : 'never'}
      onCreated={() => onReady?.()}
    >
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#030304']} />
        {LIGHTS.map((l, i) => (
          <Lightformer
            key={i}
            form={l.form}
            intensity={l.intensity}
            color={l.color}
            scale={l.scale}
            position={l.position}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
        ))}
      </Environment>

      <Sculpture started={started} reducedMotion={reducedMotion} transmission={quality.transmission} />

      <Sparkles
        count={quality.particles}
        scale={[11, 6, 6]}
        size={2}
        speed={reducedMotion ? 0 : 0.25}
        opacity={0.55}
        color="#cfd3da"
      />
    </Canvas>
  )
}
