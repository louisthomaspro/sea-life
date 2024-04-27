import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
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
