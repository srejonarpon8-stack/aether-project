// Original line-art glyphs, one per service. Pure SVG, no assets.
const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round', strokeLinecap: 'round' }

export default function ServiceGlyph({ id }) {
  return (
    <svg className="glyph" viewBox="0 0 100 100" aria-hidden="true" {...common}>
      {id === 'web' && (
        <>
          <rect className="g1" x="12" y="30" width="56" height="44" rx="3" />
          <rect className="g2" x="22" y="20" width="56" height="44" rx="3" />
          <rect className="g3" x="32" y="10" width="56" height="44" rx="3" />
          <path d="M32 24h56" />
        </>
      )}
      {id === '3d' && (
        <>
          <polygon points="50,8 90,30 90,70 50,92 10,70 10,30" />
          <path d="M50 50v42M50 50L10 30M50 50l40-20" />
          <path className="g2" d="M30 40l20 10 20-10" />
        </>
      )}
      {id === 'motion' && (
        <>
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <circle className="g1" cx="50" cy="50" r="20" strokeDasharray="3 5" />
          <circle className="g2" cx="50" cy="50" r="34" strokeDasharray="1 7" />
          <circle className="g3" cx="84" cy="50" r="3.5" fill="currentColor" />
        </>
      )}
      {id === 'dev' && (
        <>
          <polyline points="34,28 12,50 34,72" />
          <polyline points="66,28 88,50 66,72" />
          <path className="g2" d="M56 22L44 78" />
        </>
      )}
    </svg>
  )
}
