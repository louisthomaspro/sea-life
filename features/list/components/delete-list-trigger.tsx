"use client"

import { useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteListAction } from "@/lib/services/lists-actions"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export default function DeleteListTrigger() {
  const params = useParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteListAction(Number(params.listId))
      } catch (error) {
        console.error(error)
        toast.error("Failed to delete list")
        return
      }
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      })
      router.push("/lists")
    })
  }

  return (
    <Button variant="outline" size="icon" onClick={handleDelete} disabled={isPending}>
      {isPending ? <Icons.spinner className="size-4" /> : <Icons.delete className="size-4" />}
    </Button>
  )
}
