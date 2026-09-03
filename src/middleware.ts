import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/challenges/:id/workspace",
    "/api/admin/:path*",
    "/api/challenges/:id/submissions",
  ],
};
