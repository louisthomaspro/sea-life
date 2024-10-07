"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { signOut } from "@/lib/supabase/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"
import { deleteUserProfile } from "@/app/(main)/account/settings/_components/actions"

export default function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      try {
        const success = await deleteUserProfile()
        if (success) {
          toast.success("Account deleted")
          await signOut()
        } else {
          toast.error("Failed to delete account")
        }
      } catch (error) {
        toast.error("Error deleting account")
      } finally {
        setIsDeleteDialogOpen(false)
      }
    })
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <nav>
        <ul className="space-y-2 md:max-w-xs lg:w-full">
          <li>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Icons.delete className="mr-2 h-4 w-4" />
                  Delete my account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isPending}>
                    {isPending ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete my account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        </ul>
      </nav>
    </div>
  )
}
