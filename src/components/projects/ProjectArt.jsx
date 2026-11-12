// Procedural monochrome artwork for each project — original, generated from math.
const S = 'currentColor'
const rad = (d) => (d * Math.PI) / 180

function Rings() {
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={200 + (i - 7) * 5} cy="250" r={24 + i * 13} fill="none" stroke={S} strokeOpacity={0.12 + i * 0.05} />
      ))}
      <circle cx="200" cy="250" r="18" fill={S} />
    </>
  )
}

function Grid() {
  return (
    <>
      {Array.from({ length: 17 }, (_, i) => {
        const k = i - 8
        return <line key={`v${i}`} x1={200 + k * 70} y1="500" x2={200 + k * 9} y2="170" stroke={S} strokeOpacity="0.3" />
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const t = i / 11
        const y = 170 + t * t * 330
        return <line key={`h${i}`} x1="0" x2="400" y1={y} y2={y} stroke={S} strokeOpacity={0.1 + t * 0.4} />
      })}
      <circle cx="200" cy="120" r="46" fill={S} />
    </>
  )
}

function Waves() {
  return (
    <>
      {Array.from({ length: 18 }, (_, j) => {
        const y0 = 70 + j * 22
        let d = `M0 ${y0}`
        for (let x = 10; x <= 400; x += 10) d += ` L${x} ${(y0 + Math.sin(x * 0.03 + j * 0.5) * (8 + j * 1.5)).toFixed(1)}`
        return <path key={j} d={d} fill="none" stroke={S} strokeOpacity={0.15 + j * 0.045} />
      })}
    </>
  )
}

function Orbit() {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const rot = i * 30
        const a = rad(i * 57)
        const x = 170 * Math.cos(a)
        const y = 60 * Math.sin(a)
        const r = rad(rot)
        return (
          <g key={i}>
            <ellipse cx="200" cy="250" rx="170" ry="60" transform={`rotate(${rot} 200 250)`} fill="none" stroke={S} strokeOpacity="0.35" />
            <circle cx={200 + x * Math.cos(r) - y * Math.sin(r)} cy={250 + x * Math.sin(r) + y * Math.cos(r)} r="4" fill={S} />
          </g>
        )
      })}
      <circle cx="200" cy="250" r="34" fill={S} />
    </>
  )
}

function Spikes() {
  return (
    <>
      {Array.from({ length: 72 }, (_, i) => {
        const a = rad(i * 5)
        const r2 = 90 + (i % 3) * 45 + Math.sin(i * 0.7) * 25
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * 40} y1={250 + Math.sin(a) * 40}
            x2={200 + Math.cos(a) * r2} y2={250 + Math.sin(a) * r2}
            stroke={S} strokeOpacity={0.25 + (i % 3) * 0.25}
          />
        )
      })}
    </>
  )
}

function Blob() {
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        let d = ''
        for (let k = 0; k <= 36; k++) {
          const a = rad(k * 10)
          const r = (30 + i * 15) * (1 + 0.12 * Math.sin(k * 0.55 + i * 0.8) + 0.08 * Math.cos(k * 1.2))
          d += `${k ? 'L' : 'M'}${(200 + Math.cos(a) * r).toFixed(1)} ${(250 + Math.sin(a) * r).toFixed(1)} `
        }
        return <path key={i} d={d + 'Z'} fill="none" stroke={S} strokeOpacity={0.15 + i * 0.07} />
      })}
    </>
  )
}

const ART = { rings: Rings, grid: Grid, waves: Waves, orbit: Orbit, spikes: Spikes, blob: Blob }

export default function ProjectArt({ kind, label }) {
  const Art = ART[kind] || Rings
  return (
    <svg
      className="art"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <rect width="400" height="500" fill="#0c0c0e" />
      <Art />
    </svg>
  )
}
