import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Capitalize words by splitting the string into words and capitalizing the first letter of each word. and the other letter should be smallcase!
export function capitalizeWords(str: string): string {
  if (!str) return str
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export const awsLoader = ({ src, width, quality }: { src: string; width?: number; quality?: number }) => {
  return `${rewriteDomain(src, process.env.NEXT_PUBLIC_AWS_IMG_CDN)}?format=auto&quality=${quality || 75}&width=${width}`
}

export const rewriteDomain = (url: string, newDomain: string | null | undefined) => {
  if (!newDomain) {
    console.warn("rewriteDomainUrl: newDomain is not defined")
    return url
  }
  return url.replace(/(https?:\/\/)(.*?)(\/.*)/, `${newDomain}$3`)
}

export const buildUrl = (url: string, params: Record<string, string>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value)
  })
  return `${url}?${searchParams.toString()}`
}
