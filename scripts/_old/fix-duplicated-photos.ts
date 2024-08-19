import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"

import prisma from "@/lib/prisma"

require("dotenv").config()

/**
 * Find all taxaId with duplicated photos
 * For each taxaId, delete all photos in s3 and db
 *
 */

async function main() {
  const duplicated = await prisma.$queryRaw<any>`
  SELECT "taxaId", "originalUrl", COUNT(*) AS count
  FROM "TaxaMedia"
  GROUP BY "taxaId", "originalUrl"
  HAVING COUNT(*) > 1;
`

  console.log(duplicated.length)

  for (const row of duplicated) {
    const { taxaId } = row
    console.log(`Deleting duplicates for taxa ${taxaId}`)

    // delete in s3
    const client = new S3Client()
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `public/${taxaId}`,
    })
    let list = await client.send(listCommand)

    if (list.KeyCount) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: list.Contents?.map((item) => ({ Key: item.Key })),
          Quiet: false,
        },
      })
      let deleted = await client.send(deleteCommand)
      if (deleted.Errors) {
        deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`))
      }
    }

    // delete in db
    await prisma.taxaMedia.deleteMany({
      where: {
        taxaId,
      },
    })

    console.log(`Deleted in db and s3 for taxa ${taxaId}`)
  }
}

main()
