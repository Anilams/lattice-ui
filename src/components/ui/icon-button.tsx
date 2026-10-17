import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-[var(--lat-radius-sm)] border text-muted transition-[background-color,border-color,color] duration-[var(--lat-duration-fast)] ease-[var(--lat-ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        ghost: 'border-transparent bg-transparent hover:bg-hover hover:text-ink',
        outline: 'border-line-strong bg-raised hover:bg-hover hover:text-ink',
        soft: 'border-transparent bg-action-soft text-action hover:bg-action/20',
        danger: 'border-transparent text-muted hover:bg-danger-soft hover:text-danger',
      },
      size: {
        sm: 'size-6',
        md: 'size-[var(--lat-control-height)]',
        lg: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof iconButtonVariants> {
  label: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, label, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
IconButton.displayName = 'IconButton'
