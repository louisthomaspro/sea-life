import backup from "@/backups/firestore-backup-species.json"

import { getOrCreateTaxaById } from "@/lib/database/populate/get-or-create-taxa-by-id"

export async function GET(request: Request) {
  let index = 0
  for (const taxa in backup) {
    console.log(`Index: ${index++}/${Object.keys(backup).length}`)
    const id = (backup as any)[taxa].external_ids.inaturalist
    const newTaxa = await getOrCreateTaxaById(Number(id))
  }

  return Response.json({ message: "ok" })
}
