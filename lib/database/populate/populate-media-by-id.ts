import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { uploadTaxaMedia } from "@/lib/aws/s3-utils"
import { getOrCreateSourceInaturalistById } from "@/lib/database/populate/get-or-create-source-inaturalist-by-id"
import prisma from "@/lib/prisma"

export const populateMediaById = async (id: number) => {
  // Get inaturalist data from db
  const taxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: true,
    },
    where: {
      id: id,
    },
  })

  if (!taxaData) {
    throw new Error(`No taxa found for id ${id}`)
  }

  if (taxaData.medias.length >= 10) {
    console.log(`Taxa ${id} already has 10 photos, skipping`)
    return taxaData
  }

  const source = await getOrCreateSourceInaturalistById(id)

  if (!source) {
    throw new Error(`No inaturalist source found for taxa ${id}`)
  }

  const iNatPhotos = (source.json as INaturalistTaxa).taxon_photos

  if (iNatPhotos.length === taxaData.medias.length) {
    console.log(`No new photos for ${taxaData.id}`)
    return taxaData
  }

  for (const [indexPhoto, valuePhoto] of iNatPhotos.entries()) {
    const MAX_PHOTOS = 10
    if (indexPhoto + 1 > MAX_PHOTOS) break // Upload 10 photos per taxa max

    console.log(`Processing photo ${indexPhoto + 1} / ${MAX_PHOTOS}`)

    const photoUrl = valuePhoto.photo.original_url
    const photoAttribution = valuePhoto.photo.attribution

    // Check if media already exists
    let mediaExists = false
    for (const media of taxaData.medias) {
      if (media.originalUrl === photoUrl) {
        console.log(`Media for ${taxaData.id} already exists, skipping - ${photoUrl}`)
        mediaExists = true
        break
      }
    }
    if (mediaExists) {
      continue
    }

    // Fetch photo
    async function fetchWithRetry(url: string, maxRetries = 3, retryDelay = 1000) {
      let attempt = 0
      while (attempt < maxRetries) {
        try {
          const response = await fetch(url, { cache: "no-store" })
          return response
        } catch (error) {
          console.error(`Fetch failed: ${error}, ${url}`)
          console.log(`Retrying in ${retryDelay} milliseconds...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          attempt++
        }
      }
      throw new Error(`Failed to fetch after ${maxRetries} attempts`)
    }

    const response = await fetchWithRetry(photoUrl)

    if (!response.ok) {
      console.log(`Failed to fetch photo for ${taxaData.id} - ${photoUrl}`)
      continue
    }

    const contentType = response.headers.get("content-type")
    if (!contentType) {
      console.log(`Failed to get content type for ${taxaData.id} - ${photoUrl}`)
      continue
    }

    const blob = await response.blob()
    const publicUrl = await uploadTaxaMedia(taxaData.id.toString(), blob)
    console.log(`${taxaData.id} - Uploaded ${publicUrl}`)

    await prisma.taxaMedia.create({
      data: {
        url: publicUrl,
        originalUrl: photoUrl,
        attribution: photoAttribution,
        taxaId: taxaData.id,
        type: "image",
        position: indexPhoto + 1,
      },
    })
  }

  // Refetch the new medias
  const newTaxaData = await prisma.taxa.findFirst({
    select: {
      id: true,
      medias: true,
    },
    where: {
      id: id,
    },
  })

  return newTaxaData
}
