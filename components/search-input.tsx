"use client"

import { useEffect, useMemo, useState } from "react"
import { Taxa } from "@prisma/client"
import { debounce } from "lodash"

import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("")
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((value) => {
        fetch(`/api/search?q=${searchValue}`).then((res) => {
          res.json().then((data) => {
            console.log(data)
            setSpeciesResults(data)
          })
        })
      }, 150),
    []
  )

  const [speciesResults, setSpeciesResults] = useState<Taxa[]>([])

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel()
    }
  }, [debouncedChangeHandler])

  return (
    <div className="w-full max-w-md">
      <div className="relative flex items-center grow">
        <Input
          placeholder={"Species name, scientific name or description"}
          className="w-full pl-11 font-semibold shadow-subtle h-[44px]"
          value={searchValue}
          onChange={(event) => {
            debouncedChangeHandler(event.target.value)
            setSearchValue(event.target.value)
          }}
        />
        <span className="absolute left-4">
          <Icons.search className="w-4 h-4 text-black" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {speciesResults.map((species, i) => (
          <div key={i} className="flex flex-col border">
            <div>{species.scientificName}</div>
            <div>{(species.commonNames as any)?.["fr"]?.join(",")}</div>
            <div>{(species.commonNames as any)?.["en"]?.join(",")}</div>
            <div>{(species as any).similarity.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
