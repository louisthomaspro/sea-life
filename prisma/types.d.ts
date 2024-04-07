import type { Taxa as PrismaTaxa } from "@prisma/client"

type CommonNames = {
  [key: string]: string[]
}

export interface Taxa extends PrismaTaxa {
  commonNames: CommonNames
}
