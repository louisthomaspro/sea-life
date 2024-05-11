import { SVGProps } from "react"
import GoogleLogo from "@/public/svg/google-logo.svg"

import {
  CentralBookmarkCheckFilledOnStroke2Radius2,
  CentralBookmarkFilledOffStroke2Radius2,
  CentralChevronLeftFilledOffStroke2Radius2,
  CentralCircleCheckFilledOnStroke2Radius2,
  CentralCrossLargeFilledOffStroke2Radius2,
  CentralDiamondFilledOffStroke2Radius2,
  CentralEarthFilledOffStroke2Radius2,
  CentralGroup2FilledOffStroke2Radius2,
  CentralHomeOpenFilledOffStroke2Radius2,
  CentralLoaderFilledOffStroke2Radius2,
  CentralMagnifyingGlassFilledOffStroke2Radius2,
  CentralPencilLineFilledOffStroke2Radius2,
  CentralPeopleFilledOffStroke2Radius2,
  CentralPlusLargeFilledOffStroke2Radius2,
  CentralRulerFilledOffStroke2Radius2,
  CentralSquareGridCircleFilledOnStroke2Radius2,
  CentralTrashCanFilledOffStroke2Radius2,
  CentralTriangleExclamationFilledOffStroke2Radius2,
  CustomDepthIcon,
} from "@/components/ui/icons/central-icons"

type Icon = Partial<SVGProps<SVGSVGElement>>

export const Icons = {
  spinner: (props: Icon) => <CentralLoaderFilledOffStroke2Radius2 {...props} className="animate-spin" />,
  search: (props: Icon) => <CentralMagnifyingGlassFilledOffStroke2Radius2 {...props} />,
  chevronLeft: (props: Icon) => <CentralChevronLeftFilledOffStroke2Radius2 {...props} />,
  chevronRight: (props: Icon) => (
    <CentralChevronLeftFilledOffStroke2Radius2 {...props} style={{ transform: "rotate(180deg)" }} />
  ),
  home: (props: Icon) => <CentralHomeOpenFilledOffStroke2Radius2 {...props} />,
  account: (props: Icon) => <CentralPeopleFilledOffStroke2Radius2 {...props} />,
  close: (props: Icon) => <CentralCrossLargeFilledOffStroke2Radius2 {...props} />,
  list: (props: Icon) => <CentralSquareGridCircleFilledOnStroke2Radius2 {...props} />,
  bookmark: (props: Icon) => <CentralBookmarkFilledOffStroke2Radius2 {...props} />,
  bookmarkAdded: (props: Icon) => <CentralBookmarkCheckFilledOnStroke2Radius2 {...props} />,
  plus: (props: Icon) => <CentralPlusLargeFilledOffStroke2Radius2 {...props} />,
  delete: (props: Icon) => <CentralTrashCanFilledOffStroke2Radius2 {...props} />,
  check: (props: Icon) => <CentralCircleCheckFilledOnStroke2Radius2 {...props} />,
  edit: (props: Icon) => <CentralPencilLineFilledOffStroke2Radius2 {...props} />,
  google: (props: Icon) => <GoogleLogo {...props} />,
  // Icons species details
  maxLength: (props: Icon) => <CentralRulerFilledOffStroke2Radius2 {...props} />,
  depth: (props: Icon) => <CustomDepthIcon {...props} />,
  rarity: (props: Icon) => <CentralDiamondFilledOffStroke2Radius2 {...props} />,
  sociability: (props: Icon) => <CentralGroup2FilledOffStroke2Radius2 {...props} />,
  habitat: (props: Icon) => <CentralHomeOpenFilledOffStroke2Radius2 {...props} />,
  region: (props: Icon) => <CentralEarthFilledOffStroke2Radius2 {...props} />,
  warning: (props: Icon) => <CentralTriangleExclamationFilledOffStroke2Radius2 {...props} />,
}
