import mime from "mime"
import sharp from "sharp"
import { rgbaToThumbHash, thumbHashToDataURL } from "thumbhash"

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

  const source = await getOrCreateSourceInaturalistById(id)

  if (!source) {
    throw new Error(`No inaturalist source found for taxa ${id}`)
  }

  const iNatPhotos = (source.json as INaturalistTaxa).taxon_photos

  for (const [indexPhoto, valuePhoto] of iNatPhotos.entries()) {
    const MAX_PHOTOS = 10
    if (indexPhoto + 1 > MAX_PHOTOS) break // Upload 10 photos per taxa max

    console.log(`Processing photo ${indexPhoto + 1} / ${MAX_PHOTOS}`)

    const photoUrl = valuePhoto.photo.large_url
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
    async function fetchWithRetry(url: string, maxRetries = 3, retryDelay = 3) {
      let attempt = 0
      while (attempt < maxRetries) {
        try {
          const response = await fetch(url, { cache: "no-store" })
          return response
        } catch (error) {
          console.error(`Fetch failed: ${error}, ${url}`)
          console.log(`Retrying in ${retryDelay} s...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay * 1000))
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

    // Get thumbhash
    // https://evanw.github.io/thumbhash/
    const buffer = Buffer.from(await response.arrayBuffer())
    const image = sharp(buffer).resize(100, 100, { fit: "inside" })
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const binaryThumbHash = rgbaToThumbHash(info.width, info.height, data)
    const placeholderURL = thumbHashToDataURL(binaryThumbHash)

    // Upload photo
    const extension = mime.getExtension(contentType)
    const file = new File([buffer], `photo.${extension}`, { type: contentType })
    const { publicUrl, s3Key } = await uploadTaxaMedia(taxaData.id.toString(), file)
    console.log(`${taxaData.id} - Uploaded ${publicUrl}`)

    await prisma.taxaMedia.create({
      data: {
        url: publicUrl,
        s3Key: s3Key,
        originalUrl: photoUrl,
        blurhash: Buffer.from(binaryThumbHash),
        blurhashDataUrl: placeholderURL,
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
