"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/db-types";

export function InvoiceAdminActions({
  invoice,
}: {
  invoice: { id: string; status: string; amount_cents: number };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const open = invoice.status === "unpaid" || invoice.status === "overdue";

  async function act(action: "mark_paid" | "resend") {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoice.id, action }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "Update failed");
      return;
    }
    setMsg(action === "mark_paid" ? "Marked paid" : "Pay link resent");
    router.refresh();
  }

  if (!open && invoice.status === "paid") {
    return <span className="text-xs font-semibold text-emerald-700">Paid {money(invoice.amount_cents)}</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {open && (
        <>
          <Button type="button" size="sm" variant="secondary" onClick={() => act("mark_paid")} disabled={loading} arrow={false}>
            Cash / check paid
          </Button>
          <Button type="button" size="sm" variant="outline" tone="light" onClick={() => act("resend")} disabled={loading} arrow={false}>
            Resend pay link
          </Button>
        </>
      )}
      {msg && <span className="text-xs text-hm-muted">{msg}</span>}
    </div>
  );
}
