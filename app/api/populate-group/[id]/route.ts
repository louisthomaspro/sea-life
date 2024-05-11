import { populateGroupById } from "@/lib/database/populate/populate-group-by-slug"
import { populateMediaById } from "@/lib/database/populate/populate-media-by-id"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const group = await populateGroupById(Number(params.id))

  return Response.json(group)
}
