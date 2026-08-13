"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Message } from "@/lib/db-types";
import { formatWhen } from "@/lib/db-types";

type ThreadMessage = Message & { job_title?: string };

export function MessagesClient({
  initial,
  jobs,
  customerId,
}: {
  initial: ThreadMessage[];
  jobs: { id: string; title: string }[];
  customerId: string;
}) {
  const [messages, setMessages] = useState(initial);
  const [jobId, setJobId] = useState(jobs[0]?.id || "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!jobs.length) return;
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("portal-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as Message;
          if (!jobs.some((j) => j.id === row.job_id)) return;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            const job = jobs.find((j) => j.id === row.job_id);
            return [...prev, { ...row, job_title: job?.title }];
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [jobs, customerId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !jobId) return;
    setSending(true);
    setError("");
    const res = await fetch("/api/portal/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, body }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not send");
      return;
    }
    setBody("");
  }

  if (!jobs.length) {
    return (
      <p className="rounded-2xl border border-dashed border-hm-line bg-white p-8 text-center text-hm-muted">
        No jobs yet ? request service to start a message thread.
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <div className="rounded-2xl border border-hm-line bg-white p-3">
        <p className="px-2 text-xs font-bold uppercase tracking-wide text-hm-muted">Jobs</p>
        <ul className="mt-2 space-y-1">
          {jobs.map((j) => (
            <li key={j.id}>
              <button
                type="button"
                onClick={() => setJobId(j.id)}
                className={
                  jobId === j.id
                    ? "w-full rounded-lg bg-hm-fog px-3 py-2 text-left text-sm font-semibold"
                    : "w-full rounded-lg px-3 py-2 text-left text-sm text-hm-muted hover:bg-hm-fog"
                }
              >
                {j.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-[420px] flex-col rounded-2xl border border-hm-line bg-white">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages
            .filter((m) => m.job_id === jobId)
            .map((m) => (
              <div
                key={m.id}
                className={
                  m.from_role === "customer"
                    ? "ml-8 rounded-2xl bg-hm-red/10 px-4 py-3"
                    : "mr-8 rounded-2xl bg-hm-fog px-4 py-3"
                }
              >
                <p className="text-xs font-semibold text-hm-muted">
                  {m.from_role === "customer" ? "You" : "How Much?"} ? {formatWhen(m.created_at)}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-hm-charcoal">{m.body}</p>
              </div>
            ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="border-t border-hm-line p-4">
          <textarea
            className="hm-input min-h-[88px]"
            placeholder="Ask a question, send details, or share what you need?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          {error && <p className="mt-2 text-sm text-hm-red">{error}</p>}
          <Button type="submit" className="mt-3" disabled={sending}>
            {sending ? "Sending?" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
