import { NextResponse, type NextRequest } from "next/server"
import { pathToRegexp } from "path-to-regexp"

import { updateSession } from "@/lib/supabase/middleware"

const publicRoutes = ["/", "/species/:speciesId", "/explore/:groupSlug", "/account"]

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check if public route using pathToRegexp
  const regexPatterns = publicRoutes.map((route) => pathToRegexp(route))
  const isPublicPage = !!regexPatterns.find((pattern) => pattern.test(request.nextUrl.pathname))
  if (isPublicPage) return response

  let newUrl = new URL(`/`, request.url)

  // Refresh session
  const session = await updateSession(request, response)

  if (!session || !session.data.user) {
    return NextResponse.redirect(newUrl)
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
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|workbox-.*.js|sw.js|swe-worker-.*.js|.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
