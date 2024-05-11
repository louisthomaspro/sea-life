"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Prisma } from "@prisma/client"
import { toast } from "sonner"
import { z } from "zod"

import { popModal, pushModal } from "@/lib/pushmodal/pushmodal"
import { createGroupAction, updateGroupAction } from "@/lib/services/groups-actions"
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form"
import { Button } from "@/components/ui/button"
import { DrawerContent } from "@/components/ui/drawer"
import { Icons } from "@/components/ui/icons/icons"

interface CreateGroupTriggerProps {}

export const CreateGroupTrigger = (props: CreateGroupTriggerProps) => {
  return (
    <Button className="flex items-center gap-1.5" onClick={() => pushModal("CreateGroupDrawer", { action: "create" })}>
      <Icons.plus className="h-5 w-5" />
      <p className="text-sm font-medium leading-none">Create a group</p>
    </Button>
  )
}

interface EditGroupTriggerProps {
  group: any
}
export const EditGroupTrigger = ({ group }: EditGroupTriggerProps) => {
  return (
    <Button
      className="flex items-center gap-1.5"
      onClick={() => pushModal("CreateGroupDrawer", { action: "edit", group })}
    >
      <Icons.edit className="h-5 w-5" />
      <p className="text-sm font-medium leading-none">Edit group</p>
    </Button>
  )
}

interface CreateGroupDrawerContentProps {
  action: "create" | "edit"
  group?: any
}

export default function CreateGroupDrawerContent({ action, group }: CreateGroupDrawerContentProps) {
  const formSchema = z.object({
    commonNamesEn: z
      .string()
      .min(2)
      .max(50)
      .default(group?.commonNames?.en ?? ""),
    commonNamesFr: z
      .string()
      .min(2)
      .max(50)
      .default(group?.commonNames?.fr ?? ""),
    slug: z
      .string()
      .min(2)
      .max(50)
      .default(group?.slug ?? ""),
    parentId: z.number().default(group?.parentId ?? null),
    highLevelTaxa: z.array(z.object({ id: z.number() })).default(group?.highLevelTaxa ?? []),
  })

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const createInput: Prisma.GroupCreateInput = {
        commonNames: { en: values.commonNamesEn, fr: values.commonNamesFr },
        slug: values.slug,
        parent: {
          connect: {
            id: values.parentId,
          },
        },
        highLevelTaxa: {
          connect: values.highLevelTaxa,
        },
        level: 2,
      }

      const updateIntput: Prisma.GroupUpdateInput = {
        commonNames: { en: values.commonNamesEn, fr: values.commonNamesFr },
        slug: values.slug,
        parent: {
          connect: {
            id: values.parentId,
          },
        },
        highLevelTaxa: {
          set: values.highLevelTaxa,
        },
        level: 2,
      }

      try {
        if (action === "create") {
          await createGroupAction(createInput)
        }
        if (action === "edit") {
          await updateGroupAction(group.id, updateIntput)
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to create group")
        return
      }

      // queryClient.invalidateQueries({
      //   queryKey: ["lists"],
      // })
      router.refresh()

      toast.success("Group created")
      popModal("CreateGroupDrawer")
    })
  }

  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <div className="p-4 pb-0">
          <AutoForm formSchema={formSchema} onSubmit={onSubmit}>
            <AutoFormSubmit disabled={isPending}>
              {isPending ? <Icons.spinner className="size-4" /> : action === "create" ? "Create" : "Save"}
            </AutoFormSubmit>
            <Button variant="outline" size={"lg"} onClick={() => popModal("CreateGroupDrawer")}>
              Cancel
            </Button>
          </AutoForm>
        </div>
      </div>
    </DrawerContent>
  )
}
