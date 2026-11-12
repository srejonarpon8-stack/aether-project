import { useMemo } from 'react'

// Decide 3D quality once, based on device. Cheaper settings on phones/tablets.
export default function useQuality() {
  return useMemo(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const low = coarse || window.innerWidth < 768

    return {
      low,
      coarse,
      dpr: low ? [1, 1.5] : [1, 2],
      transmission: low
        ? { samples: 4, resolution: 256 }
        : { samples: 8, resolution: 512 },
      particles: low ? 40 : 110,
    }
  }, [])
}
