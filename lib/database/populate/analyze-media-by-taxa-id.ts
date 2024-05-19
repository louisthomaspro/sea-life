import { AttributeEnum } from "@prisma/client"

import { openai } from "@/lib/openai"
import prisma from "@/lib/prisma"

import "server-cli-only"

import { z } from "zod"

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

export const analyzeMediaByTaxaId = async (id: number) => {
  const taxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: true,
      attributes: {
        include: {
          attributeDefinition: true,
        },
      },
    },
    where: {
      id: id,
    },
  })

  if (!taxaData) {
    throw new Error(`No taxa found for id ${id}`)
  }

  if (!taxaData.medias || !taxaData.medias[0]) {
    console.log(`No media found for taxa ${id}`)
    throw new Error(`No media found for taxa ${id}`)
  }

  console.log(`Analyze taxa ${id} - ${taxaData.medias[0].url}`)

  // Check if data already exists
  const existingAttributes = taxaData.attributes.map((a) => a.attributeDefinitionId)

  const existingColors = existingAttributes.filter((a) => colors.includes(a))
  const existingPatterns = existingAttributes.filter((a) => patterns.includes(a))
  const existingCaudalFinShapes = existingAttributes.filter((a) => caudalFinShapes.includes(a))
  const existingBodyShapes = existingAttributes.filter((a) => bodyShapes.includes(a))

  if (
    existingColors.length === colors.length &&
    existingPatterns.length === patterns.length &&
    existingCaudalFinShapes.length === caudalFinShapes.length &&
    existingBodyShapes.length === bodyShapes.length
  ) {
    console.log(`All attributes already exist for taxa ${id}`)
    return
  }

  // Otherwise, re-populate attributes
  const results = await getMorphologicalAttributes(taxaData.medias[0].url)

  // Save in database
  await prisma.taxa.update({
    where: {
      id: id,
    },
    data: {
      attributes: {
        connectOrCreate: [
          {
            create: {
              attributeDefinitionId: AttributeEnum.colors,
              value: results.colors,
            },
            where: {
              taxaId_attributeDefinitionId: {
                attributeDefinitionId: AttributeEnum.colors,
                taxaId: id,
              },
            },
          },
        ],
      },
    },
  })
}

interface MorphologicalAttributes {
  colors: string[]
  patterns: string[]
  caudal_fin_shape: string
  body_shape: string
  description: string
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

            5. Description: Describe the fish in around 20 words using simple words and short sentence for each detail.
            Include details like color, patterns, and other distinctive features. Specify the location of these features.
            Avoid subjective or interpretive comments about the fish's appearance, the image or the background.

            Ensure the response starts with the character "{" to produce valid JSON.

            Example of the expected JSON object:
            {
              "colors": ["red", "blue", "green"],
              "patterns": ["blotches-or-dots", "vertical-marking"],
              "caudal_fin_shape": "rounded",
              "body_shape": "elongated",
              "description": "The fish has a red body with blue vertical stripes."
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

  // Validate with zod
  const schema = z.object({
    colors: z.array(z.enum(colors as [string, ...string[]])),
    patterns: z.array(z.enum(patterns as [string, ...string[]])),
    caudal_fin_shape: z.enum(caudalFinShapes as [string, ...string[]]),
    body_shape: z.enum(bodyShapes as [string, ...string[]]),
    description: z.string(),
  })

  const result = JSON.parse(response.choices[0].message.content!)
  console.log(result)
  schema.parse(result)

  return result as MorphologicalAttributes
}
