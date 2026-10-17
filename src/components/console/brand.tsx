import { cn } from '@/lib/utils'

export function LatticeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('size-[18px] shrink-0', className)}
    >
      <path d="M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M8 7h8v10H8z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="7" r="2.2" fill="var(--lat-action)" />
      <circle cx="16" cy="17" r="2.2" fill="var(--lat-series-1)" />
      <circle cx="16" cy="7" r="1.35" fill="currentColor" />
      <circle cx="8" cy="17" r="1.35" fill="currentColor" />
    </svg>
  )
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[15px] font-semibold tracking-[-0.025em] text-ink">Lattice</span>
      {compact ? null : (
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">UI</span>
      )}
    </span>
  )
}
