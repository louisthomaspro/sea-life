import { SVGProps } from "react"
import { faChevronLeft, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome"

import { cn } from "@/lib/utils"

type Icon = Partial<SVGProps<SVGSVGElement>>

export const Icons = {
  // lucidIcon: (props: LucideProps) => <LucidIcon {...props} />,
  // fontAwesomeIcon: (props: FontAwesomeIconProps) => <FontAwesomeIcon {...props} icon={faIcon} />,
  // customIcon: (props: Icon) => <CustomIcon {...props} />,

  // facebookCircle: (props: Icon) => <FacebookCircle {...props} />,

  search: (props: Partial<FontAwesomeIconProps>) => <FontAwesomeIcon {...props} icon={faMagnifyingGlass} />,
  chevronLeft: (props: Partial<FontAwesomeIconProps>) => <FontAwesomeIcon {...props} icon={faChevronLeft} />,
}
