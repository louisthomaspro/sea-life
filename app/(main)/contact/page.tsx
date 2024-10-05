"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  const supportEmail = "louisthomas.pro@gmail.com"

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Contact Support</CardTitle>
          <CardDescription className="text-center">We're here to help! Reach out to us via email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg font-medium">{supportEmail}</p>
          <Button className="w-full" onClick={() => (window.location.href = `mailto:${supportEmail}`)}>
            Send Email
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
