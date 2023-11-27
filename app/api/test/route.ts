import { generateEmbedding } from "@/utils/actions"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const species = await prisma.species.findFirst({
    where: {
      scientific_name: {
        contains: "Coris julis",
        mode: "insensitive",
      },
    },
    include: {
      sources_inaturalist: true,
    },
  })

  if (!species) return new Response("no species found")

  const source_inaturalist = species?.sources_inaturalist?.taxa_api as any
  const content = source_inaturalist.names.map((name: any) => name.name).join(", ")
  const generatedEmbedding = await generateEmbedding(content)

  // Create embedding and content in  species_embedding table
  await prisma.species.update({
    where: {
      id: species.id,
    },
    data: {
      embedding_content: content,
    },
  })

  await prisma.$executeRaw`
        UPDATE species
        SET embedding = ${generatedEmbedding}::vector
        WHERE id = ${species.id}
    `

  console.log("species", species.id, "updated")

  return new Response()
}
