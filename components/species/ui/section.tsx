import { cn } from "@/lib/utils"

export const Section = ({ className, ...props }: any) => (
  <div className={cn("rounded-[26px]  border border-gray-100 px-6 py-4", className)} {...props} />
)

export const SectionTitle = ({ className, ...props }: any) => (
  <div className={cn("mb-2 flex items-center gap-4", className)} {...props}>
    <div className="text-sm font-semibold">{props.children}</div>
    {/* <div className="mr-4 h-[1px] flex-1 bg-gray-200"></div> */}
  </div>
)

export const SectionContent = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
)
