import * as React from 'react'
import { createPortal } from 'react-dom'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export type ToastInput = {
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
}

type ToastItem = ToastInput & { id: string; tone: ToastTone }

type ToastContextValue = {
  toast: (input: ToastInput) => string
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

const toneStyles: Record<ToastTone, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

function ToastIcon({ tone }: { tone: ToastTone }) {
  if (tone === 'success') return <CircleCheck className="size-4" />
  if (tone === 'warning') return <TriangleAlert className="size-4" />
  if (tone === 'danger') return <CircleX className="size-4" />
  return <Info className="size-4" />
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = React.useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2)
      const item: ToastItem = { ...input, id, tone: input.tone ?? 'info' }
      setItems((current) => [...current.slice(-3), item])
      const duration = input.duration ?? 4200
      if (duration > 0) {
        timers.current.set(id, setTimeout(() => dismiss(id), duration))
      }
      return id
    },
    [dismiss],
  )

  React.useEffect(() => () => {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div
              className="pointer-events-none fixed bottom-4 right-4 z-[var(--lat-z-tooltip)] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2"
              aria-live="polite"
              aria-label="通知"
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  role="status"
                  className="lat-toast pointer-events-auto flex items-start gap-2.5 rounded-[var(--lat-radius-lg)] border border-line bg-overlay px-3 py-2.5 text-ink shadow-[var(--lat-shadow-panel)]"
                >
                  <span className={cn('mt-0.5 shrink-0', toneStyles[item.tone])}>
                    <ToastIcon tone={item.tone} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[var(--lat-text-sm)] font-medium">{item.title}</div>
                    {item.description ? (
                      <div className="mt-0.5 text-[var(--lat-text-xs)] leading-4 text-muted">{item.description}</div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="关闭通知"
                    onClick={() => dismiss(item.id)}
                    className="flex size-5 shrink-0 items-center justify-center rounded-[var(--lat-radius-xs)] text-faint hover:bg-hover hover:text-ink"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
