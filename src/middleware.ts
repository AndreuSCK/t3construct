import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["((?!^/dashboard).*)"],
  afterAuth(auth, req) {
    const home = new URL("/", req.url);
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(home);
    }
    if (auth.userId && req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(home);
    }
  },
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)",
  ],
};
