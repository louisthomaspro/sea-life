"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { popModal, pushModal, replaceWithModal } from "@/lib/pushmodal/pushmodal"
import { addToListAction, deleteFromListAction, getListsAction } from "@/lib/services/lists-actions"
import { useAuth } from "@/lib/supabase/auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DrawerClose, DrawerContent, DrawerFooter } from "@/components/ui/drawer"
import { Icons } from "@/components/ui/icons"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"

interface AddToListTriggerProps {
  speciesId: number
}

export const AddToListTrigger = ({ speciesId }: AddToListTriggerProps) => {
  const { user } = useAuth()
  let { data: lists } = useQuery({
    queryKey: [`add-to-list-${speciesId}`],
    queryFn: async () => getListsAction(speciesId),
    enabled: !!user,
  })

  // already in list if lists contain speciesId
  const isAlreadyInList = lists?.some((list) => list._count.species > 0)

  return (
    <Button
      className="absolute right-4 top-4 z-10"
      variant="outline"
      size="icon"
      onClick={() => {
        if (!user) {
          toast("Please sign in to add to a list", {
            action: <GoogleSignInButton className="ml-auto" onClick={() => toast.dismiss()} />,
          })
        } else {
          pushModal("AddToListDrawer", { speciesId })
        }
      }}
    >
      {isAlreadyInList ? <Icons.listAdded className="size-4" /> : <Icons.list className="size-4" />}
    </Button>
  )
}

interface AddToListDrawerContentProps {
  speciesId: number
}

export default function AddToListDrawerContent({ speciesId }: AddToListDrawerContentProps) {
  let { data: lists, isLoading } = useQuery({
    queryKey: [`add-to-list-${speciesId}`],
    queryFn: async () => getListsAction(speciesId),
  })

  const queryClient = useQueryClient()

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleListClick = (listId: number, action: "add" | "remove" = "add") => {
    if (action === "remove") {
      startTransition(async () => {
        await deleteFromListAction(listId, speciesId)
        toast.success("Removed from list")
        popModal("AddToListDrawer")
      })
    }
    if (action === "add") {
      startTransition(async () => {
        await addToListAction(listId, speciesId)
        toast.success("Added to list")
        popModal("AddToListDrawer")
      })
    }

    queryClient.refetchQueries({
      queryKey: [`add-to-list-${speciesId}`],
    })
    queryClient.invalidateQueries({
      queryKey: [`lists-${listId}`],
    })
    queryClient.invalidateQueries({
      queryKey: ["lists"],
    })
  }

  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col gap-2 p-2 pb-0">
          <div className="px-2 font-medium text-muted-foreground">Add to a list</div>
          <div className="grid">
            <div
              className="flex cursor-pointer items-center gap-4 rounded-md px-2 py-2 hover:bg-gray-100"
              onClick={() => replaceWithModal("CreateListDrawer", { action: "create" })}
            >
              <div className="flex size-10 items-center justify-center rounded-md border border-gray-300">
                <Icons.add className="size-4" />
              </div>
              <div className="grid gap-1">
                <p className="font-medium">Create a list</p>
              </div>
              {/* <div className="ml-auto font-medium">10</div> */}
            </div>

            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {lists?.map((list, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-md px-2 py-2 hover:bg-gray-100",
                      isPending && "pointer-events-none opacity-50"
                    )}
                    onClick={() => handleListClick(list.id, list._count.species ? "remove" : "add")}
                  >
                    <div className="flex size-10 items-center justify-center rounded-md bg-gray-200">
                      <Icons.list className="size-4" />
                    </div>
                    <div className="grid gap-1">
                      <p className="font-medium">{list.name}</p>
                    </div>
                    {list._count.species > 0 && (
                      <div className="ml-auto">
                        <Icons.check className="size-4" />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Skip</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
