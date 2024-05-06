"use client"

import { useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { deleteListAction } from "@/lib/services/lists-actions"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export default function DeleteListTrigger() {
  const params = useParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteListAction(Number(params.listId))
      } catch (error) {
        console.error(error)
        toast.error("Failed to delete list")
        return
      }
      router.push("/lists")
      router.refresh()
    })
  }

  return (
    <Button variant="outline" size="icon" onClick={handleDelete}>
      {isPending ? <Icons.spinner className="size-4" /> : <Icons.delete className="size-4" />}
    </Button>
  )
}
