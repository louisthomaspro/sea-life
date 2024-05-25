import { SearchFilterEnum } from "@/features/search/enum"

export type IFilterState = {
  [SearchFilterEnum.Colors]?: string[]
  [SearchFilterEnum.Pattern]?: string
  [SearchFilterEnum.Region]?: string
  [SearchFilterEnum.CaudalFinShape]?: string
  [SearchFilterEnum.BodyShape]?: string
}
