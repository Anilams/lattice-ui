import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sheetVariants = cva(
  'lat-sheet-content fixed z-[var(--lat-z-dialog)] flex flex-col bg-surface text-ink shadow-[var(--lat-shadow-overlay)] outline-none',
  {
    variants: {
      side: {
        right: 'inset-y-0 right-0 w-[min(92vw,460px)] border-l border-line',
        left: 'inset-y-0 left-0 w-[min(92vw,320px)] border-r border-line',
        bottom: 'inset-x-0 bottom-0 max-h-[86vh] rounded-t-[var(--lat-radius-xl)] border-t border-line',
      },
    },
    defaultVariants: { side: 'right' },
  },
)

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof sheetVariants>
>(({ className, children, side, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="lat-overlay fixed inset-0 z-[var(--lat-z-overlay)] bg-[var(--lat-scrim)]" />
    <DialogPrimitive.Content
      ref={ref}
      data-side={side ?? 'right'}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[var(--lat-radius-sm)] text-faint transition-colors hover:bg-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35">
        <X className="size-4" />
        <span className="sr-only">关闭</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
SheetContent.displayName = 'SheetContent'

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 border-b border-line px-4 py-3.5 pr-12', className)} {...props} />
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-[var(--lat-text-md)] font-semibold text-ink', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-[var(--lat-text-xs)] leading-4 text-faint', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto', className)} {...props} />
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2 border-t border-line px-4 py-3', className)} {...props} />
}
