import { AttributeEnum } from "@prisma/client"

import { openai } from "@/lib/openai"
import prisma from "@/lib/prisma"

const colors = [
  "white",
  "brown",
  "yellow",
  "black",
  "blue",
  "orange",
  "dark-gray",
  "red",
  "green",
  "purple",
  "pink",
  "light-gray",
]
const patterns = [
  "blotches-or-dots",
  "vertical-marking",
  "horizontal-marking",
  "reticulations-pattern",
  "oblique-markings",
  "streaks-pattern",
  "banded-pattern",
  "grid-pattern",
  "chevrons-pattern",
  "camouflage-pattern",
  "tubercles-pattern",
  "spines-pattern",
  "barbels-pattern",
  "none",
]
const caudalFinShapes = ["rounded", "forked", "truncated", "pointed", "lunate"]
const bodyShapes = ["fusiform", "compressed", "elongated", "globelike", "anguilliform", "flat", "rectangular", "other"]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const attributes = [
    {
      id: AttributeEnum.colors,
      definition: `The colors of a species. Values: ["${colors.join(", ")}"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.patterns,
      definition: `The patterns of a species. Values: ["${patterns.join(", ")}"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.caudal_fin_shape,
      definition: `The shape of the caudal fin of a species. Values: ["${caudalFinShapes.join(", ")}"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.body_shape,
      definition: `The shape of the body of a species. Values: ["${bodyShapes.join(", ")}"]`,
      valueType: "string",
    },
  ]

  for (const attribute of attributes) {
    await prisma.attributeDefinition.upsert({
      where: { id: attribute.id as AttributeEnum },
      update: {
        definition: attribute.definition,
        valueType: attribute.valueType,
      },
      create: attribute,
    })
  }

  return new Response("Attribute definitions created", { status: 200 })

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
    take: 500,
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

    const description = await getMorphologicalAttributes(url)
    await prisma.taxa.update({
      where: {
        id: fish.id,
      },
      data: {
        attributes: {
          connectOrCreate: [
            {
              where: {
                taxaId_attributeDefinitionId: {
                  taxaId: fish.id,
                  attributeDefinitionId: AttributeEnum.colors,
                },
              },
              create: {
                value: description.colors.join(", "),
                attributeDefinition: {
                  connect: {
                    id: AttributeEnum.colors,
                  },
                },
              },
            },
          ],
        },
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

interface MorphologicalAttributes {
  colors: string[]
  patterns: string[]
  caudal_fin_shape: string
  body_shape: string
}

async function getMorphologicalAttributes(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            Analyze the provided images and return a JSON object containing the following details about the fish species present in the images:

            1. Colors: An array listing the colors of the fish. Be careful with the light and shadow.
            Use only the allowed colors: ${colors.join(", ")}.

            2. Patterns: An array listing the the patterns observed on the fish.
            Use only the allowed patterns: ${patterns.join(", ")}.

            3. Caudal Fin Shape: The shape of the caudal fin (tail fin) of the fish.
            Use only the allowed shapes: ${caudalFinShapes.join(", ")}. This field can be null if the caudal fin is not visible in the images.

            4. Body Shape: The shape of the body of the fish.
            Use only the allowed shapes: ${bodyShapes.join(", ")}.

            Ensure the response starts with the character "{" to produce valid JSON.

            Example of the expected JSON object:
            {
              "colors": ["red", "blue", "green"],
              "patterns": ["blotches-or-dots", "vertical-marking"],
              "caudal_fin_shape": "rounded",
              "body_shape": "elongated",
            }
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
  return JSON.parse(response.choices[0].message.content!) as MorphologicalAttributes
}
