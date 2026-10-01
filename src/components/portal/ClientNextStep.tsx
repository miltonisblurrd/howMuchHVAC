import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CallAndy } from "@/components/contact/CallAndy";
import type { ClientStage } from "@/lib/client-stages";
import { cn } from "@/lib/cn";

export function ClientNextStep({
  stage,
  showNotes = true,
  onDashboard = false,
}: {
  stage: ClientStage;
  showNotes?: boolean;
  /** On the dashboard, always offer a way into the full job page. */
  onDashboard?: boolean;
}) {
  const pay = stage.next.tone === "pay";
  const project = `/portal/projects/${stage.jobId}`;
  const primaryIsProject = stage.next.href.startsWith(project);
  const secondary =
    stage.phase === "deposit" || stage.phase === "pick"
      ? { href: `${project}#options`, label: stage.phase === "deposit" ? "Review or change my pick" : "See all options" }
      : onDashboard && !primaryIsProject
        ? { href: project, label: "View job details" }
        : null;

  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-[0_18px_40px_-28px_rgba(255,29,37,0.55)]",
        pay
          ? "border-amber-200 bg-amber-50"
          : "border-hm-red/25 bg-[linear-gradient(135deg,#fff7f7,white_55%)]",
      )}
    >
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
        What to do next
      </p>
      <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight text-hm-charcoal">
        {stage.next.title}
      </h2>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-hm-muted">{stage.next.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button href={stage.next.href} size="sm">
          {stage.next.cta}
        </Button>
        {secondary && !(stage.phase === "pick" && !onDashboard) && (
          <Button href={secondary.href} size="sm" variant="outline" arrow={false}>
            {secondary.label}
          </Button>
        )}
        {stage.phase === "visit" && (
          <CallAndy size="sm" variant="outline" arrow={false}>
            Call Andy
          </CallAndy>
        )}
      </div>
      {showNotes && stage.notes.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {stage.notes.map((note) => (
            <li key={note.text}>
              <Link href={note.href} className="text-sm font-semibold text-hm-charcoal underline-offset-4 hover:text-hm-red hover:underline">
                {note.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
