import { Icons } from "@/components/ui/icons/icons"

export const colors = [
  { id: "white", hex: "#FFFFFF" },
  { id: "brown", hex: "#634239" },
  { id: "yellow", hex: "#F7EC5F" },
  { id: "black", hex: "#000000" },
  { id: "blue", hex: "#1454FE" },
  { id: "orange", hex: "#FF9700" },
  { id: "dark-gray", hex: "#44596E" },
  { id: "red", hex: "#F90D1B" },
  { id: "green", hex: "#3FA400" },
  { id: "purple", hex: "#BA05F2" },
  { id: "pink", hex: "#FF50C9" },
  { id: "light-gray", hex: "#8293A7" },
  { id: "transparent", hex: "#000000" },
]

export const patterns = [
  { id: "blotches-or-dots", label: "Blotches or dots", icon: (props: any) => <Icons.blotchesOrDots {...props} /> },
  { id: "vertical-marking", label: "Vertical marking", icon: (props: any) => <Icons.verticalMarking {...props} /> },
  {
    id: "horizontal-marking",
    label: "Horizontal marking",
    icon: (props: any) => <Icons.horizontalMarking {...props} />,
  },
  {
    id: "reticulations-pattern",
    label: "Reticulations pattern",
    icon: (props: any) => <Icons.reticulationsPattern {...props} />,
  },
  { id: "oblique-markings", label: "Oblique markings", icon: (props: any) => <Icons.obliqueMarkings {...props} /> },
  { id: "streaks-pattern", label: "Streaks pattern", icon: (props: any) => <Icons.streaksPattern {...props} /> },
  { id: "banded-pattern", label: "Banded pattern", icon: (props: any) => <Icons.bandedPattern {...props} /> },
  { id: "grid-pattern", label: "Grid pattern", icon: (props: any) => <Icons.gridPattern {...props} /> },
  { id: "chevrons-pattern", label: "Chevrons pattern", icon: (props: any) => <Icons.chevronsPattern {...props} /> },
  {
    id: "camouflage-pattern",
    label: "Camouflage pattern",
    icon: (props: any) => <Icons.camouflagePattern {...props} />,
  },
  { id: "tubercles-pattern", label: "Tubercles pattern", icon: (props: any) => <Icons.tuberclesPattern {...props} /> },
  { id: "spines-pattern", label: "Spines pattern", icon: (props: any) => <Icons.spinesPattern {...props} /> },
  { id: "barbels-pattern", label: "Barbels pattern", icon: (props: any) => <Icons.barbelsPattern {...props} /> },
]

export const caudalFinShapes = [
  { id: "rounded", label: "Rounded", icon: (props: any) => <Icons.rounded {...props} /> },
  { id: "forked", label: "Forked", icon: (props: any) => <Icons.forked {...props} /> },
  { id: "truncated", label: "Truncated", icon: (props: any) => <Icons.truncated {...props} /> },
  { id: "pointed", label: "Pointed", icon: (props: any) => <Icons.pointed {...props} /> },
  { id: "lunate", label: "Lunate", icon: (props: any) => <Icons.lunate {...props} /> },
]

export const bodyShapes = [
  { id: "fusiform", label: "Fusiform", icon: (props: any) => <Icons.fusiform {...props} /> },
  { id: "compressed", label: "Compressed", icon: (props: any) => <Icons.compressed {...props} /> },
  { id: "elongated", label: "Elongated", icon: (props: any) => <Icons.elongated {...props} /> },
  { id: "globelike", label: "Globelike", icon: (props: any) => <Icons.globelike {...props} /> },
  { id: "anguilliform", label: "Anguilliform", icon: (props: any) => <Icons.anguilliform {...props} /> },
  { id: "flat", label: "Flat", icon: (props: any) => <Icons.flat {...props} /> },
  { id: "rectangular", label: "Rectangular", icon: (props: any) => <Icons.compressed {...props} /> },
  { id: "other", label: "Other", icon: (props: any) => <Icons.other {...props} /> },
]
