"use client"

import { useEffect, useState } from "react"
import { Species } from "@prisma/client"

import { searchSpecies } from "@/lib/actions/search-actions"
import useDebounce from "@/lib/hooks/use-debounce"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("")
  const debouncedSearch = useDebounce(searchValue, 150)

  const [speciesResults, setSpeciesResults] = useState<Species[]>([])

  useEffect(() => {
    if (searchValue) {
      fetch(`/api/search?q=${searchValue}`).then((res) => {
        res.json().then((data) => {
          console.log(data)
          setSpeciesResults(data)
        })
      })
    } else {
      setSpeciesResults([])
    }
  }, [debouncedSearch])

  return (
    <div className="w-full max-w-md">
      <div className="relative flex items-center grow">
        <Input
          placeholder={"Species name, scientific name or description"}
          className="w-full pl-11 font-semibold shadow-subtle h-[44px]"
          value={searchValue}
          onChange={(event) => {
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
            <div>{species.scientific_name}</div>
            <div>{(species.common_names as any)?.["fr"]?.join(",")}</div>
            <div>{(species.common_names as any)?.["en"]?.join(",")}</div>
            <div>{(species as any).similarity.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
