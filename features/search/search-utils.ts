import { SearchFilterEnum } from "@/features/search/enum"
import { IFilterState } from "@/features/search/types"

export const parseUrl = (searchParams: URLSearchParams) => {
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
