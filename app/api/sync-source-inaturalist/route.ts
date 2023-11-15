import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import prisma from "@/lib/prisma"

initializeApp()
const db = getFirestore()

export async function GET(request: Request) {
  const snapshots = await db.collection("species").get()

  // update and do by batch of 50 records
  for (const doc of snapshots.docs) {
    const species = doc.data()
    const inaturalistId = species.external_ids.inaturalist
    console.log("Creating species", inaturalistId)
    await prisma.species.create({
      data: {
        sources_inaturalist: {
          create: {
            id: parseInt(inaturalistId),
          },
        },
      },
    })
  }

  return new Response()

  // // if the species has an inaturalist id, check if it exists in the inaturalist database
  // if (inaturalistId) {
  //   const inaturalistSpecies = await prisma.species.findUnique({
  //     where: {
  //       id: inaturalistId,
  //     },
  //   })

  //   // if the species exists in the inaturalist database, check if the name has changed
  //   if (inaturalistSpecies) {
  //     const inaturalistSpeciesName = inaturalistSpecies.name

  //     // if the name has changed, update the name in the database
  //     if (speciesName !== inaturalistSpeciesName) {
  //       await prisma.species.update({
  //         where: {
  //           id: speciesId,
  //         },
  //         data: {
  //           name: inaturalistSpeciesName,
  //         },
  //       })
  //     }
  // }
  // }
}
