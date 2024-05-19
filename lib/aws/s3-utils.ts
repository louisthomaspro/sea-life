import "server-cli-only"

import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import mime from "mime"

export const uploadTaxaMedia = async (id: string, file: File) => {
  const extension = mime.getExtension(file.type)
  const fileContent = await file.arrayBuffer()
  const buffer = Buffer.from(fileContent)

  if (!extension) {
    throw new Error(`Failed to get extension for file type: ${file.type}`)
  }

  // Upload
  const client = new S3Client()
  const uploadParams: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `public/${id}/${crypto.randomUUID()}.${extension}`,
    ACL: "public-read", // Make the file public
    ContentType: file.type,
    Body: buffer,
  }

  const uploadCommand = new PutObjectCommand(uploadParams)
  await client.send(uploadCommand)

  // Return the public URL
  const publicUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`
  return { publicUrl, s3Key: uploadParams.Key! }
}
