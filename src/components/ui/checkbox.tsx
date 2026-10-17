import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, id, ...props }, ref) => {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const control = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={inputId}
      className={cn(
        'peer relative flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-line-strong bg-raised text-action-text transition-[background-color,border-color,box-shadow] duration-[var(--lat-duration-fast)] after:absolute after:-inset-1.5 after:content-[""] hover:border-[var(--lat-text-faint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-action data-[state=checked]:bg-action data-[state=indeterminate]:border-action data-[state=indeterminate]:bg-action',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {props.checked === 'indeterminate' ? (
          <Minus className="size-2.5" strokeWidth={3} />
        ) : (
          <Check className="size-2.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label && !description) return control

  return (
    <div className="flex items-start gap-2">
      <span className="flex h-4 items-center">{control}</span>
      <label htmlFor={inputId} className="cursor-pointer select-none">
        <span className="block text-[var(--lat-text-sm)] leading-4 text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[var(--lat-text-xs)] leading-4 text-faint">{description}</span>
        ) : null}
      </label>
    </div>
  )
})
Checkbox.displayName = 'Checkbox'
