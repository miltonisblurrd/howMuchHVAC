"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  adminMessages,
  invoiceTotals,
  invoices,
  kpis,
  leads,
  money,
  schedule,
} from "@/lib/admin-data";

type Msg = { role: "user" | "assistant"; text: string };

const suggestions = [
  "What's outstanding this month?",
  "Who hasn't paid?",
  "What's on the schedule?",
  "Summarize new leads",
  "Draft a payment reminder",
];

function answerFor(input: string): string {
  const q = input.toLowerCase();
  const totals = invoiceTotals();
  const unpaid = invoices.filter((i) => i.status === "Unpaid" || i.status === "Overdue");
  const unread = adminMessages.filter((m) => m.unread);
  const newLeads = leads.filter((l) => l.status === "New" || l.status === "Contacted");

  if (q.includes("outstanding") || q.includes("ar") || q.includes("receivable")) {
    return `You've got ${money(totals.unpaid)} outstanding right now — ${money(totals.overdue)} of that is overdue. Paid invoices this period: ${money(totals.paid)}. Biggest open balance is HM-10492 (Jordan Hale) at ${money(12400)}.`;
  }

  if (
    q.includes("hasn't paid") ||
    q.includes("unpaid") ||
    q.includes("overdue") ||
    q.includes("who owe")
  ) {
    const lines = unpaid
      .map(
        (i) =>
          `• ${i.number} — ${i.client} (${i.city}) — ${money(i.amount)} — ${i.status} — due ${i.dueAt}`,
      )
      .join("\n");
    return `Unpaid / overdue invoices:\n${lines}\n\nWant me to draft a friendly reminder for the overdue one?`;
  }

  if (
    q.includes("thursday") ||
    q.includes("schedule") ||
    q.includes("today") ||
    q.includes("jobs")
  ) {
    const jobs = schedule
      .map((j) => `• ${j.when} — ${j.title} — ${j.client} — ${j.tech} (${j.status})`)
      .join("\n");
    return `Here's your upcoming board (${kpis.jobsThisWeek} jobs this week):\n${jobs}\n\nAmy Cho's Friday tune-up still needs confirmation.`;
  }

  if (q.includes("lead")) {
    const lines = newLeads
      .map(
        (l) =>
          `• ${l.name} — ${l.city} — ${l.service} — ${l.source} — ~${money(l.value)} — ${l.status}`,
      )
      .join("\n");
    return `Pipeline snapshot — ${kpis.newLeads} new leads this month, ~${kpis.closeRate}% close rate.\nHot / open:\n${lines}`;
  }

  if (q.includes("reminder") || q.includes("draft") || q.includes("text") || q.includes("sms")) {
    const overdue = invoices.find((i) => i.status === "Overdue");
    if (!overdue) return "No overdue invoices right now — you're clean.";
    return `Draft SMS to ${overdue.client}:\n\n"Hi ${overdue.client.split(" ")[0]}, Andy from How Much? here — friendly reminder that invoice ${overdue.number} for ${money(overdue.amount)} was due ${overdue.dueAt}. Happy to resend the link or set up a payment plan. Just reply here. Thanks!"\n\n(Demo only — nothing was sent.)`;
  }

  if (q.includes("revenue") || q.includes("month") || q.includes("how are we")) {
    return `Month-to-date revenue is ${money(kpis.monthRevenue)} (${kpis.monthRevenueChange}% vs last month). Average ticket ${money(kpis.avgTicket)}. ${kpis.jobsCompletedMonth} jobs completed. Google still sitting at ${kpis.googleRating} from ${kpis.reviewCount} reviews.`;
  }

  if (q.includes("message") || q.includes("inbox")) {
    return `You have ${unread.length} unread threads. Top ones:\n${unread
      .map((m) => `• ${m.from} (${m.channel}) — "${m.preview}"`)
      .join("\n")}`;
  }

  return `I can help Andy run the business faster — try asking about outstanding balances, unpaid invoices, this week's schedule, new leads, or ask me to draft a payment reminder.\n\nThis is a demo brain wired to sample How Much? data so you can feel the vision. In production it would connect to your real jobs, Stripe, SMS, and calendar.`;
}

export function AdminAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hey Andy — ask me about cash, jobs, leads, or have me draft a follow-up. You can keep working this page while we talk.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: answerFor(trimmed) }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === "user"
                ? "ml-auto max-w-[88%] rounded-2xl bg-hm-red px-3.5 py-2.5 text-sm text-white whitespace-pre-wrap"
                : "max-w-[92%] rounded-2xl bg-hm-fog px-3.5 py-2.5 text-sm text-hm-charcoal whitespace-pre-wrap"
            }
          >
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="rounded-2xl bg-hm-fog px-3.5 py-2.5 text-sm text-hm-muted">
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-hm-line p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-hm-line bg-hm-fog px-2.5 py-1 text-[11px] font-semibold text-hm-charcoal hover:border-hm-red/40"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this page…"
            className="hm-input flex-1"
          />
          <Button type="submit" size="sm" arrow={false} disabled={typing || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
