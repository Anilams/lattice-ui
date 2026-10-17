import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

type TabsVariant = 'line' | 'segmented'
const TabsVariantContext = React.createContext<TabsVariant>('line')

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      line: 'gap-1 border-b border-line',
      segmented: 'gap-0.5 rounded-[var(--lat-radius-md)] border border-line bg-raised p-0.5',
    },
  },
  defaultVariants: { variant: 'line' },
})

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'line', ...props }, ref) => (
  <TabsVariantContext.Provider value={variant ?? 'line'}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  </TabsVariantContext.Provider>
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap text-[var(--lat-text-sm)] text-muted transition-[background-color,border-color,color,box-shadow] duration-[var(--lat-duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/35 disabled:pointer-events-none disabled:opacity-40',
        variant === 'line' &&
          '-mb-px h-[34px] border-b-2 border-transparent px-2 hover:text-ink data-[state=active]:border-action data-[state=active]:text-ink',
        variant === 'segmented' &&
          'h-[26px] rounded-[var(--lat-radius-sm)] px-2.5 hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-[var(--lat-shadow-sm)]',
        className,
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'outline-none focus-visible:ring-2 focus-visible:ring-action/35 data-[state=active]:animate-[lat-fade-in_160ms_var(--lat-ease-out)]',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export const Tabs = TabsPrimitive.Root
