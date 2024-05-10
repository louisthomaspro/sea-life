import { SVGProps } from "react"
import GoogleLogo from "@/public/svg/google-logo.svg"
import Sociability from "@/public/svg/sociability.svg"
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  Gem,
  Globe,
  Home,
  LoaderIcon,
  LucideProps,
  Pencil,
  Plus,
  Ruler,
  Search,
  Trash,
  User,
  Waves,
  X,
} from "lucide-react"

type Icon = Partial<SVGProps<SVGSVGElement>>

export const Icons = {
  spinner: (props: LucideProps) => <LoaderIcon {...props} className="animate-spin" />,
  search: (props: LucideProps) => <Search {...props} />,
  chevronLeft: (props: LucideProps) => <ChevronLeft {...props} />,
  chevronRight: (props: LucideProps) => <ChevronLeft {...props} style={{ transform: "rotate(180deg)" }} />,
  home: (props: LucideProps) => <Home {...props} />,
  account: (props: LucideProps) => <User {...props} />,
  close: (props: LucideProps) => <X {...props} />,
  list: (props: LucideProps) => <Bookmark {...props} />,
  listAdded: (props: LucideProps) => <BookmarkCheck {...props} />,
  add: (props: LucideProps) => <Plus {...props} />,
  delete: (props: LucideProps) => <Trash {...props} />,
  check: (props: LucideProps) => <CheckCircle2 {...props} />,
  edit: (props: LucideProps) => <Pencil {...props} />,
  google: (props: Icon) => <GoogleLogo {...props} />,
  // Icons species details
  maxLength: (props: Icon) => <Ruler {...props} />,
  depth: (props: Icon) => <Waves {...props} />,
  rarity: (props: Icon) => <Gem {...props} />,
  sociability: (props: Icon) => <Sociability {...props} />,
  habitat: (props: Icon) => <Home {...props} />,
  region: (props: Icon) => <Globe {...props} />,
}
