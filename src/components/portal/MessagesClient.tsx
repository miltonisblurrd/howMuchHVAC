"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Message } from "@/lib/db-types";
import { formatWhen } from "@/lib/db-types";
import { parseMessagePhoto } from "@/lib/uploads";
import { AndyAvatar, AndyName } from "@/components/contact/CallAndy";

type ThreadMessage = Message & { job_title?: string; photoUrl?: string | null };

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, jobId]);

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
    if ((!body.trim() && !photo) || !jobId) return;
    setSending(true);
    setError("");
    const form = new FormData();
    form.append("jobId", jobId);
    form.append("body", body);
    if (photo) form.append("photo", photo);
    const res = await fetch("/api/portal/messages", { method: "POST", body: form });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not send");
      return;
    }
    setBody("");
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  if (!jobs.length) {
    return (
      <p className="rounded-2xl border border-dashed border-hm-line bg-white px-6 py-10 text-center text-sm text-hm-muted">
        No jobs yet — request service to start a message thread.
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <div className="hm-admin-card p-3">
        <p className="px-2 text-[11px] font-bold uppercase tracking-wide text-hm-muted">Jobs</p>
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

      <div className="hm-admin-card flex min-h-[420px] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages
            .filter((m) => m.job_id === jobId)
            .map((m) => {
              const parsed = parseMessagePhoto(m.body);
              const fromCustomer = m.from_role === "customer";
              return (
                <div
                  key={m.id}
                  className={
                    fromCustomer
                      ? "ml-8 rounded-2xl bg-hm-red/10 px-4 py-3"
                      : "mr-8 rounded-2xl bg-hm-fog px-4 py-3"
                  }
                >
                  <div className="flex items-center gap-2">
                    {!fromCustomer && <AndyAvatar size="sm" />}
                    <p className="text-xs font-semibold text-hm-muted">
                      {fromCustomer ? "You" : <AndyName />} · {formatWhen(m.created_at)}
                    </p>
                  </div>
                  {m.photoUrl || parsed.photoPath ? (
                    m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photoUrl}
                        alt="Attached photo"
                        className="mt-2 max-h-56 rounded-lg object-cover"
                      />
                    ) : (
                      <p className="mt-1 text-xs text-hm-muted">Photo attached</p>
                    )
                  ) : null}
                  {parsed.text && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-hm-charcoal">{parsed.text}</p>
                  )}
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="border-t border-hm-line p-4">
          <textarea
            className="hm-input min-h-[88px]"
            placeholder="Ask a question, send details, or attach a photo…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="block text-xs text-hm-muted"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
            {photo && <span className="text-xs text-hm-muted">{photo.name}</span>}
            <Button type="submit" disabled={sending || (!body.trim() && !photo)}>
              {sending ? "Sending…" : "Send message"}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-hm-red">{error}</p>}
        </form>
      </div>
    </div>
  );
}
