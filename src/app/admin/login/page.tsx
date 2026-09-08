import React from "react";
import { AdminLoginForm } from "./admin-login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const isAccessDenied = params?.error === "AccessDenied";

  return <AdminLoginForm isAccessDenied={isAccessDenied} />;
}
