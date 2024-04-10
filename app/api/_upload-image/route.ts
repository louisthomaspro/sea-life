import { uploadTaxaMedia } from "@/lib/aws/s3-utils"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    await uploadTaxaMedia("test", file)
    return new Response("File uploaded successfully")
  } catch (error) {
    console.error(error)
    return new Response("File upload failed")
  }
}
