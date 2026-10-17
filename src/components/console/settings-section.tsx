import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Panel } from '@/components/ui/panel'

export function SettingsSection({
  title,
  description,
  icon,
  children,
  defaultOpen = true,
  className,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const id = React.useId()
  return (
    <Panel className={cn('overflow-hidden', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-action/35"
      >
        {icon ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--lat-radius-sm)] border border-line bg-raised text-muted">
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block text-[var(--lat-text-sm)] font-medium text-ink">{title}</span>
          {description ? <span className="mt-0.5 block text-[var(--lat-text-xs)] text-faint">{description}</span> : null}
        </span>
        <ChevronDown className={cn('size-4 text-faint transition-transform', !open && '-rotate-90')} />
      </button>
      {open ? (
        <div id={id} className="border-t border-line px-4 py-1">
          {children}
        </div>
      ) : null}
    </Panel>
  )
}

export function SettingRow({
  label,
  description,
  children,
  className,
}: {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid gap-2 border-b border-line-faint py-3.5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-center md:gap-8', className)}>
      <div>
        <div className="text-[var(--lat-text-sm)] text-ink">{label}</div>
        {description ? <div className="mt-0.5 text-[var(--lat-text-xs)] leading-4 text-faint">{description}</div> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
