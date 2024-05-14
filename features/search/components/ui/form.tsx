import { cn } from "@/lib/utils"

export const InputGroup = ({ className, ...props }: any) => <div className={cn("space-y-2", className)} {...props} />

export const InputDescription = ({ className, ...props }: any) => (
  <p className={cn("text-[0.8rem] text-muted-foreground", className)} {...props} />
)
