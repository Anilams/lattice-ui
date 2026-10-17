import * as React from 'react'
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/console/empty-state'

export type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
  width?: string
  align?: 'left' | 'right'
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl'
}

type SortState = { id: string; direction: 'asc' | 'desc' } | null

const hideClass = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
} as const

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  selected,
  onSelectedChange,
  onRowClick,
  emptyTitle = '没有匹配的设备',
  emptyDescription = '调整搜索或筛选条件后再试。',
  initialSort,
  minWidth = 760,
  className,
}: {
  rows: T[]
  columns: DataTableColumn<T>[]
  getRowId: (row: T) => string
  selected?: Set<string>
  onSelectedChange?: (selected: Set<string>) => void
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
  initialSort?: SortState
  minWidth?: number
  className?: string
}) {
  const [sort, setSort] = React.useState<SortState>(initialSort ?? null)
  const sortedRows = React.useMemo(() => {
    if (!sort) return rows
    const column = columns.find((item) => item.id === sort.id)
    if (!column?.sortValue) return rows
    return [...rows].sort((a, b) => {
      const left = column.sortValue!(a)
      const right = column.sortValue!(b)
      const result =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), 'zh-CN', { numeric: true })
      return sort.direction === 'asc' ? result : -result
    })
  }, [rows, columns, sort])

  const allVisible = sortedRows.length > 0 && sortedRows.every((row) => selected?.has(getRowId(row)))
  const someVisible = sortedRows.some((row) => selected?.has(getRowId(row)))
  const toggleAll = () => {
    if (!onSelectedChange) return
    const next = new Set(selected ?? [])
    if (allVisible) {
      sortedRows.forEach((row) => next.delete(getRowId(row)))
    } else {
      sortedRows.forEach((row) => next.add(getRowId(row)))
    }
    onSelectedChange(next)
  }
  const toggleRow = (id: string) => {
    if (!onSelectedChange) return
    const next = new Set(selected ?? [])
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectedChange(next)
  }
  const cycleSort = (column: DataTableColumn<T>) => {
    if (!column.sortValue) return
    if (sort?.id !== column.id) {
      setSort({ id: column.id, direction: 'asc' })
    } else if (sort.direction === 'asc') {
      setSort({ id: column.id, direction: 'desc' })
    } else {
      setSort(null)
    }
  }

  if (!rows.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    )
  }

  return (
    <div className={cn('min-w-0 overflow-x-auto', className)}>
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead className="sticky top-0 z-10 bg-surface">
          <tr className="border-b border-line">
            {onSelectedChange ? (
              <th className="w-9 px-3 py-0">
                <Checkbox
                  checked={allVisible ? true : someVisible ? 'indeterminate' : false}
                  onCheckedChange={toggleAll}
                  aria-label="选择全部可见设备"
                />
              </th>
            ) : null}
            {columns.map((column) => {
              const active = sort?.id === column.id
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={cn(
                    'h-9 whitespace-nowrap px-3 text-[10px] font-medium text-faint',
                    column.align === 'right' && 'text-right',
                    column.hideBelow && hideClass[column.hideBelow],
                  )}
                  style={{ width: column.width }}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => cycleSort(column)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-[var(--lat-radius-xs)] py-1 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35',
                        active && 'text-ink',
                      )}
                    >
                      {column.header}
                      {active ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="size-2.5" />
                        ) : (
                          <ArrowDown className="size-2.5" />
                        )
                      ) : (
                        <ChevronDown className="size-2.5 opacity-35" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => {
            const id = getRowId(row)
            const isSelected = selected?.has(id)
            return (
              <tr
                key={id}
                data-selected={isSelected || undefined}
                onClick={(event) => {
                  if (!onRowClick) return
                  const target = event.target as HTMLElement
                  if (target.closest('button, input, a, [role="menuitem"]')) return
                  onRowClick(row)
                }}
                className={cn(
                  'h-[var(--lat-row-height)] border-b border-line-faint text-[var(--lat-text-xs)] text-muted transition-colors hover:bg-hover',
                  onRowClick && 'cursor-pointer',
                  isSelected && 'bg-selected',
                )}
              >
                {onSelectedChange ? (
                  <td className="w-9 px-3">
                    <Checkbox
                      checked={Boolean(isSelected)}
                      onCheckedChange={() => toggleRow(id)}
                      aria-label={'选择 ' + id}
                    />
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-3 py-0 align-middle',
                      column.align === 'right' && 'text-right',
                      column.hideBelow && hideClass[column.hideBelow],
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
