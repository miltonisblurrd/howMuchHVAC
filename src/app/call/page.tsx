import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { PhoneIntakeForm } from "@/components/admin/PhoneIntakeForm";

export const metadata: Metadata = {
  title: "Add from a call",
  description: "Andy's phone-call intake. Add a customer and send their portal email.",
  robots: { index: false, follow: false },
};

export default function CallIntakePage() {
  return (
    <div className="min-h-screen bg-white px-5 py-8 text-hm-charcoal md:py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex flex-col items-center text-center">
          <Logo height={88} href={null} priority />
          <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
            How Much? Air
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Add from a call</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-hm-muted">
            Name, phone, email, and the first visit. They get a portal email as soon as you hit
            send. Bookmark this page on your phone.
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-hm-line bg-white p-5 shadow-sm sm:p-6">
          <PhoneIntakeForm />
        </section>
      </div>
    </div>
  );
}
