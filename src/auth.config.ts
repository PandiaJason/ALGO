import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string })?.role;
      const pathname = nextUrl.pathname;

      // Admin routes protection
      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/admin/login", nextUrl.origin);
          redirectUrl.searchParams.set("callbackUrl", pathname);
          return Response.redirect(redirectUrl);
        }
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl.origin));
        }
        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "STUDENT";
        token.username = (user as { username?: string }).username || user.email?.split("@")[0] || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { username?: string }).username = token.username as string;
      }
      return session;
    },
  },
  providers: [], // Providers added in auth.ts (Node runtime)
};
