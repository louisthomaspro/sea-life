"use client"

import CreateGroupDrawerContent from "@/features/admin/components/create-update-group"
import AddToListDrawerContent from "@/features/list/components/add-to-list-trigger"
import CreateListDrawerContent from "@/features/list/components/create-update-list-trigger"
import SearchResultsDrawerContent from "@/features/search/components/search-results-drawer-content"
import { createPushModal } from "pushmodal"

import { Drawer } from "@/components/ui/drawer"

export const { pushModal, popModal, popAllModals, replaceWithModal, useOnPushModal, onPushModal, ModalProvider } =
  createPushModal({
    modals: {
      // Short hand
      // ModalExample,
      // SheetExample,

      // Longer definition where you can choose what wrapper you want
      // Only needed if you don't want `Dialog.Root` from '@radix-ui/react-dialog'
      // shadcn drawer needs a custom Wrapper
      SearchResultsDrawer: {
        Wrapper: Drawer,
        Component: SearchResultsDrawerContent,
      },
      CreateListDrawer: {
        Wrapper: Drawer,
        Component: CreateListDrawerContent,
      },
      CreateGroupDrawer: {
        Wrapper: Drawer,
        Component: CreateGroupDrawerContent,
      },
      AddToListDrawer: {
        Wrapper: Drawer,
        Component: AddToListDrawerContent,
      },
    },
  })
