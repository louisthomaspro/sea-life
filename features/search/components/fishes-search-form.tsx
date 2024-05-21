"use client"

import { useEffect, useRef, useState } from "react"
import { bodyShapes, caudalFinShapes, colors, patterns } from "@/constants/morphology"
import { regionsList } from "@/constants/regions_dict"
import { SearchResultsButton } from "@/features/search/components/search-results-drawer-content"
import { ColorCheckbox } from "@/features/search/components/ui/color-checkbox"
import { InputGroup } from "@/features/search/components/ui/form"
import { useDebouncedCallback } from "use-debounce"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

  const handleColors = (value: boolean, colorId: string) => {
    if (value) {
      setSelectedColors((prev) => [...prev, colorId])
    } else {
      setSelectedColors((prev) => prev.filter((id) => id !== colorId))
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
      console.log(data)
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
        <Select defaultValue="all" onValueChange={(value) => setSelectedPattern(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Any</SelectItem>
              {patterns.map((pattern, i) => (
                <SelectItem key={i} value={pattern.id}>
                  {pattern.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Caudal Fin</Label>
        <Select defaultValue="all" onValueChange={(value) => setSelectedCaudalFinShape(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Caudal Fin" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Any</SelectItem>
              {caudalFinShapes.map((caudalFinShape, i) => (
                <SelectItem key={i} value={caudalFinShape.id}>
                  {caudalFinShape.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Body Shape</Label>
        <Select defaultValue="all" onValueChange={(value) => setSelectedBodyShape(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a body shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Any</SelectItem>
              {bodyShapes.map((bodyShape, i) => (
                <SelectItem key={i} value={bodyShape.id}>
                  {bodyShape.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputGroup>
      <SearchResultsButton results={speciesResults} />
    </div>
  )
}
