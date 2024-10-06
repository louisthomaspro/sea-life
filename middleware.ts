import { NextResponse, type NextRequest } from "next/server"
import { pathToRegexp } from "path-to-regexp"

import { updateSession } from "@/lib/supabase/middleware"

const publicRoutes = [
  "/login",
  "/register",
  "/",
  "/species/:speciesId",
  "/explore/:groupSlug",
  "/privacy-policy",
  "/terms-of-service",
]

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse: response } = await updateSession(request)

  // Check if public route using pathToRegexp
  const regexPatterns = publicRoutes.map((route) => pathToRegexp(route))
  const isPublicPage = !!regexPatterns.find((pattern) => pattern.test(request.nextUrl.pathname))
  if (isPublicPage) return response

  if (!user) {
    return NextResponse.redirect(new URL(`/login?next=${request.url}`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|auth|_next/static|_next/image|favicon.ico|manifest.json|workbox-.*.js|sw.js|swe-worker-.*.js|.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
