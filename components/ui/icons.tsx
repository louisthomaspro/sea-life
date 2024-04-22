import { ChevronLeft, Home, LoaderIcon, LucideProps, Search, User } from "lucide-react"

export const Icons = {
  spinner: (props: LucideProps) => <LoaderIcon {...props} className="animate-spin" />,
  search: (props: LucideProps) => <Search {...props} />,
  chevronLeft: (props: LucideProps) => <ChevronLeft {...props} />,
  chevronRight: (props: LucideProps) => <ChevronLeft {...props} style={{ transform: "rotate(180deg)" }} />,
  home: (props: LucideProps) => <Home {...props} />,
  account: (props: LucideProps) => <User {...props} />,
}
