import { betterFetch } from "@better-fetch/fetch"
import { type NextRequest, NextResponse } from "next/server"
import type { auth } from "@/lib/auth"

type Session = typeof auth.$Infer.Session

export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  )

  if (!session?.session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
