import { getListsAction } from "@/lib/services/lists-actions"

export async function GET(request: Request) {
  const lists = await getListsAction()
  return new Response(JSON.stringify(lists), {
    headers: {
      "content-type": "application/json",
    },
  })
}
