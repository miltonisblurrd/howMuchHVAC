"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ConfirmAppointmentActions({
  appointment,
}: {
  appointment: {
    id: string;
    starts_at: string;
    status: string;
    type?: string;
    tech_name?: string | null;
    customer_note?: string | null;
  };
}) {
  const router = useRouter();
  const [techName, setTechName] = useState(appointment.tech_name || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function act(action: "confirm" | "decline") {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: appointment.id,
        action,
        techName: techName.trim() || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Update failed");
      return;
    }
    router.refresh();
  }

  if (appointment.status !== "pending") {
    return appointment.tech_name ? (
      <p className="mt-1 text-xs text-hm-muted">Tech: {appointment.tech_name}</p>
    ) : null;
  }

  return (
    <div className="mt-2 space-y-2">
      {appointment.customer_note && (
        <p className="text-xs text-hm-muted">Note: {appointment.customer_note}</p>
      )}
      <input
        className="hm-input"
        placeholder="Tech name (optional)"
        value={techName}
        onChange={(e) => setTechName(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => act("confirm")} disabled={loading} arrow={false}>
          Confirm
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          tone="light"
          onClick={() => act("decline")}
          disabled={loading}
          arrow={false}
        >
          Decline
        </Button>
      </div>
      {msg && <p className="text-xs text-hm-red">{msg}</p>}
    </div>
  );
}
