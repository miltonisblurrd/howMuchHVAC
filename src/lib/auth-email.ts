/** Supabase's built-in Auth mailer. Keep OFF until custom SMTP (Resend) is connected. */
export function supabaseAuthEmailsEnabled() {
  return process.env.SUPABASE_AUTH_EMAILS === "true";
}
