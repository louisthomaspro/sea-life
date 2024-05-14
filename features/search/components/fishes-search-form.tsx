"use client"

import { FormEventHandler, useEffect, useState } from "react"
import { regionsDict, regionsList } from "@/constants/regions_dict"
import { sociabilityList } from "@/constants/sociability_dict"
import { ColorCheckbox } from "@/features/search/components/ui/color-checkbox"
import { InputDescription, InputGroup } from "@/features/search/components/ui/form"
import { PatternCheckbox } from "@/features/search/components/ui/pattern-checkbox"

import { Icons } from "@/components/ui/icons/icons"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const colors = [
  { id: "red", hex: "#FF0000" },
  { id: "green", hex: "#00FF00" },
  { id: "blue", hex: "#0000FF" },
  { id: "yellow", hex: "#FFFF00" },
  { id: "purple", hex: "#800080" },
  { id: "orange", hex: "#FFA500" },
  { id: "black", hex: "#000000" },
  { id: "white", hex: "#FFFFFF" },
  { id: "gray", hex: "#808080" },
  { id: "brown", hex: "#A52A2A" },
  { id: "pink", hex: "#FFC0CB" },
  { id: "cyan", hex: "#00FFFF" },
]

const patterns = [
  { id: "blotches", name: "Blotches or dots" },
  { id: "stripes", name: "Stripes" },
  { id: "lines", name: "Lines" },
  { id: "spotted", name: "Spotted" },
  { id: "zigzag", name: "Zigzag" },
  { id: "solid", name: "Solid" },
  { id: "mottled", name: "Mottled" },
  { id: "banded", name: "Banded" },
  { id: "checkered", name: "Checkered" },
  { id: "speckled", name: "Speckled" },
  { id: "marbled", name: "Marbled" },
  { id: "brindle", name: "Brindle" },
  { id: "freckled", name: "Freckled" },
  { id: "splotched", name: "Splotched" },
  { id: "variegated", name: "Variegated" },
]

const caudalFinTypes = [
  { id: "lunate", name: "Lunate" },
  { id: "truncated", name: "Truncated" },
  { id: "emarginate", name: "Emarginate" },
  { id: "rounded", name: "Rounded" },
  { id: "forked", name: "Forked" },
  { id: "doubleForked", name: "Double forked" },
  { id: "concave", name: "Concave" },
  { id: "convex", name: "Convex" },
  { id: "emarginate", name: "Emarginate" },
  { id: "lunate", name: "Lunate" },
  { id: "truncated", name: "Truncated" },
  { id: "emarginate", name: "Emarginate" },
  { id: "rounded", name: "Rounded" },
  { id: "forked", name: "Forked" },
  { id: "doubleForked", name: "Double forked" },
  { id: "concave", name: "Concave" },
  { id: "convex", name: "Convex" },
]

export default function FishesSearchForm() {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])

  const handleColors = (value: boolean, colorId: string) => {
    if (value) {
      setSelectedColors((prev) => [...prev, colorId])
    } else {
      setSelectedColors((prev) => prev.filter((id) => id !== colorId))
    }
  }

  const handlePatterns = (value: boolean, patternId: string) => {
    if (value) {
      setSelectedPatterns((prev) => [...prev, patternId])
    } else {
      setSelectedPatterns((prev) => prev.filter((id) => id !== patternId))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <Label>Description</Label>
        <Textarea placeholder="Yellow, with white stripes and a big tail." />
      </InputGroup>
      <InputGroup>
        <Label>Regions</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {regionsList.map((region, i) => (
                <SelectItem key={i} value={region.id}>
                  {region.name.en}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Colors</Label>
        <div className="flex overflow-auto">
          {colors.map((color, i) => (
            <ColorCheckbox
              color={color.hex}
              defaultChecked={selectedColors.includes(color.id)}
              key={i}
              onCheckedChange={(value) => handleColors(!!value, color.id)}
            >
              <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: color.hex }} />
            </ColorCheckbox>
          ))}
        </div>
      </InputGroup>
      <InputGroup>
        <Label>Pattern</Label>
        <div className="flex overflow-auto">
          {patterns.map((pattern, i) => (
            <PatternCheckbox
              key={i}
              pattern={pattern.id}
              onCheckedChange={(value) => handlePatterns(!!value, pattern.id)}
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-2">
                <Icons.bookmark className="size-8" />
                <div className="text-xs font-medium">{pattern.name}</div>
              </div>
            </PatternCheckbox>
          ))}
        </div>
      </InputGroup>
      <InputGroup>
        <Label>Social behavior</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Select a social behavior" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Any</SelectItem>
              {sociabilityList.map((sociability, i) => (
                <SelectItem key={i} value={sociability.id}>
                  {sociability.name.en}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Caudal Fin</Label>
        <div className="flex overflow-auto">
          {caudalFinTypes.map((caudalFinType, i) => (
            <PatternCheckbox key={i} pattern={caudalFinType.id}>
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-2">
                <Icons.bookmark className="size-8" />
                <div className="text-xs font-medium">{caudalFinType.name}</div>
              </div>
            </PatternCheckbox>
          ))}
        </div>
      </InputGroup>
    </div>
  )
}
