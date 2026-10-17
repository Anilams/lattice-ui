import * as React from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function useAnimatedNumber(value: number, duration = 420) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = React.useState(value)
  const displayRef = React.useRef(value)
  const frame = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (reduced || !Number.isFinite(value)) {
      displayRef.current = value
      setDisplay(value)
      return
    }
    const from = displayRef.current
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const next = from + (value - from) * easeOutCubic(progress)
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [value, duration, reduced])

  return Number.isFinite(display) ? display : value
}

export function useAnimatedSeries(values: number[], duration = 520) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = React.useState(values)
  const displayRef = React.useRef(values)
  const frame = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (reduced || !values.length) {
      displayRef.current = values
      setDisplay(values)
      return
    }
    const from = displayRef.current.length === values.length ? displayRef.current : values.map(() => 0)
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = easeOutCubic(progress)
      const next = values.map((target, index) => from[index] + (target - from[index]) * eased)
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [values, duration, reduced])

  return display
}
