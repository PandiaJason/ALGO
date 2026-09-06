"use server";

import { signOut } from "@/auth";

/**
 * Cleanly signs out the authenticated user by destroying session cookies
 * and redirecting back to the root application page.
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
