import Link from "next/link";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import { CountUp } from "@/components/admin/CountUp";
import { OptionCopyView } from "@/components/portal/OptionCopyView";
import { SelectOptionButton } from "@/components/portal/SelectOptionButton";
import type { ClientStage } from "@/lib/client-stages";
import type { JobOption } from "@/lib/db-types";
import { money } from "@/lib/db-types";
import { cn } from "@/lib/cn";

export function OptionsCard({
  stage,
  options,
}: {
  stage: ClientStage;
  options: JobOption[];
}) {
  const selected = stage.selected;
  const chosen = options.find((o) => o.id === selected?.id) ?? null;
  const others = options.filter((o) => o.id !== chosen?.id);

  return (
    <section id="options" className="scroll-mt-24">
      <AdminCard>
        <AdminCardHeader
          title="Your options"
          caption={
            stage.showOptions
              ? stage.canChangeOption
                ? "Andy recommends one. You can switch until the deposit is paid."
                : "This choice is locked. Message Andy if you need to change it."
              : "Andy will post pricing after he's seen the job."
          }
        />

        {!stage.showOptions && (
          <p className="mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3 text-sm text-hm-muted">
            Nothing to review yet. The quote shows up here after the look-over.
          </p>
        )}

        {stage.showOptions && stage.depositPaid && chosen && (
          <div className="mt-4">
            <OptionTile option={chosen} selected locked />
            <p className="mt-3 text-sm text-hm-muted">
              <Link href="/portal/messages" className="font-semibold text-hm-red">
                Message Andy
              </Link>{" "}
              if this needs to change.
            </p>
          </div>
        )}

        {stage.showOptions && !stage.depositPaid && !chosen && (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {options.map((option) => (
              <OptionTile
                key={option.id}
                option={option}
                jobId={stage.jobId}
                canSelect={stage.canChangeOption}
              />
            ))}
          </div>
        )}

        {stage.showOptions && !stage.depositPaid && chosen && (
          <div className="mt-4 space-y-3">
            <OptionTile option={chosen} selected jobId={stage.jobId} />
            {others.length > 0 && stage.canChangeOption && (
              <details className="rounded-xl border border-hm-line bg-hm-fog/60 px-4 py-3">
                <summary className="cursor-pointer font-semibold text-hm-charcoal">
                  Change my pick
                </summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {others.map((option) => (
                    <OptionTile
                      key={option.id}
                      option={option}
                      jobId={stage.jobId}
                      canSelect
                      selectLabel="Choose this instead"
                    />
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </AdminCard>
    </section>
  );
}

function OptionTile({
  option,
  selected,
  locked,
  jobId,
  canSelect,
  selectLabel,
}: {
  option: JobOption;
  selected?: boolean;
  locked?: boolean;
  jobId?: string;
  canSelect?: boolean;
  selectLabel?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4",
        selected || option.recommended ? "border-hm-red/50" : "border-hm-line",
      )}
    >
      {option.recommended && (
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">Recommended</p>
      )}
      {selected && (
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
          {locked ? "Your choice" : "Selected"}
        </p>
      )}
      <h3 className="mt-1 font-display text-[15px] font-bold text-hm-charcoal">{option.name}</h3>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-hm-charcoal">
        <CountUp value={money(option.price_cents)} />
      </p>
      <OptionCopyView description={option.description} />
      {canSelect && jobId && (
        <div className="mt-4">
          <SelectOptionButton jobId={jobId} optionId={option.id} label={selectLabel} />
        </div>
      )}
    </div>
  );
}
