import Header from "@/components/header/header"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-screen min-h-dvh flex-col overflow-y-auto bg-white">
      <Header />
      <main className="grow">{children}</main>
    </div>
  )
}
