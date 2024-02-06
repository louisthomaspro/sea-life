import firestoreBackup from "@/constants/firestore-backup.json"

import { getOrCreateTaxaById } from "@/lib/actions/taxa-actions"

export async function GET(request: Request) {
  let index = 0
  for (const species in firestoreBackup) {
    index++

    const speciesId = (firestoreBackup as any)[species].external_ids.inaturalist
    console.log(`processing ${index} / ${Object.keys(firestoreBackup).length}, id: ${speciesId}`)

    if (!speciesId) throw new Error("No species id")

    const res = await fetch(`http://localhost:3000/api/get-create-taxa/${speciesId}`)
    const data = await res.json()

    console.log(data.id)
  }

  return new Response()
}
