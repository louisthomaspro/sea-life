"use client"

import { useRef, useState } from "react"
import { SearchResultsButton } from "@/features/search/components/search-results-drawer-content"
import { InputGroup } from "@/features/search/components/ui/form"
import { useDebouncedCallback } from "use-debounce"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SearchResult } from "@/app/api/search-advanced/route"

export default function AiSearchForm() {
  const [term, setTerm] = useState("")
  const [speciesResults, setSpeciesResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const controller = useRef<AbortController>()

  const handleSearch = useDebouncedCallback(async (term) => {
    setIsSearching(true)
    console.log(`Searching... ${term}`)

    controller.current?.abort()
    controller.current = new AbortController()

    if (!term) {
      setSpeciesResults([])
      setIsSearching(false)
      return
    }

    try {
      const data = await fetch(`/api/search-ai?term=${term}`, { signal: controller.current.signal }).then((res) =>
        res.json()
      )

      setSpeciesResults(data)
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err)
      }
    }
    setIsSearching(false)
  }, 150)

  return (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <Label>Description</Label>
        <Textarea
          placeholder="Yellow, with white stripes and a big tail."
          onChange={(e) => {
            setTerm(e.target.value)
            handleSearch(e.target.value)
          }}
        />
      </InputGroup>
      <SearchResultsButton results={speciesResults} />
    </div>
  )
}
