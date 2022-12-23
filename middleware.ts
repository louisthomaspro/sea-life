import { NextRequest, NextResponse } from "next/server";
import { getSelectedRegion } from "./utils/helper-regions";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname === "/explore") {
    const selectedRegion = getSelectedRegion();
    return NextResponse.redirect(new URL(`/explore/${selectedRegion}`, request.url));
  }
  return NextResponse.next();
}
