import { analyzeMediaByTaxaId } from "@/lib/database/populate/analyze-media-by-taxa-id"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await analyzeMediaByTaxaId(Number(params.id))

  return Response.json({
    success: true,
  })
}
