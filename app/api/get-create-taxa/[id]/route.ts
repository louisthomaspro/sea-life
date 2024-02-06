import { getOrCreateTaxaById } from "@/lib/actions/taxa-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const taxa = await getOrCreateTaxaById(parseInt(params.id))

  return Response.json(taxa)
}
