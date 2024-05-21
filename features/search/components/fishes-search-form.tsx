"use client"

import { useEffect, useRef, useState } from "react"
import { bodyShapes, caudalFinShapes, colors, patterns } from "@/constants/morphology"
import { regionsList } from "@/constants/regions_dict"
import { SearchResultsButton } from "@/features/search/components/search-results-drawer-content"
import { ColorCheckbox } from "@/features/search/components/ui/color-checkbox"
import { InputGroup } from "@/features/search/components/ui/form"
import { SimpleCheckbox } from "@/features/search/components/ui/simple-checkbox"
import { useDebouncedCallback } from "use-debounce"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons/icons"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchResult } from "@/app/api/search-advanced/route"

export default function FishesSearchForm() {
  const [isSearching, setIsSearching] = useState(false)
  const [speciesResults, setSpeciesResults] = useState<SearchResult[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedPattern, setSelectedPattern] = useState<string>("all")
  const [selectedCaudalFinShape, setSelectedCaudalFinShape] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedBodyShape, setSelectedBodyShape] = useState<string>("all")

  const controller = useRef<AbortController>()

  const handleColors = (value: boolean, selectedId: string) => {
    if (value) {
      setSelectedColors((prev) => [...prev, selectedId])
    } else {
      setSelectedColors((prev) => prev.filter((id) => id !== selectedId))
    }
  }

  const handlePattern = (value: boolean, id: string) => {
    if (value) {
      setSelectedPattern(id)
    } else {
      setSelectedPattern("all")
    }
  }

  const handleBodyShape = (value: boolean, id: string) => {
    if (value) {
      setSelectedBodyShape(id)
    } else {
      setSelectedBodyShape("all")
    }
  }

  const handleCaudalFin = (value: boolean, id: string) => {
    if (value) {
      setSelectedCaudalFinShape(id)
    } else {
      setSelectedCaudalFinShape("all")
    }
  }

  const handleSearch = useDebouncedCallback(async () => {
    setIsSearching(true)
    console.log(`Searching...`)

    controller.current?.abort()
    controller.current = new AbortController()

    try {
      const data = await fetch(`/api/search-advanced`, {
        method: "POST",
        signal: controller.current.signal,
        body: JSON.stringify({
          ...(selectedPattern !== "all" && { pattern: selectedPattern }),
          ...(selectedRegion !== "all" && { region: selectedRegion }),
          ...(selectedCaudalFinShape !== "all" && { caudal_fin_shape: selectedCaudalFinShape }),
          ...(selectedColors.length && { colors: selectedColors }),
          ...(selectedBodyShape !== "all" && { body_shape: selectedBodyShape }),
        }),
      }).then((res) => res.json())

      setSpeciesResults(data)
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err)
      }
    }
    setIsSearching(false)
  }, 150)

  useEffect(() => {
    handleSearch()
  }, [selectedColors, selectedCaudalFinShape, selectedRegion, selectedPattern, selectedBodyShape])

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <Label>Regions</Label>
        <Select defaultValue="all" onValueChange={(value) => setSelectedRegion(value)}>
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
        <div className="no-scrollbar flex overflow-auto">
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
        <div className="no-scrollbar flex overflow-auto">
          {patterns.map((pattern, i) => (
            <SimpleCheckbox
              key={i}
              pattern={pattern.id}
              checked={selectedPattern === pattern.id}
              onCheckedChange={(value) => handlePattern(!!value, pattern.id)}
              className="text-gray-500"
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1">
                {pattern.icon({ className: cn("size-12", selectedPattern === pattern.id && "text-background") })}
                <div className="text-xs font-medium">{pattern.label}</div>
              </div>
            </SimpleCheckbox>
          ))}
        </div>
      </InputGroup>

      <InputGroup>
        <Label>Body Shape</Label>
        <div className="no-scrollbar flex overflow-auto">
          {bodyShapes.map((bodyShape, i) => (
            <SimpleCheckbox
              key={i}
              pattern={bodyShape.id}
              checked={selectedBodyShape === bodyShape.id}
              onCheckedChange={(value) => handleBodyShape(!!value, bodyShape.id)}
              className="text-gray-500"
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1">
                {bodyShape.icon({ className: cn("size-12", selectedBodyShape === bodyShape.id && "text-background") })}
                <div className="text-xs font-medium">{bodyShape.label}</div>
              </div>
            </SimpleCheckbox>
          ))}
        </div>
      </InputGroup>

      <InputGroup>
        <Label>Caudal Fin</Label>
        <div className="no-scrollbar flex overflow-auto">
          {caudalFinShapes.map((caudalFin, i) => (
            <SimpleCheckbox
              key={i}
              pattern={caudalFin.id}
              checked={selectedCaudalFinShape === caudalFin.id}
              onCheckedChange={(value) => handleCaudalFin(!!value, caudalFin.id)}
              className="text-gray-500"
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1">
                {caudalFin.icon({
                  className: cn("size-12", selectedCaudalFinShape === caudalFin.id && "text-background"),
                })}
                <div className="text-xs font-medium">{caudalFin.label}</div>
              </div>
            </SimpleCheckbox>
          ))}
        </div>
      </InputGroup>

      <SearchResultsButton results={speciesResults} />
    </div>
  )
}
