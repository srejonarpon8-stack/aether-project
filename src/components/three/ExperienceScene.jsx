import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial, OrbitControls, Sparkles } from '@react-three/drei'
import { MathUtils, Object3D } from 'three'
import { EXPERIENCE_OBJECTS } from '../../data/content'
import useQuality from '../../hooks/useQuality'

const { damp } = MathUtils
export const TRAVEL = 28 // how far the world slides toward the camera over the full scroll

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Instanced chrome shards scattered along the path (one draw call). */
function Shards({ count, reducedMotion }) {
  const mesh = useRef()
  const dummy = useMemo(() => new Object3D(), [])
  const items = useMemo(() => {
    const rnd = mulberry32(7)
    return Array.from({ length: count }, () => {
      let x = (rnd() - 0.5) * 16
      const y = (rnd() - 0.5) * 9
      if (Math.abs(x) < 1.3 && Math.abs(y) < 1.3) x += x < 0 ? -2.5 : 2.5 // keep the centre lane clear
      return {
        p: [x, y, -rnd() * 44 - 2],
        r: [rnd() * 6, rnd() * 6, rnd() * 6],
        s: 0.15 + rnd() * 0.55,
        st: 1 + rnd() * 1.8,
        v: (rnd() - 0.5) * 0.6,
      }
    })
  }, [count])

  const place = () => {
    items.forEach((d, i) => {
      dummy.position.set(...d.p)
      dummy.rotation.set(...d.r)
      dummy.scale.set(d.s, d.s * d.st, d.s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(place, [items])

  useFrame((_, dt) => {
    if (reducedMotion) return
    items.forEach((d) => {
      d.r[0] += dt * d.v
      d.r[1] += dt * d.v * 0.7
    })
    place()
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#cfd2d8" metalness={1} roughness={0.15} flatShading envMapIntensity={1.4} />
    </instancedMesh>
  )
}

/** One clickable hero object. */
function FocalObject({ data, pulse, onSelect, reducedMotion, low }) {
  const ref = useRef()
  const spin = useRef(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (pulse.id === data.id && !reducedMotion) spin.current = 12
  }, [pulse, data.id, reducedMotion])

  useEffect(() => () => { document.body.style.cursor = '' }, [])

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    spin.current = damp(spin.current, 0, 2.5, dt)
    if (!reducedMotion) {
      m.rotation.y += dt * 0.25 + spin.current * dt
      m.rotation.x += dt * 0.1
    }
    m.scale.setScalar(damp(m.scale.x, hover ? 1.15 : 1, 6, dt))
  })

  const glass = data.type === 'torus'

  return (
    <mesh
      ref={ref}
      position={data.position}
      onClick={(e) => { e.stopPropagation(); onSelect(data.id) }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
    >
      {data.type === 'sphere' && <sphereGeometry args={[1.2, 64, 64]} />}
      {data.type === 'torus' && <torusGeometry args={[1.2, 0.4, 48, 128]} />}
      {data.type === 'ico' && <icosahedronGeometry args={[1.3, 0]} />}

      {glass && !low ? (
        <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.6} ior={1.35} chromaticAberration={0.06} roughness={0.03} color="#e6ecff" />
      ) : glass ? (
        <meshPhysicalMaterial color="#dfe6ff" transparent opacity={0.35} roughness={0} metalness={0.1} envMapIntensity={2} />
      ) : (
        <meshStandardMaterial color="#d4d7dd" metalness={1} roughness={data.type === 'ico' ? 0.18 : 0.06} flatShading={data.type === 'ico'} envMapIntensity={1.6} />
      )}
    </mesh>
  )
}

/** Scroll progress slides the whole world toward the camera. */
function Rig({ progress, reducedMotion, children }) {
  const g = useRef()
  useFrame((_, dt) => {
    const target = progress.current * TRAVEL
    g.current.position.z = reducedMotion ? target : damp(g.current.position.z, target, 4, dt)
    if (!reducedMotion) g.current.rotation.z = damp(g.current.rotation.z, progress.current * 0.5, 3, dt)
  })
  return <group ref={g}>{children}</group>
}

/** A soft light that follows the pointer. */
function PointerLight() {
  const l = useRef()
  useFrame(({ pointer, viewport }, dt) => {
    l.current.position.x = damp(l.current.position.x, (pointer.x * viewport.width) / 2, 4, dt)
    l.current.position.y = damp(l.current.position.y, (pointer.y * viewport.height) / 2, 4, dt)
  })
  return <pointLight ref={l} position={[0, 0, 3]} intensity={40} distance={14} decay={2} color="#bcd0ff" />
}

export default function ExperienceScene({ progress, active, pulse, onSelect, onReady, reducedMotion }) {
  const quality = useQuality()

  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={['#050506']} />
      <fog attach="fog" args={['#050506', 10, 42]} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#030304']} />
        <Lightformer form="rect" intensity={5} color="#ffffff" scale={[14, 2.5, 1]} position={[0, 6, -3]} onUpdate={(s) => s.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={3} color="#b9c4ff" scale={[2, 10, 1]} position={[-7, 0, 2]} onUpdate={(s) => s.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={2.2} color="#ffd9b8" scale={[1.5, 6, 1]} position={[7, -2, 3]} onUpdate={(s) => s.lookAt(0, 0, 0)} />
        <Lightformer form="ring" intensity={3} color="#ffffff" scale={7} position={[0, 0, -8]} onUpdate={(s) => s.lookAt(0, 0, 0)} />
      </Environment>

      <PointerLight />

      <Rig progress={progress} reducedMotion={reducedMotion}>
        <Shards count={quality.low ? 28 : 64} reducedMotion={reducedMotion} />
        {EXPERIENCE_OBJECTS.map((o) => (
          <FocalObject key={o.id} data={o} pulse={pulse} onSelect={onSelect} reducedMotion={reducedMotion} low={quality.low} />
        ))}
        <Sparkles count={quality.low ? 120 : 320} scale={[18, 10, 50]} position={[0, 0, -22]} size={2.2} speed={reducedMotion ? 0 : 0.3} opacity={0.6} color="#cfd3da" />
      </Rig>

      {/* Touch screens keep vertical scrolling instead of orbit-dragging */}
      {!quality.coarse && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
          minAzimuthAngle={-Math.PI * 0.35}
          maxAzimuthAngle={Math.PI * 0.35}
        />
      )}
    </Canvas>
  )
}
