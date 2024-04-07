import { ChevronLeft, LoaderIcon, LucideProps, Search } from "lucide-react"

export const Icons = {
  spinner: (props: LucideProps) => <LoaderIcon {...props} className="animate-spin" />,
  search: (props: LucideProps) => <Search {...props} />,
  chevronLeft: (props: LucideProps) => <ChevronLeft {...props} />,
}
