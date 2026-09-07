import { AdminShell } from "@/components/admin/AdminShell";
import { PhoneIntakeForm } from "@/components/admin/PhoneIntakeForm";
import { requireAdmin } from "@/lib/auth";

export default async function AdminIntakePage() {
  const admin = await requireAdmin();

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Add from a call"
      description="Name, phone, email, address. They're in the system and get a portal email ? same path as a website quote."
    >
      <div className="mx-auto max-w-2xl">
        <section className="hm-admin-card p-5 sm:p-6">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
            While you&apos;re still on the phone
          </p>
          <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight">
            Dump it in here, then tell them to check their email
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-hm-muted">
            Creates the lead, opens a job, and emails them: thanks for talking with How Much? Air,
            plus a button to set a password and open their portal. If you booked a visit, that
            date is in the email too.
          </p>
          <div className="mt-6">
            <PhoneIntakeForm />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
