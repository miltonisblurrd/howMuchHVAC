import { PortalLoginFormBoundary } from "@/components/portal/PortalLoginForm";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";
import { isDevLoginEnabled } from "@/lib/dev-auth";

export default function PortalLoginPage() {
  return (
    <PortalLoginFormBoundary
      authEmailsEnabled={supabaseAuthEmailsEnabled()}
      devLoginEnabled={isDevLoginEnabled()}
    />
  );
}
