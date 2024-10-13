import { populateGroupById } from "@/lib/database/populate/populate-group-by-slug"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const group = await populateGroupById(Number(params.id))

  return Response.json(group)
}
