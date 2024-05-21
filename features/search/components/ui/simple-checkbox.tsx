"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

interface SimpleCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  pattern?: string
}

const SimpleCheckbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, SimpleCheckboxProps>(
  ({ className, children, pattern, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer relative m-1 shrink-0 rounded-md border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-950 data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <div className="absolute -inset-1 rounded-[15px] border-2 border-primary shadow" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
SimpleCheckbox.displayName = CheckboxPrimitive.Root.displayName

export { SimpleCheckbox }
