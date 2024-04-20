import { NextRequest, NextResponse } from "next/server"
import { auth, auth as middleware } from "./auth"
 
export default middleware(async(req: NextRequest) => {
  const session = await auth()
  const url = req.nextUrl

  if(session && (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/")
  )) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if(!session && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: [
    // "/login",
    // "/signup",
    // "/",
    // "/dashboard/:path*",
    // "/verify/:path*",
  ]
}