import { useEffect } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { AddToListDrawerContent } from "@/features/list/components/add-to-list-trigger"
import { createPushModal } from "pushmodal"

import { Drawer } from "@/components/ui/drawer"

// If not dynamic, I got the error "Unhandled Runtime Error"
// Error: Module [project]/node_modules/.pnpm/next@14.2.3_@babel+core@7.24.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript) was instantiated because it was required from module [project]/node_modules/.pnpm/react-hook-form@7.51.4_react@18.3.1/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript), but the module factory is not available. It might have been deleted in an HMR update.
const CreateListDrawerContentDynamic = dynamic(() => import("@/features/list/components/create-update-list-trigger"))

export const { pushModal, popModal, popAllModals, replaceWithModal, useOnPushModal, onPushModal, ModalProvider } =
  createPushModal({
    modals: {
      // Short hand
      // ModalExample,
      // SheetExample,

      // Longer definition where you can choose what wrapper you want
      // Only needed if you don't want `Dialog.Root` from '@radix-ui/react-dialog'
      // shadcn drawer needs a custom Wrapper
      CreateListDrawer: {
        Wrapper: Drawer,
        Component: CreateListDrawerContentDynamic,
      },
      AddToListDrawer: {
        Wrapper: Drawer,
        Component: AddToListDrawerContent,
      },
    },
  })

export const ModalProviderNavigationAutoClose = () => {
  const pathname = usePathname()

  useEffect(() => {
    popAllModals()
  }, [pathname])

  return null
}
