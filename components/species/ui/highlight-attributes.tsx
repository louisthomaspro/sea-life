import { cn } from "@/lib/utils"

export const HighlightAttributes = ({ className, ...props }: any) => (
  <div className={cn("flex items-center justify-center rounded-lg bg-blue-50 p-3", className)} {...props} />
)

export const HighlightAttributesElement = ({ className, ...props }: any) => (
  <div className={cn("flex max-w-28 flex-1 flex-col items-center gap-y-1 font-medium", className)} {...props} />
)
