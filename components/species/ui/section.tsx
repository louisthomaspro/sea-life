import { cn } from "@/lib/utils"

export const Section = ({ className, ...props }: any) => <div className={cn("", className)} {...props} />

export const SectionTitle = ({ className, ...props }: any) => (
  <div className={cn("mb-2 flex items-center gap-4", className)} {...props}>
    <div className="text-lg font-semibold">{props.children}</div>
    <div className="mr-4 h-[1px] flex-1 bg-gray-200"></div>
  </div>
)

export const SectionContent = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
)
