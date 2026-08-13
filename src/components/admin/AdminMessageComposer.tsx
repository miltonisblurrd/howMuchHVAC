"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminMessageComposer({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, body }),
    });
    setLoading(false);
    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={send} className="mt-4 space-y-2">
      <textarea
        className="hm-input min-h-[80px]"
        placeholder="Reply to customer?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={loading} arrow={false}>
        {loading ? "Sending?" : "Send"}
      </Button>
    </form>
  );
}
