"use server"

import prisma from "@/lib/prisma"
import { getSafeUser } from "@/lib/supabase/server"

export async function deleteUserProfile() {
  // Get the current user
  const user = await getSafeUser()

  if (!user) {
    return false
  }

  try {
    // Delete user from database
    await prisma.profile.delete({
      where: { id: user.id },
    })
    return true
  } catch (error) {
    console.error("Error deleting user profile:", error)
    return false
  }
}
