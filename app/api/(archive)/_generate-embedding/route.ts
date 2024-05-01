import { generateEmbedding } from "@/lib/_actions/search-actions"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  // const taxa = await prisma.taxa.findMany({
  //   include: {

  //   },
  // })

  // const lenght = speciesArray.length
  // let index = 0

  // // Assuming each document is a string
  // for (const species of speciesArray) {
  //   index++
  //   console.log(`processing ${index} / ${lenght}`)

  //   const source_inaturalist = species?.sources_inaturalist?.taxa_api as any
  //   const content = source_inaturalist.names.map((name: any) => name.name).join(" ")
  //   const generatedEmbedding = await generateEmbedding(content)

  //   await new Promise((r) => setTimeout(r, 500)) // Wait 500ms between requests;

  //   // Create embedding and content in  species_embedding table
  //   await prisma.taxa.update({
  //     where: {
  //       id: species.id,
  //     },
  //     data: {
  //       embedding_content: content,
  //     },
  //   })

  //   await prisma.$executeRaw`
  //       UPDATE species
  //       SET embedding = ${generatedEmbedding}::vector
  //       WHERE id = ${species.id}
  //   `

  //   console.log("species", species.id, "updated")
  // }

  return new Response()
}
