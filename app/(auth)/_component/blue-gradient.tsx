"use client"

import "./blue-gradient.css"

import { useEffect } from "react"

import { Gradient } from "./Gradient"

const gradient = new Gradient()

export function BlueGradient() {
  useEffect(() => {
    ;(gradient as any).initGradient("#gradient-canvas")
  }, [])

  return <canvas id="gradient-canvas" data-transition-in />
}
