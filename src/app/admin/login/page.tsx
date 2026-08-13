import { AdminLoginFormBoundary } from "@/components/admin/AdminLoginForm";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";

export default function AdminLoginPage() {
  return <AdminLoginFormBoundary authEmailsEnabled={supabaseAuthEmailsEnabled()} />;
}
