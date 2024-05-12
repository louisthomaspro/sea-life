"use client"

import { useCallback, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { popModal, pushModal, useOnPushModal } from "@/lib/pushmodal/pushmodal"
import { addToListAction, createListAction, updateListAction } from "@/lib/services/lists-actions"
import { Button } from "@/components/ui/button"
import { DrawerClose, DrawerContent, DrawerFooter } from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Icons } from "@/components/ui/icons/icons"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2).max(50),
})

interface CreateListTriggerProps {}

export const CreateListTrigger = (props: CreateListTriggerProps) => {
  return (
    <Button className="flex items-center gap-1.5" onClick={() => pushModal("CreateListDrawer", { action: "create" })}>
      <Icons.plus className="h-5 w-5" />
      <p className="text-sm font-medium leading-none">Create a list</p>
    </Button>
  )
}

interface EditListTriggerProps {
  list: any
}

export const EditListTrigger = ({ list }: EditListTriggerProps) => {
  return (
    <Button variant="outline" size="icon" onClick={() => pushModal("CreateListDrawer", { action: "edit", list })}>
      <Icons.edit className="size-5" />
    </Button>
  )
}

interface CreateListDrawerContentProps {
  action: "create" | "edit"
  speciesId?: number
  list?: any
}

export default function CreateListDrawerContent({ action, list, speciesId }: CreateListDrawerContentProps) {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: list?.name ?? "",
    },
  })

  useEffect(() => {
    setTimeout(() => {
      form.setFocus("name")
    })
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    let newList: any = null

    startTransition(async () => {
      try {
        if (action === "create") {
          newList = await createListAction(values.name)
          if (speciesId) {
            await addToListAction(newList.id, speciesId)
          }
        }
        if (action === "edit") {
          await updateListAction(list.id, values.name)
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to create list")
        return
      }

      queryClient.invalidateQueries({
        queryKey: ["lists"],
      })

      if (speciesId) {
        queryClient.refetchQueries({
          queryKey: [`add-to-list-${speciesId}`],
        })
        queryClient.invalidateQueries({
          queryKey: [`lists-${newList.id}`],
        })
      }

      router.refresh()

      form.reset()
      toast.success(`List created ${speciesId && "and species added"}`)
      popModal("CreateListDrawer")
    })
  }

  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <div className="p-4 pb-0">
          <Form {...form}>
            <form id="create-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List name</FormLabel>
                    <FormControl>
                      <Input placeholder="My list" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <Button type="submit" form="create-form" onClick={form.handleSubmit(onSubmit)} size="lg" disabled={isPending}>
            {isPending ? <Icons.spinner className="size-4" /> : action === "create" ? "Create" : "Save"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" size={"lg"}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
