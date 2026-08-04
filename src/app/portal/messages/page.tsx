import { PortalShell } from "@/components/portal/PortalShell";
import { getUserMessages } from "@/lib/portal-data";
import { requirePortalUser } from "@/lib/portal-session";
import { cn } from "@/lib/cn";

export default async function PortalMessagesPage() {
  const user = await requirePortalUser();
  const messages = getUserMessages(user.id);

  return (
    <PortalShell userName={user.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Messages</h1>
      <p className="mt-2 text-hm-muted">
        Demo thread with Andy and the crew — scripted for walkthrough.
      </p>
      <div className="mt-8 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-xl rounded-2xl px-5 py-4",
              message.from === "client"
                ? "ml-auto bg-hm-red text-white"
                : "bg-white border border-hm-line",
            )}
          >
            <p className="text-xs font-semibold opacity-70">{message.author}</p>
            <p className="mt-2 text-sm leading-relaxed">{message.body}</p>
            <p className="mt-3 text-[11px] opacity-60">
              {new Date(message.at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form className="mt-8 flex gap-3">
        <input
          disabled
          placeholder="Messaging is demo-only for now"
          className="h-12 flex-1 rounded-md border border-hm-line bg-white px-3 text-sm"
        />
        <button
          type="button"
          disabled
          className="h-12 rounded-md bg-hm-charcoal px-5 font-display text-sm font-semibold text-white opacity-60"
        >
          Send
        </button>
      </form>
    </PortalShell>
  );
}
