import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  // for each species in prisma species database
  // fetch the inaturalist id // https://api.inaturalist.org/v1/taxa/118947?locale=fr
  // and update the source_inaturalist table with the id and the new data

  const species = await prisma.species.findMany({
    include: {
      sources_inaturalist: true,
    },
  })

  const lenght = species.length
  let index = 0

  for (const s of species) {
    index++
    console.log(`processing ${index} / ${lenght}`)
    const inaturalistId = s.sources_inaturalist?.id

    if (inaturalistId) {
      console.log(`fetching inaturalist id ${inaturalistId}`)
      try {
        const taxaResponse = await fetch(`https://api.inaturalist.org/v1/taxa/${inaturalistId}?all_names=true`)
        const taxaJson = await taxaResponse.json()
        if (taxaJson.results.length === 0) throw new Error("no results")
        await prisma.source_inaturalist.update({
          where: {
            id: inaturalistId,
          },
          data: {
            taxa_api: taxaJson.results[0],
          },
        })
        console.log(`updated inaturalist id ${inaturalistId}`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`error fetching inaturalist id ${inaturalistId}`, error)
      }
    }
  }

  return new Response()
}
