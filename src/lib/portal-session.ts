import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodePortalSession, PORTAL_COOKIE } from "@/lib/portal-auth";
import { demoUsers } from "@/lib/portal-data";

export async function requirePortalUser() {
  const jar = await cookies();
  const session = decodePortalSession(jar.get(PORTAL_COOKIE)?.value);
  const user = demoUsers.find((u) => u.id === session?.userId);
  if (!user) redirect("/portal/login");
  return user;
}
