import { NextResponse } from "next/server"
import { auth, auth as middleware } from "./auth"
 
export default middleware(async (req) => {
  const isLoggedIn = !!req.auth
  const url = req.nextUrl

  if(isLoggedIn && (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/verify")
  )) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if(!isLoggedIn && (url.pathname == "/" ||   url.pathname == "/chat")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
    "/chat"
  ]
}