import { cn } from "@/lib/utils"

export const Section = ({ className, ...props }: any) => <div className={cn("p-4", className)} {...props} />

export const SectionTitle = ({ className, ...props }: any) => (
  <div className={cn("mb-2 text-lg font-semibold", className)} {...props} />
)

export const SectionContent = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
)
