import "server-cli-only"

import { bodyShapes, caudalFinShapes, colors, patterns } from "@/constants/morphology"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

import prisma from "@/lib/prisma"

/**
 * Analyzes media for a taxa by id
 * Returns morphological attributes and description
 */
export const analyzeMediaByTaxaId = async (id: number) => {
  const taxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: {
        orderBy: {
          position: "asc",
        },
      },
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
  if (taxaData.attributes?.version === "gp4o-mini-1") {
    console.log(`Attributes already populated with latest version ${id}`)
    return
  }

  // Otherwise, re-populate attributes
  let results
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

  // const embeddingResponse = await openai.embeddings.create({
  //   model: "text-embedding-ada-002",
  //   input: results.description,
  //   encoding_format: "float",
  // })

  // const [{ embedding }] = embeddingResponse.data

  // // Update embedding in database
  // await prisma.$executeRaw`
  //   UPDATE "Taxa"
  //   SET "embeddingMorphologicalDescription" = ${JSON.stringify(embedding)}::vector
  //   WHERE "id" = ${id}
  //     `

  // Save in database
  const newValues = {
    version: "gp4o-mini-1",
    colors: {
      set: results.colors,
    },
    patterns: {
      set: results.patterns,
    },
    caudalFinShape: results.caudal_fin_shape,
    bodyShape: results.body_shape,
  }

  await prisma.taxa.update({
    where: {
      id: id,
    },
    data: {
      attributes: {
        upsert: {
          create: newValues,
          update: newValues,
          where: {
            taxaId: id,
          },
        },
      },
    },
  })
}

async function getMorphologicalAttributes(url: string) {
  const newPrompt = `Analyze the fish in the image.`

  const result = await generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    schemaDescription: "Fish attributes",
    schema: z.object({
      colors: z.array(z.enum(colors.map((color) => color.id) as [string, ...string[]])),
      patterns: z.array(z.enum(patterns.map((pattern) => pattern.id) as [string, ...string[]])),
      caudal_fin_shape: z.enum(caudalFinShapes.map((shape) => shape.id) as [string, ...string[]]).nullable(),
      body_shape: z.enum(bodyShapes.map((shape) => shape.id) as [string, ...string[]]),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: newPrompt,
          },
          {
            type: "image",
            image: new URL(url),
          },
        ],
      },
    ],
  })

  console.log(result.usage, result.object)

  return result.object
}
