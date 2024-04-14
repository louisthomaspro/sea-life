import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { uploadTaxaMedia } from "@/lib/aws/s3-utils"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const taxaData = await prisma.taxa.findMany({
    select: {
      id: true,
      medias: true,
      sources: {
        where: {
          name: "inaturalist",
        },
      },
    },
    where: {
      rank: {
        equals: "species",
      },
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [indexTaxa, valueTaxa] of taxaData.entries()) {
    console.log(`processing taxa ${indexTaxa + 1} / ${taxaData.length}, id: ${valueTaxa.id}`)
    const iNatPhotos = (valueTaxa.sources[0].json as INaturalistTaxa).taxon_photos

    let position = 1
    for (const [indexPhoto, valuePhoto] of iNatPhotos.entries()) {
      if (position > 10) break // Upload 20 photos per taxa max

      const photoUrl = valuePhoto.photo.original_url
      const photoAttribution = valuePhoto.photo.attribution

      // Check if media already exists
      let mediaExists = false
      for (const media of valueTaxa.medias) {
        if (media.originalUrl === photoUrl) {
          console.log(`Media for ${valueTaxa.id} already exists, skipping - ${photoUrl}`)
          mediaExists = true
          break
        }
      }
      if (mediaExists) {
        position++
        continue
      }

      // Fetch photo
      const response = await fetch(photoUrl, {
        cache: "no-store",
      })

      if (!response.ok) {
        console.log(`Failed to fetch photo for ${valueTaxa.id} - ${photoUrl}`)
        continue
      }

      const contentType = response.headers.get("content-type")
      if (!contentType) {
        console.log(`Failed to get content type for ${valueTaxa.id} - ${photoUrl}`)
        continue
      }

      const blob = await response.blob()
      const publicUrl = await uploadTaxaMedia(valueTaxa.id.toString(), blob)
      console.log(`${valueTaxa.id} - Uploaded ${publicUrl}`)

      await prisma.taxaMedia.create({
        data: {
          url: publicUrl,
          originalUrl: photoUrl,
          attribution: photoAttribution,
          taxaId: valueTaxa.id,
          type: "image",
          position: position,
        },
      })
      position++
    }
  }

  return new Response()
}
