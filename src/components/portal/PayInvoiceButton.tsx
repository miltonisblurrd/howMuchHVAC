"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

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
    <div className="text-right">
      <Button type="button" size="sm" onClick={pay} disabled={loading}>
        {loading ? "Opening?" : "Pay"}
      </Button>
      {error && <p className="mt-1 text-xs text-hm-red">{error}</p>}
    </div>
  );
}
