// https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr
import * as React from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { Analytics } from "@vercel/analytics/react"

import NavigationProvider from "@/lib/navigation-provider"
import { ModalProvider } from "@/lib/pushmodal/pushmodal"
import { ModalProviderNavigationAutoClose } from "@/lib/pushmodal/pushmodal-navigation-auto-close"
import { ReactQueryProviders } from "@/lib/react-query/react-query-providers"
import { AuthProvider } from "@/lib/supabase/auth-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers(props: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ReactQueryProviders>
          <ReactQueryStreamedHydration>
            {props.children}
            <Toaster position="bottom-center" />
            <ModalProvider />
            <ModalProviderNavigationAutoClose />
            <ReactQueryDevtools initialIsOpen={false} />
            <Analytics />
          </ReactQueryStreamedHydration>
        </ReactQueryProviders>
      </AuthProvider>
    </NavigationProvider>
  )
}
