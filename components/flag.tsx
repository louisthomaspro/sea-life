import Image from "next/image"

import { cn } from "@/lib/utils"

function getFlagSvg(code: string) {
  let parsedCode = code
  if (code.toLocaleUpperCase() === "UK") parsedCode = "GB"
  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${parsedCode.toUpperCase()}.svg`
}

interface FlagProps {
  countryCode: string
  width?: number
  height?: number
  className?: string
}

export const Flag = ({ countryCode, width = 20, height = 13, className }: FlagProps) => {
  return (
    <div style={{ width, height }} className={cn("relative overflow-hidden rounded", className)}>
      <Image src={getFlagSvg(countryCode)} alt={countryCode} fill unoptimized />
    </div>
  )
}
