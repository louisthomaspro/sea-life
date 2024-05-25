"use client"

import { useEffect, useRef } from "react"
import { bodyShapes, caudalFinShapes, colors, patterns } from "@/constants/morphology"
import { regionsList } from "@/constants/regions_dict"
import { ColorCheckbox } from "@/features/search/components/ui/color-checkbox"
import { InputGroup } from "@/features/search/components/ui/form"
import { SimpleCheckbox } from "@/features/search/components/ui/simple-checkbox"
import { SearchFilterEnum } from "@/features/search/enum"
import { useSearch } from "@/features/search/search-provider"
import { useDebouncedCallback } from "use-debounce"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FishesSearchForm() {
  const { setValue, filterState, setIsSearching: setIsLoading } = useSearch()

  const controller = useRef<AbortController>()

  const handleColors = (value: boolean, selectedId: string) => {
    if (value) {
      setValue(SearchFilterEnum.Colors, [...(filterState.colors ?? []), selectedId])
    } else {
      setValue(
        SearchFilterEnum.Colors,
        (filterState.colors ?? []).filter((id) => id !== selectedId)
      )
    }
  }

  const handlePattern = (value: boolean, id: string) => {
    if (value) {
      setValue(SearchFilterEnum.Pattern, id)
    } else {
      setValue(SearchFilterEnum.Pattern, undefined)
    }
  }

  const handleBodyShape = (value: boolean, id: string) => {
    if (value) {
      setValue(SearchFilterEnum.BodyShape, id)
    } else {
      setValue(SearchFilterEnum.BodyShape, undefined)
    }
  }

  const handleCaudalFin = (value: boolean, id: string) => {
    if (value) {
      setValue(SearchFilterEnum.CaudalFinShape, id)
    } else {
      setValue(SearchFilterEnum.CaudalFinShape, undefined)
    }
  }

  const handleSearch = useDebouncedCallback(async () => {
    setIsLoading(true)
    console.log(`Searching...`)

    controller.current?.abort()
    controller.current = new AbortController()

    // try {
    //   const data = await fetch(`/api/search-advanced`, {
    //     method: "POST",
    //     signal: controller.current.signal,
    //     body: JSON.stringify({
    //   }).then((res) => res.json())

    //   setSpeciesResults(data)
    // } catch (err) {
    //   if (err instanceof Error && err.name !== "AbortError") {
    //     console.error(err)
    //   }
    // }
    // setIsSearching(false)
  }, 150)

  useEffect(() => {
    handleSearch()
  }, [filterState])

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <Label>Regions</Label>
        <Select
          defaultValue={filterState[SearchFilterEnum.Region] ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setValue(SearchFilterEnum.Region, undefined)
            } else {
              setValue(SearchFilterEnum.Region, value)
            }
          }}
        >
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
              defaultChecked={filterState.colors?.includes(color.id)}
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
              checked={filterState.pattern === pattern.id}
              onCheckedChange={(value) => handlePattern(!!value, pattern.id)}
              className="text-gray-500"
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1">
                {pattern.icon({ className: cn("size-12", filterState.pattern === pattern.id && "text-background") })}
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
              checked={filterState.body_shape === bodyShape.id}
              onCheckedChange={(value) => handleBodyShape(!!value, bodyShape.id)}
              className="text-gray-500"
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1">
                {bodyShape.icon({
                  className: cn("size-12", filterState.body_shape === bodyShape.id && "text-background"),
                })}
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
              checked={filterState.caudal_fin_shape === caudalFin.id}
              onCheckedChange={(value) => handleCaudalFin(!!value, caudalFin.id)}
              className="text-gray-500"
            >
              <div className="flex h-20 w-28 flex-col items-center justify-center gap-1">
                {caudalFin.icon({
                  className: cn("size-12", filterState.caudal_fin_shape === caudalFin.id && "text-background"),
                })}
                <div className="text-xs font-medium">{caudalFin.label}</div>
              </div>
            </SimpleCheckbox>
          ))}
        </div>
      </InputGroup>
    </div>
  )
}
