import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/explore`, req.url));
  }

  // const response = NextResponse.next();

  // const session = await getIronSession(req, response, sessionOptions);
  // const { user } = session;

  // if (!user) {
  //   return NextResponse.redirect(new URL(`/profile`, req.url));
  // }
  // if (pathname.startsWith("/species") && !user.isAdmin) {
  //   return NextResponse.redirect(new URL(`/profile`, req.url));
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/", "/admin/:path*", "/species/:id/edit"],
// };

// For API

// return new NextResponse(
//   JSON.stringify({ success: false, message: 'authentication failed' }),
//   { status: 401, headers: { 'content-type': 'application/json' } }
// )
