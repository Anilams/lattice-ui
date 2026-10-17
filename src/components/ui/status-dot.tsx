import { cn } from '@/lib/utils'

type Status = 'online' | 'warning' | 'offline' | 'info' | 'neutral'

const statusClass: Record<Status, string> = {
  online: 'bg-success',
  warning: 'bg-warning',
  offline: 'bg-danger',
  info: 'bg-action',
  neutral: 'bg-[var(--lat-text-faint)]',
}

export function StatusDot({
  status = 'online',
  pulse = false,
  className,
  label,
}: {
  status?: Status
  pulse?: boolean
  className?: string
  label?: string
}) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cn('relative inline-flex size-1.5 shrink-0 rounded-full', statusClass[status], className)}
    >
      {pulse ? (
        <span
          className={cn(
            'absolute inset-0 rounded-full opacity-50',
            statusClass[status],
            'animate-[lat-pulse_2.8s_ease-in-out_infinite]',
          )}
          aria-hidden="true"
        />
      ) : null}
    </span>
  )
}
