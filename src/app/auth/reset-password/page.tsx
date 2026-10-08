import { Logo } from "@/components/ui/Logo";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hm-ink px-5 py-16 text-white">
      <div className="absolute inset-0 hm-gradient-hero opacity-80" />
      <div className="absolute inset-0 hm-noise opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center">
          <Logo variant="white" height={56} href="/" priority />
        </div>
        <div className="mt-8 rounded-2xl bg-white p-8 text-hm-charcoal shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
          <h1 className="font-display text-2xl font-bold tracking-tight">Create your password</h1>
          <p className="mt-2 text-sm text-hm-muted">
            One password for your portal. At least 8 characters. You’ll use it the next time you sign in.
          </p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
