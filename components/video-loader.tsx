"use client"

import React from "react"

import { cn } from "@/lib/utils"

// video html extend interface HtmlVideoElement
interface VideoLoaderProps extends React.ComponentPropsWithoutRef<"video"> {}

const VideoLoader = React.forwardRef<React.ElementRef<"video">, VideoLoaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <video
        className={cn("size-full rounded-[30px] opacity-0 transition-opacity", className)}
        onCanPlayThrough={(video) => video.currentTarget.classList.remove("opacity-0")}
        ref={ref}
        {...props}
      >
        {children}
      </video>
    )
  }
)
VideoLoader.displayName = "VideoLoader"

export default VideoLoader
