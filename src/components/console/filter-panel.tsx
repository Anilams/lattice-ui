import * as React from 'react'
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type FilterOption = {
  value: string
  label: string
  count?: number
  tone?: 'success' | 'warning' | 'danger' | 'neutral'
}

export type FilterGroup = {
  id: string
  label: string
  options: FilterOption[]
  defaultOpen?: boolean
}

export function FilterPanel({
  search,
  onSearchChange,
  groups,
  selected,
  onToggle,
  onClear,
  resultCount,
  className,
}: {
  search: string
  onSearchChange: (value: string) => void
  groups: FilterGroup[]
  selected: Record<string, string[]>
  onToggle: (group: string, value: string) => void
  onClear: () => void
  resultCount: number
  className?: string
}) {
  const activeCount = Object.values(selected).reduce((total, values) => total + values.length, 0)
  return (
    <div className={cn('flex min-h-0 flex-col bg-surface', className)}>
      <div className="border-b border-line p-2.5">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜索设备、IP 或型号"
          aria-label="搜索设备、IP 或型号"
          leading={<Search className="size-3.5" />}
          className="h-full"
        />
      </div>
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="flex items-center gap-1.5 text-[var(--lat-text-2xs)] font-medium uppercase tracking-[0.08em] text-faint">
          <SlidersHorizontal className="size-3" />
          筛选
        </span>
        {activeCount > 0 ? (
          <Button variant="link" size="sm" className="h-auto text-[10px]" onClick={onClear}>
            清除 {activeCount}
          </Button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
        {groups.map((group) => (
          <FilterGroupRow
            key={group.id}
            group={group}
            selected={selected[group.id] ?? []}
            onToggle={(value) => onToggle(group.id, value)}
          />
        ))}
      </div>
      <div className="border-t border-line px-3 py-2 text-[10px] text-faint" aria-live="polite">
        {resultCount} 个匹配设备
      </div>
    </div>
  )
}

function FilterGroupRow({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup
  selected: string[]
  onToggle: (value: string) => void
}) {
  const [open, setOpen] = React.useState(group.defaultOpen ?? true)
  return (
    <div className="border-b border-line-faint py-1 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-[var(--lat-radius-sm)] px-1.5 py-1.5 text-[var(--lat-text-xs)] font-medium text-muted hover:bg-hover hover:text-ink"
      >
        {group.label}
        <ChevronDown className={cn('size-3 text-faint transition-transform', !open && '-rotate-90')} />
      </button>
      {open ? (
        <div className="space-y-1 px-1.5 pb-2 pt-0.5">
          {group.options.map((option) => {
            const checked = selected.includes(option.value)
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-[var(--lat-radius-xs)] px-0.5 py-0.5 text-[var(--lat-text-xs)] text-muted hover:text-ink"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggle(option.value)}
                  aria-label={option.label}
                />
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                  {option.tone ? (
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        option.tone === 'success' && 'bg-success',
                        option.tone === 'warning' && 'bg-warning',
                        option.tone === 'danger' && 'bg-danger',
                        option.tone === 'neutral' && 'bg-faint',
                      )}
                    />
                  ) : null}
                  <span className="truncate">{option.label}</span>
                </span>
                {option.count !== undefined ? (
                  <span className="text-[10px] tabular-nums text-faint">{option.count}</span>
                ) : null}
              </label>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
