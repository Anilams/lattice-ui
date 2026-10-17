import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string
  description?: string
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, id, ...props }, ref) => {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const control = (
    <SwitchPrimitive.Root
      ref={ref}
      id={inputId}
      className={cn(
        'peer relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer items-center rounded-full border border-line-strong bg-line-strong p-0.5 transition-[background-color,border-color] duration-[var(--lat-duration-fast)] after:absolute after:-inset-[3px] after:content-[""] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-action data-[state=checked]:bg-action',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-[var(--lat-duration-fast)] ease-[var(--lat-ease-out)] data-[state=checked]:translate-x-3.5" />
    </SwitchPrimitive.Root>
  )

  if (!label && !description) return control

  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={inputId} className="cursor-pointer select-none">
        <span className="block text-[var(--lat-text-sm)] leading-[18px] text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block max-w-[48ch] text-[var(--lat-text-xs)] leading-4 text-faint">
            {description}
          </span>
        ) : null}
      </label>
      {control}
    </div>
  )
})
Switch.displayName = 'Switch'
