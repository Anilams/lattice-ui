import * as React from 'react'
import { cn } from '@/lib/utils'
import { controlBase } from './control'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      hint,
      error,
      leading,
      trailing,
      id,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const helpId = error ? inputId + '-error' : hint ? inputId + '-hint' : undefined

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className="text-[var(--lat-text-xs)] font-medium text-muted">
            {label}
            {required ? <span className="ml-1 text-danger">*</span> : null}
          </label>
        ) : null}
        <div
          className={cn(
            'group flex items-center gap-2 rounded-[var(--lat-radius-sm)] border border-line-strong bg-raised px-2.5 transition-[border-color,box-shadow] duration-[var(--lat-duration-fast)] focus-within:border-action focus-within:ring-2 focus-within:ring-action/25',
            error && 'border-danger/70 focus-within:border-danger focus-within:ring-danger/20',
            'h-[var(--lat-control-height)]',
          )}
        >
          {leading ? <span className="shrink-0 text-faint">{leading}</span> : null}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={helpId}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-[var(--lat-text-sm)] text-ink outline-none placeholder:text-faint focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          />
          {trailing ? <span className="shrink-0 text-faint">{trailing}</span> : null}
        </div>
        {error ? (
          <p id={helpId} className="text-[var(--lat-text-xs)] text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={helpId} className="text-[var(--lat-text-xs)] text-faint">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
