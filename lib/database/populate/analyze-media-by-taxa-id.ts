import { AttributeEnum } from "@prisma/client"

import { openai } from "@/lib/openai"
import prisma from "@/lib/prisma"

import "server-cli-only"

import { bodyShapes, caudalFinShapes, colors, patterns } from "@/constants/morphology"
import { z } from "zod"

export const analyzeMediaByTaxaId = async (id: number) => {
  const taxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: true,
      morphologicalDescription: true,
      attributes: true,
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
    return
  }

  console.log(`Analyze taxa ${id} - ${taxaData.medias[0].url}`)

  // Check if data already exists
  if (
    taxaData.attributes.find((attribute) => attribute.attributeDefinitionId === AttributeEnum.colors) &&
    taxaData.attributes.find((attribute) => attribute.attributeDefinitionId === AttributeEnum.patterns) &&
    taxaData.attributes.find((attribute) => attribute.attributeDefinitionId === AttributeEnum.caudal_fin_shape) &&
    taxaData.attributes.find((attribute) => attribute.attributeDefinitionId === AttributeEnum.body_shape) &&
    taxaData.morphologicalDescription
  ) {
    console.log(`All attributes already exist for taxa ${id}`)
    return
  }

  // Otherwise, re-populate attributes
  let results: MorphologicalAttributes | undefined
  let retryCount = 0
  const maxRetries = 3

  while (!results && retryCount < maxRetries) {
    try {
      results = await getMorphologicalAttributes(taxaData.medias[0].url)
    } catch (e) {
      console.error(`Error analyzing taxa ${id}`, e)
      retryCount++
    }
  }

  if (!results) {
    console.error(`Failed to analyze taxa ${id} after ${maxRetries} retries`)
    return
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: results.description,
    encoding_format: "float",
  })

  const [{ embedding }] = embeddingResponse.data

  // Update embedding in database
  await prisma.$executeRaw`
    UPDATE "Taxa"
    SET "embeddingMorphologicalDescription" = ${JSON.stringify(embedding)}::vector
    WHERE "id" = ${id}
      `

  // Save in database
  await prisma.taxa.update({
    where: {
      id: id,
    },
    data: {
      morphologicalDescription: results.description,
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
          {
            create: {
              attributeDefinitionId: AttributeEnum.patterns,
              value: results.patterns,
            },
            where: {
              taxaId_attributeDefinitionId: {
                attributeDefinitionId: AttributeEnum.patterns,
                taxaId: id,
              },
            },
          },
          {
            create: {
              attributeDefinitionId: AttributeEnum.caudal_fin_shape,
              value: results.caudal_fin_shape,
            },
            where: {
              taxaId_attributeDefinitionId: {
                attributeDefinitionId: AttributeEnum.caudal_fin_shape,
                taxaId: id,
              },
            },
          },
          {
            create: {
              attributeDefinitionId: AttributeEnum.body_shape,
              value: results.body_shape,
            },
            where: {
              taxaId_attributeDefinitionId: {
                attributeDefinitionId: AttributeEnum.body_shape,
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
  const jsonSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Fish Species Analysis",
    type: "object",
    properties: {
      colors: {
        type: "array",
        items: {
          type: "string",
          enum: colors.map((color) => color.id),
        },
        description: "An array listing the colors of the fish.",
      },
      patterns: {
        type: "array",
        items: {
          type: "string",
          enum: patterns.map((pattern) => pattern.id),
        },
        description: "An array listing the patterns observed on the fish.",
      },
      caudal_fin_shape: {
        type: "string",
        enum: caudalFinShapes.map((shape) => shape.id),
        description: "The shape of the caudal fin (tail fin) of the fish. Set to 'null' if you cannot determine.",
      },
      body_shape: {
        type: "string",
        enum: bodyShapes.map((shape) => shape.id),
        description: "The shape of the body of the fish.",
      },
      description: {
        type: "string",
        maxLength: 200,
        description:
          "Describe the fish's distinctively observed features in maximum 20 words. Use simple words and short sentences. Specify the location of these features. Avoid subjective or interpretive comments.",
      },
    },
    required: ["colors", "patterns", "caudal_fin_shape", "body_shape", "description"],
  }

  const newPrompt = `
  Analyze the fish in the image and return a JSON object following the schema below:
  ---
  ${JSON.stringify(jsonSchema, null, 2)}
  ---

  Do not return values that are not mentioned in the JSON schema.

  Example of the expected JSON object:
  {
    "colors": ["red", "blue", "green"],
    "patterns": ["blotches-or-dots", "vertical-marking"],
    "caudal_fin_shape": "rounded",
    "body_shape": "elongated",
    "description": "The fish has a red body with blue vertical stripes."
  }`

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
            text: newPrompt,
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
    colors: z.array(z.enum(colors.map((color) => color.id) as [string, ...string[]])),
    patterns: z.array(z.enum(patterns.map((pattern) => pattern.id) as [string, ...string[]])),
    caudal_fin_shape: z.enum(caudalFinShapes.map((shape) => shape.id) as [string, ...string[]]).nullable(),
    body_shape: z.enum(bodyShapes.map((shape) => shape.id) as [string, ...string[]]),
    description: z.string(),
  })

  const result = JSON.parse(response.choices[0].message.content!)
  console.log(result)
  schema.parse(result)

  return result as MorphologicalAttributes
}
