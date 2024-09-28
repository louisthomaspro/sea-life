import * as React from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Analytics } from "@vercel/analytics/react"

import NavigationProvider from "@/lib/navigation-provider"
import { ModalProvider } from "@/lib/pushmodal/pushmodal"
import { ModalProviderNavigationAutoClose } from "@/lib/pushmodal/pushmodal-navigation-auto-close"
import { ReactQueryProvider } from "@/lib/react-query/react-query-provider"
import { AuthProvider } from "@/lib/supabase/auth-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers(props: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <ReactQueryProvider>
        <AuthProvider>
          {props.children}
          <Toaster position="bottom-center" />
          <ModalProvider />
          <ModalProviderNavigationAutoClose />
          <ReactQueryDevtools initialIsOpen={false} />
          <Analytics />
        </AuthProvider>
      </ReactQueryProvider>
    </NavigationProvider>
  )
}
