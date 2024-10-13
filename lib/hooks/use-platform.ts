import { useEffect, useState } from "react"

type Platform = "android" | "ios" | "macos" | "windows" | "unknown" | undefined

export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>()

  useEffect(() => {
    const detectPlatform = (): Platform => {
      const userAgent = window.navigator.userAgent.toLowerCase()

      if (/android/i.test(userAgent)) return "android"
      if (
        (/ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream) ||
        (userAgent.includes("mac") && "ontouchend" in document)
      )
        return "ios"
      if (/mac/i.test(userAgent)) return "macos"
      if (/win/i.test(userAgent)) return "windows"

      return "unknown"
    }

    setPlatform(detectPlatform())
  }, [])

  return platform
}
