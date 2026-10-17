import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--lat-radius-sm)] border text-[var(--lat-text-sm)] font-medium leading-none transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--lat-duration-fast)] ease-[var(--lat-ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-45 active:translate-y-px',
  {
    variants: {
      variant: {
        primary:
          'border-action bg-action text-action-text hover:border-action-hover hover:bg-action-hover',
        secondary:
          'border-line-strong bg-raised text-ink hover:border-[var(--lat-text-faint)] hover:bg-hover',
        ghost:
          'border-transparent bg-transparent text-muted hover:bg-hover hover:text-ink',
        danger:
          'border-danger/35 bg-danger-soft text-danger hover:border-danger/60 hover:bg-danger/18',
        link:
          'h-auto border-transparent bg-transparent px-0 text-action hover:text-action-hover',
      },
      size: {
        sm: 'h-[var(--lat-control-height-sm)] px-2.5 text-[var(--lat-text-xs)]',
        md: 'h-[var(--lat-control-height)] px-3',
        lg: 'h-9 px-4 text-[var(--lat-text-md)]',
        icon: 'size-[var(--lat-control-height)] p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'

export { buttonVariants }
