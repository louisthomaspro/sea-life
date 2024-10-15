"use client"

import { bodyShapes, caudalFinShapes, colors, patterns } from "@/constants/morphology"
import { regionsList } from "@/constants/regions_dict"
import { ColorCheckbox } from "@/features/search/components/ui/color-checkbox"
import { InputGroup } from "@/features/search/components/ui/form"
import { SimpleCheckbox } from "@/features/search/components/ui/simple-checkbox"
import { SearchFilterEnum } from "@/features/search/enum"
import { useSearch } from "@/features/search/search-provider"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons/icons"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function FishesSearchForm() {
  const { setValue, filterState } = useSearch()

  const handleColors = (value: string[]) => {
    setValue(SearchFilterEnum.Colors, value)
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

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <Label>Regions</Label>
        <Select
          defaultValue={filterState.region ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setValue(SearchFilterEnum.Region, undefined)
            } else {
              setValue(SearchFilterEnum.Region, value)
            }
          }}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {regionsList.map((region, i) => (
                <SelectItem key={i} value={region.id} className="h-11">
                  {region.name.en}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputGroup>

      <InputGroup>
        <Label>Colors</Label>
        <ToggleGroup
          type="multiple"
          value={filterState.colors ?? []}
          onValueChange={handleColors}
          className="flex flex-wrap justify-start gap-3"
        >
          {colors.map((color) => (
            <ToggleGroupItem
              key={color.id}
              value={color.id}
              className="group relative h-10 w-10 rounded-md border border-black/30 bg-origin-border p-0 shadow-sm focus:outline-none"
              style={{ backgroundColor: color.hex }}
              aria-label={color.id}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{
                  scale: filterState.colors?.includes(color.id) ? 1 : 0.8,
                  opacity: filterState.colors?.includes(color.id) ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icons.check className="size-4" />
              </motion.div>
              <span className="sr-only">{color.id}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
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
