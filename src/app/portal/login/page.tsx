import { PortalLoginFormBoundary } from "@/components/portal/PortalLoginForm";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";

export default function PortalLoginPage() {
  return <PortalLoginFormBoundary authEmailsEnabled={supabaseAuthEmailsEnabled()} />;
}
