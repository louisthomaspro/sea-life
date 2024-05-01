"use client"

import { useEffect, useMemo, useState } from "react"
import { Taxa } from "@prisma/client"
import { debounce } from "lodash"

import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

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
      <div className="relative flex grow items-center">
        <Input
          placeholder={"Species name, scientific name or description"}
          className="shadow-subtle h-[44px] w-full pl-11 font-semibold"
          value={searchValue}
          onChange={(event) => {
            debouncedChangeHandler(event.target.value)
            setSearchValue(event.target.value)
          }}
        />
        <span className="absolute left-4">
          <Icons.search className="h-4 w-4 text-black" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {speciesResults.map((species, i) => (
          <div key={i} className="flex flex-col border">
            <div>{species.scientificName}</div>
            <div>{species.commonNames.fr?.join(",")}</div>
            <div>{species.commonNames.en?.join(",")}</div>
            {/* <div>{species.similarity.toFixed(3)}</div> */}
          </div>
        ))}
      </div>
    </div>
  )
}
