"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

interface ColorCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  color: string
}

const ColorCheckbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, ColorCheckboxProps>(
  ({ className, color, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      style={{ backgroundColor: color }}
      className={cn(
        "peer relative m-1 h-8 w-8 shrink-0 rounded-full shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        {/* ring outside the checkbox */}
        <div className="absolute -inset-1 rounded-full border-2 border-primary shadow"></div>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
ColorCheckbox.displayName = CheckboxPrimitive.Root.displayName

export { ColorCheckbox }
