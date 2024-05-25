"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SearchFilterEnum } from "@/features/search/enum"
import { useDebouncedCallback } from "use-debounce"

type FilterValue<K extends SearchFilterEnum> = IFilterState[K]

interface ISearchContext {
  isSearching: boolean
  filterState: IFilterState
  results: any[]

  setResults: (results: any[]) => void
  setIsSearching: (value: boolean) => void
  setValue: <K extends SearchFilterEnum>(key: K, value: FilterValue<K>) => void
  setValues: (values: IFilterState) => void
  resetState: () => void
}

const SearchContext = createContext({} as ISearchContext)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return useContext(SearchContext)
}

export type IFilterState = {
  [SearchFilterEnum.Colors]?: string[]
  [SearchFilterEnum.Pattern]?: string
  [SearchFilterEnum.Region]?: string
  [SearchFilterEnum.CaudalFinShape]?: string
  [SearchFilterEnum.BodyShape]?: string
}

const parseUrl = (searchParams: URLSearchParams) => {
  const state: IFilterState = {}

  for (const key of Object.values(SearchFilterEnum)) {
    const value = searchParams.get(key)
    if (value) {
      if (key === SearchFilterEnum.Colors) {
        state[key] = value.split(",")
      } else {
        state[key] = value
      }
    }
  }
  return state
}

function SearchProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const [isSearching, setIsSearching] = useState(false)
  const [filterState, setFilterState] = useState<IFilterState>(parseUrl(searchParams))
  const [results, setResults] = useState<any[]>([])

  const controller = useRef<AbortController>()

  useEffect(() => {
    setIsSearching(true)
    handleSearch()
  }, [filterState])

  const handleSearch = useDebouncedCallback(async () => {
    setIsSearching(true)

    controller.current?.abort()
    controller.current = new AbortController()

    try {
      const data = await fetch(`/api/search-advanced`, {
        method: "POST",
        signal: controller.current.signal,
        body: JSON.stringify(filterState),
      }).then((res) => res.json())

      setResults(data)
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err)
      }
    }
    setIsSearching(false)
  }, 150)

  const updateUrl = (newState: IFilterState) => {
    // 1. Serialize: Create params from filter state
    const params = new URLSearchParams(searchParams)
    for (const key of Object.values(SearchFilterEnum)) {
      // if key exists, set, else delete
      const value = newState[key]
      if (value) {
        if (isArrayOfString(value)) {
          params.set(key, value.join(","))
        }
        if (typeof value === "string") {
          params.set(key, value)
        }
      } else {
        params.delete(key)
      }
    }

    // 2. Update url (window.history.replaceState avoids triggering useSearchParams hook)
    window.history.replaceState(null, "", `?${params.toString()}`)
  }

  type FilterValue<K extends SearchFilterEnum> = IFilterState[K]
  const setValue = <K extends SearchFilterEnum>(key: K, value: FilterValue<K>) => {
    // 1. update filter state (remove key if value is empty)
    let newState: any = {}
    if (typeof value === "string" || (Array.isArray(value) && value.length > 0)) {
      newState = { ...filterState, [key]: value }
    } else {
      const { [key]: _, ...rest } = filterState
      newState = rest
    }
    console.log(newState)
    setFilterState(newState)
    updateUrl(newState)
  }

  const setValues = (newValues: IFilterState) => {
    // 1. Remove empty values
    Object.keys(newValues).forEach((key) => {
      if (!newValues[key as SearchFilterEnum]) {
        delete newValues[key as SearchFilterEnum]
      }
    })

    // 2. update filter state
    setFilterState(newValues)
    updateUrl(newValues)
  }

  const resetState = () => {
    setValues({})
  }

  return (
    <SearchContext.Provider
      value={{
        results,
        isSearching,
        filterState,
        setResults,
        setIsSearching,
        setValue,
        setValues,
        resetState,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

function isArrayOfString(value: any): value is string[] {
  return Array.isArray(value) && value.every((element) => typeof element === "string")
}

export default SearchProvider
