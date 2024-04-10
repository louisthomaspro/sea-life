import { populateMediaById } from "@/lib/database/populate/populate-media-by-id"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const taxa = await populateMediaById(parseInt(params.id))

  return Response.json(taxa)
}
