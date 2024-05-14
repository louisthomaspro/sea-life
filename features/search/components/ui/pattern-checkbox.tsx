"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

interface PatternCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  pattern?: string
}

const PatternCheckbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, PatternCheckboxProps>(
  ({ className, children, pattern, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer relative m-1 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <div className="absolute -inset-1 rounded-md border-2 border-primary shadow" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
PatternCheckbox.displayName = CheckboxPrimitive.Root.displayName

export { PatternCheckbox }
