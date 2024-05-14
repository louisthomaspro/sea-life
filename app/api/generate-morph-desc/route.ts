import { openai } from "@/lib/openai"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const fishes = await prisma.taxa.findMany({
    where: {
      morphologicalDescription: null,
      rank: "species",
      ancestors: {
        some: {
          id: 47178, // actinopterygii
        },
      },
    },
    select: {
      id: true,
      medias: {
        select: {
          url: true,
        },
      },
    },
  })

  let i = 1
  for (const fish of fishes) {
    console.log(`Processing fish ${i++} / ${fishes.length} - ${fish.id}`)
    const url = fish.medias[0].url
    console.log(`URL: ${url}`)

    if (!url) {
      console.log(`No image for fish ${fish.id}`)
      continue
    }

    const description = await getMorphologicalDescription(url)
    await prisma.taxa.update({
      where: {
        id: fish.id,
      },
      data: {
        morphologicalDescription: description,
      },
    })
  }

  const fishesWithDescription = await prisma.taxa.findMany({
    where: {
      morphologicalDescription: {
        not: null,
      },
    },
    select: {
      id: true,
    },
  })

  const fishesCount = await prisma.taxa.count({
    where: {
      rank: "species",
      ancestors: {
        some: {
          id: 47178, // actinopterygii
        },
      },
    },
  })

  console.log(`Fishes processed: ${fishesWithDescription.length} / ${fishesCount}`)

  return new Response("Description generation finished", { status: 200 })
}

async function getMorphologicalDescription(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: {
      type: "text",
    },
    logit_bias: {
      63: -100,
      14196: -100,
      74694: -100,
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            Describe the fish in around 20 words using simple words and short sentence for each detail.
            Include details like color, patterns, and other distinctive features. Specify the location of these features.
            Avoid subjective or interpretive comments about the fish's appearance, the image or the background.
          `,
          },
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
  })
  return response.choices[0].message.content
}
