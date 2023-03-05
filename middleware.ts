import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions } from "./iron-session/withSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/explore`, request.url));
  }

  const response = NextResponse.next();

  const session = await getIronSession(request, response, sessionOptions);
  const { user } = session;

  if (!user) {
    return NextResponse.redirect(new URL(`/profile`, request.url));
  }
  if (pathname.startsWith("/species") && !user.isAdmin) {
    return NextResponse.redirect(new URL(`/profile`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/species/:id/edit"],
};

// For API

// return new NextResponse(
//   JSON.stringify({ success: false, message: 'authentication failed' }),
//   { status: 401, headers: { 'content-type': 'application/json' } }
// )
