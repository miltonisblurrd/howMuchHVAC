"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function InviteButton({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function send() {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    setMsg(data.sent ? "Setup link sent. They set the password from that email." : "Could not send email");
  }

  return (
    <div>
      <Button type="button" size="sm" variant="outline" onClick={send} disabled={loading} arrow={false}>
        {loading ? "Sending…" : "Send password link"}
      </Button>
      {msg && <p className="mt-1 text-xs text-hm-muted">{msg}</p>}
    </div>
  );
}
