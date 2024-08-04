"use client"

import React from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"
import fallbackImage from "@/public/img/fallback.jpg"

import { awsLoader, cn } from "@/lib/utils"

interface ImageLoaderProps extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src"> {
  src: string | StaticImport | null | undefined
  blurhashDataURL?: string | null | undefined
}

const ImageLoader = React.forwardRef<React.ElementRef<typeof Image>, ImageLoaderProps>(
  ({ blurhashDataURL, className, ...props }, ref) => {
    const [src, setSrc] = React.useState(props.src || fallbackImage)
    const [onError, setOnError] = React.useState(!!!props.src)

    return (
      <div className="relative size-full">
        {blurhashDataURL && (
          <Image {...props} className={cn("absolute", className)} src={blurhashDataURL} alt={props.alt} ref={ref} />
        )}
        <Image
          {...props}
          src={src}
          alt={props.alt}
          ref={ref}
          onLoad={(image) => image.currentTarget.classList.remove("opacity-0")}
          loader={awsLoader}
          className={cn(
            "bg-white", // for transparent images
            "absolute opacity-0 transition-opacity", // for fadeIn
            className,
            onError && "bg-gray-100 object-cover opacity-100"
          )}
          onError={(event) => {
            if (props.onError) props.onError(event)
            setOnError(true)
            setSrc(fallbackImage)
          }}
        />
      </div>
    )
  }
)
ImageLoader.displayName = "ImageLoader"

export default ImageLoader
