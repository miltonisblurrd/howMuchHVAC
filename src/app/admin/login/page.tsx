import { AdminLoginFormBoundary } from "@/components/admin/AdminLoginForm";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";
import { isDevLoginEnabled } from "@/lib/dev-auth";

export default function AdminLoginPage() {
  return (
    <AdminLoginFormBoundary
      authEmailsEnabled={supabaseAuthEmailsEnabled()}
      devLoginEnabled={isDevLoginEnabled()}
    />
  );
}
