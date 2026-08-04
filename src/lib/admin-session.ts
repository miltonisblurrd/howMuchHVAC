import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminUser } from "@/lib/admin-data";
import { ADMIN_COOKIE, decodeAdminSession } from "@/lib/admin-auth";

export async function requireAdmin() {
  const jar = await cookies();
  const session = decodeAdminSession(jar.get(ADMIN_COOKIE)?.value);
  if (!session || session.userId !== adminUser.id) redirect("/admin/login");
  return adminUser;
}
