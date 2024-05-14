"use client"

import { useEffect } from "react"

import { Gradient } from "@/lib/gradient"

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLCanvasElement> {}

export default function BackgroundGradient(props: BackgroundGradientProps) {
  useEffect(() => {
    // Create your instance
    const gradient = new Gradient() as any

    // Call `initGradient` with the selector to your canvas
    gradient.initGradient("#gradient-canvas")
  })
  return <canvas id="gradient-canvas" data-transition-in {...props} />
}
