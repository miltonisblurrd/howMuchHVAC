"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SynchronyFinanceButton } from "@/components/portal/SynchronyFinanceButton";

export function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/portal/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok || !data.url) {
      setError(data.error || "Checkout unavailable");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" size="sm" onClick={pay} disabled={loading} arrow={false}>
          {loading ? "Opening…" : "Pay in full"}
        </Button>
        <SynchronyFinanceButton />
      </div>
      {error && <p className="text-xs text-hm-red">{error}</p>}
    </div>
  );
}
