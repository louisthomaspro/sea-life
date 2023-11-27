import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const species = await prisma.species.findMany({
    select: {
      id: true,
      sources_inaturalist: {
        select: {
          taxa_api: true,
        },
      },
    },
  })

  const lenght = species.length
  let index = 0

  for (const s of species) {
    index++
    console.log(`processing ${index} / ${lenght}`)

    const source_inaturalist = s?.sources_inaturalist?.taxa_api as any

    let scientificName = ""
    const commonNames: any = {}

    source_inaturalist.names.forEach((name: { name: string; locale: string; lexicon: string }) => {
      if (name.lexicon === "scientific-names") {
        scientificName = name.name
      } else {
        if (name.locale in commonNames) {
          commonNames[name.locale].push(name.name)
        } else {
          commonNames[name.locale] = [name.name]
        }
      }
    })

    await prisma.species.update({
      where: {
        id: s.id,
      },
      data: {
        scientific_name: scientificName,
        common_names: commonNames,
      },
    })

    console.log(`updated species ${s.id}`)
  }

  return new Response()
}
