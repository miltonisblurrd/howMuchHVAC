"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function SelectOptionButton({
  jobId,
  optionId,
}: {
  jobId: string;
  optionId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function select() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/portal/select-option", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, optionId }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not select option");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <Button type="button" size="sm" onClick={select} disabled={loading} className="w-full">
        {loading ? "Saving?" : "Select this option"}
      </Button>
      {error && <p className="mt-2 text-xs text-hm-red">{error}</p>}
    </div>
  );
}
