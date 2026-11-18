import { useEffect, useRef, useState } from 'react'

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Interpolates { [clusterId]: { x, y, s } } toward `targets` whenever it changes.
// `targets` must be memoised by the caller.
export default function useTweenedLayout(targets, duration = 700) {
  const [current, setCurrent] = useState(targets)
  const currentRef = useRef(targets)

  useEffect(() => {
    const from = currentRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let frame

    const tick = (now) => {
      const progress = reduceMotion ? 1 : Math.min(1, (now - start) / duration)
      const eased = easeInOutCubic(progress)
      const next = {}
      Object.entries(targets).forEach(([id, to]) => {
        const origin = from[id] ?? to
        next[id] = {
          x: origin.x + (to.x - origin.x) * eased,
          y: origin.y + (to.y - origin.y) * eased,
          s: origin.s + (to.s - origin.s) * eased,
        }
      })
      currentRef.current = next
      setCurrent(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [targets, duration])

  return current
}
