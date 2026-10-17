import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = ({
  children,
  delayDuration = 380,
}: {
  children: React.ReactNode
  delayDuration?: number
}) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={250}>
    {children}
  </TooltipPrimitive.Provider>
)

export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={12}
      className={cn(
        'lat-tooltip-content z-[var(--lat-z-tooltip)] max-w-64 rounded-[var(--lat-radius-sm)] border border-line-strong bg-overlay px-2 py-1.5 text-[var(--lat-text-xs)] leading-4 text-ink shadow-[var(--lat-shadow-panel)]',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'
