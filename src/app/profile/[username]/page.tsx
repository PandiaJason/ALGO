import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id?: string; username?: string }>;
}

export default async function LegacyProfileRedirect({ params }: Props) {
  const resolved = await params;
  const username = resolved.username || resolved.id;
  if (username) {
    redirect(`/u/${username}`);
  }
  redirect("/");
}
