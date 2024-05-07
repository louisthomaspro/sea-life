"use client"

import React from "react"
import Image from "next/image"
import fallbackImage from "@/public/img/fallback.jpg"

import { awsLoader, cn } from "@/lib/utils"

interface ImageLoaderProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src"> {
  src: string | null | undefined
}

const ImageLoader = React.forwardRef<React.ElementRef<typeof Image>, ImageLoaderProps>(({ ...props }, ref) => {
  const [src, setSrc] = React.useState(props.src || fallbackImage)
  const [loaded, setLoaded] = React.useState(false)
  const [onError, setOnError] = React.useState(!!!props.src)

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      ref={ref}
      onLoad={(e: any) => {
        setLoaded(true)
      }}
      loader={awsLoader}
      className={cn(
        "bg-white", // for transparent images
        "opacity-0 transition-opacity", // for fadeIn
        loaded && "opacity-100",
        props.className,
        onError && "bg-gray-100 object-cover opacity-100"
      )}
      onError={(event) => {
        if (props.onError) props.onError(event)
        setOnError(true)
        setSrc(fallbackImage)
      }}
    />
  )
})
ImageLoader.displayName = "ImageLoader"

export default ImageLoader
