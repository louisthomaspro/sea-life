import { SVGProps } from "react"
import GoogleLogo from "@/public/svg/google-logo.svg"
import LogoWithText from "@/public/svg/logo-with-text.svg"
import Logo from "@/public/svg/logo.svg"

import { cn } from "@/lib/utils"
import {
  CentralArrowBoxLeftFilledOffStroke2Radius2,
  CentralAtFilledOffStroke2Radius2,
  CentralBarsThree2FilledOffStroke2Radius2,
  CentralBookmarkCheckFilledOnStroke2Radius2,
  CentralBookmarkFilledOffStroke2Radius2,
  CentralChevronLeftFilledOffStroke2Radius2,
  CentralCircleCheckFilledOnStroke2Radius2,
  CentralCrossLargeFilledOffStroke2Radius2,
  CentralDiamondFilledOffStroke2Radius2,
  CentralEarthFilledOffStroke2Radius2,
  CentralGroup2FilledOffStroke2Radius2,
  CentralHomeOpenFilledOffStroke2Radius2,
  CentralHomeRoundDoorFilledOnStroke2Radius2,
  CentralLoaderFilledOffStroke2Radius2,
  CentralMagnifyingGlassFilledOffStroke2Radius2,
  CentralMagnifyingGlassFilledOnStroke2Radius2,
  CentralPencilLineFilledOffStroke2Radius2,
  CentralPeopleFilledOffStroke2Radius2,
  CentralPeopleFilledOnStroke2Radius2,
  CentralPlusLargeFilledOffStroke2Radius2,
  CentralRulerFilledOffStroke2Radius2,
  CentralShareFilledOffStroke2Radius2,
  CentralSquareGridCircleFilledOnStroke2Radius2,
  CentralTrashCanFilledOffStroke2Radius2,
  CentralTriangleExclamationFilledOffStroke2Radius2,
  CustomDepthIcon,
} from "@/components/ui/icons/central-icons"
import {
  AnguilliformIcon,
  BandedPatternIcon,
  BarbelsPatternIcon,
  BlotchesOrDotsIcon,
  CamouflagePatternIcon,
  ChevronsPatternIcon,
  CompressedIcon,
  ElongatedIcon,
  FlatIcon,
  ForkedIcon,
  FusiformIcon,
  GlobelikeIcon,
  GridPatternIcon,
  HorizontalMarkingIcon,
  LunateIcon,
  ObliqueMarkingsIcon,
  OtherIcon,
  PointedIcon,
  ReticulationsPatternIcon,
  RoundedIcon,
  SpinesPatternIcon,
  StreaksPatternIcon,
  TruncatedIcon,
  TuberclesPatternIcon,
  VerticalMarkingIcon,
} from "@/components/ui/icons/search-icons"

type Icon = Partial<SVGProps<SVGSVGElement>>

export const Icons = {
  logo: (props: Icon) => <Logo {...props} />,
  logoWithText: (props: Icon) => <LogoWithText {...props} />,
  spinner: ({ className, ...props }: Icon) => (
    <CentralLoaderFilledOffStroke2Radius2 {...props} className={cn("animate-spin", className)} />
  ),
  search: (props: Icon) => <CentralMagnifyingGlassFilledOffStroke2Radius2 {...props} />,
  searchActive: (props: Icon) => <CentralMagnifyingGlassFilledOnStroke2Radius2 {...props} />,
  chevronLeft: (props: Icon) => <CentralChevronLeftFilledOffStroke2Radius2 {...props} />,
  chevronRight: (props: Icon) => (
    <CentralChevronLeftFilledOffStroke2Radius2 {...props} style={{ transform: "rotate(180deg)" }} />
  ),
  home: (props: Icon) => <CentralHomeOpenFilledOffStroke2Radius2 {...props} />,
  homeActive: (props: Icon) => <CentralHomeRoundDoorFilledOnStroke2Radius2 {...props} />,
  account: (props: Icon) => <CentralPeopleFilledOffStroke2Radius2 {...props} />,
  accountActive: (props: Icon) => <CentralPeopleFilledOnStroke2Radius2 {...props} />,
  close: (props: Icon) => <CentralCrossLargeFilledOffStroke2Radius2 {...props} />,
  list: (props: Icon) => <CentralSquareGridCircleFilledOnStroke2Radius2 {...props} />,
  bookmark: (props: Icon) => <CentralBookmarkFilledOffStroke2Radius2 {...props} />,
  bookmarkAdded: (props: Icon) => <CentralBookmarkCheckFilledOnStroke2Radius2 {...props} />,
  plus: (props: Icon) => <CentralPlusLargeFilledOffStroke2Radius2 {...props} />,
  delete: (props: Icon) => <CentralTrashCanFilledOffStroke2Radius2 {...props} />,
  check: (props: Icon) => <CentralCircleCheckFilledOnStroke2Radius2 {...props} />,
  edit: (props: Icon) => <CentralPencilLineFilledOffStroke2Radius2 {...props} />,
  google: (props: Icon) => <GoogleLogo {...props} />,
  at: (props: Icon) => <CentralAtFilledOffStroke2Radius2 {...props} />,
  bars: (props: Icon) => <CentralBarsThree2FilledOffStroke2Radius2 {...props} />,
  logout: (props: Icon) => <CentralArrowBoxLeftFilledOffStroke2Radius2 {...props} />,

  // Icons species details
  maxLength: (props: Icon) => <CentralRulerFilledOffStroke2Radius2 {...props} />,
  depth: (props: Icon) => <CustomDepthIcon {...props} />,
  rarity: (props: Icon) => <CentralDiamondFilledOffStroke2Radius2 {...props} />,
  sociability: (props: Icon) => <CentralGroup2FilledOffStroke2Radius2 {...props} />,
  habitat: (props: Icon) => <CentralHomeOpenFilledOffStroke2Radius2 {...props} />,
  region: (props: Icon) => <CentralEarthFilledOffStroke2Radius2 {...props} />,
  warning: (props: Icon) => <CentralTriangleExclamationFilledOffStroke2Radius2 {...props} />,
  share: (props: Icon) => <CentralShareFilledOffStroke2Radius2 {...props} />,

  // Search
  // Body Shapes
  fusiform: (props: Icon) => <FusiformIcon {...props} />,
  compressed: (props: Icon) => <CompressedIcon {...props} />,
  elongated: (props: Icon) => <ElongatedIcon {...props} />,
  globelike: (props: Icon) => <GlobelikeIcon {...props} />,
  anguilliform: (props: Icon) => <AnguilliformIcon {...props} />,
  flat: (props: Icon) => <FlatIcon {...props} />,
  rectangular: (props: Icon) => <CompressedIcon {...props} />,
  other: (props: Icon) => <OtherIcon {...props} />,

  // Caudal Fin Shapes
  rounded: (props: Icon) => <RoundedIcon {...props} />,
  forked: (props: Icon) => <ForkedIcon {...props} />,
  truncated: (props: Icon) => <TruncatedIcon {...props} />,
  pointed: (props: Icon) => <PointedIcon {...props} />,
  lunate: (props: Icon) => <LunateIcon {...props} />,

  // Patterns
  blotchesOrDots: (props: Icon) => <BlotchesOrDotsIcon {...props} />,
  verticalMarking: (props: Icon) => <VerticalMarkingIcon {...props} />,
  horizontalMarking: (props: Icon) => <HorizontalMarkingIcon {...props} />,
  reticulationsPattern: (props: Icon) => <ReticulationsPatternIcon {...props} />,
  obliqueMarkings: (props: Icon) => <ObliqueMarkingsIcon {...props} />,
  streaksPattern: (props: Icon) => <StreaksPatternIcon {...props} />,
  bandedPattern: (props: Icon) => <BandedPatternIcon {...props} />,
  gridPattern: (props: Icon) => <GridPatternIcon {...props} />,
  chevronsPattern: (props: Icon) => <ChevronsPatternIcon {...props} />,
  camouflagePattern: (props: Icon) => <CamouflagePatternIcon {...props} />,
  tuberclesPattern: (props: Icon) => <TuberclesPatternIcon {...props} />,
  spinesPattern: (props: Icon) => <SpinesPatternIcon {...props} />,
  barbelsPattern: (props: Icon) => <BarbelsPatternIcon {...props} />,
}
