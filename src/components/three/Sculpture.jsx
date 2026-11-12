import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import { Color, MathUtils } from 'three'

const { damp, clamp } = MathUtils

/**
 * Original procedural sculpture: a chrome trefoil knot, a refractive glass
 * ring and a thin chrome halo. No model files — zero download weight.
 */
export default function Sculpture({ started, reducedMotion, transmission }) {
  const group = useRef()
  const knot = useRef()
  const glass = useRef()
  const halo = useRef()
  const intro = useRef(reducedMotion ? 1 : 0)

  const viewportWidth = useThree((s) => s.viewport.width)
  const base = clamp(viewportWidth / 4.8, 0.45, 1.15)
  const refractionBg = useMemo(() => new Color('#050506'), [])

  useFrame((state, delta) => {
    if (reducedMotion) return

    const { pointer, camera } = state

    intro.current = damp(intro.current, started ? 1 : 0, 2.2, delta)
    group.current.scale.setScalar(base * Math.max(intro.current, 0.001))

    // Mouse influences the sculpture AND the camera
    group.current.rotation.y = damp(group.current.rotation.y, pointer.x * 0.7, 3, delta)
    group.current.rotation.x = damp(group.current.rotation.x, -pointer.y * 0.4, 3, delta)
    camera.position.x = damp(camera.position.x, pointer.x * 0.5, 2, delta)
    camera.position.y = damp(camera.position.y, pointer.y * 0.3, 2, delta)
    camera.lookAt(0, 0, 0)

    knot.current.rotation.y += delta * 0.18
    knot.current.rotation.x += delta * 0.06
    glass.current.rotation.z += delta * 0.12
    halo.current.rotation.y -= delta * 0.09
  })

  return (
    <group ref={group} scale={reducedMotion ? base : 0.001}>
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[0.85, 0.26, 280, 36, 2, 3]} />
          <meshStandardMaterial color="#c9ccd2" metalness={1} roughness={0.12} envMapIntensity={1.5} />
        </mesh>

        <mesh ref={glass} rotation={[Math.PI / 2.4, 0.3, 0]}>
          <torusGeometry args={[1.85, 0.17, 48, 128]} />
          <MeshTransmissionMaterial
            samples={transmission.samples}
            resolution={transmission.resolution}
            thickness={0.5}
            roughness={0.04}
            ior={1.3}
            chromaticAberration={0.08}
            anisotropicBlur={0.2}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.1}
            color="#e8ecff"
            background={refractionBg}
          />
        </mesh>

        <mesh ref={halo} rotation={[Math.PI / 2, 0.5, 0.4]}>
          <torusGeometry args={[2.45, 0.012, 16, 220]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  )
}
