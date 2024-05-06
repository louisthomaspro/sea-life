import { getOrCreateTaxaById } from "@/lib/database/populate/get-or-create-taxa-by-id"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const taxa = await getOrCreateTaxaById(Number(params.id))

  return Response.json(taxa)
}
