import { unpackOptionCopy } from "@/lib/option-copy";

export function OptionCopyView({ description }: { description: string }) {
  const copy = unpackOptionCopy(description);
  const blocks = [
    { label: "Equipment", text: copy.equipment },
    { label: "Miscellaneous add-ons", text: copy.addons },
    { label: "Warranty", text: copy.warranty },
  ].filter((block) => block.text);

  return (
    <div className="mt-3 space-y-2 text-sm text-hm-muted">
      {copy.summary ? <p className="whitespace-pre-wrap">{copy.summary}</p> : null}
      {blocks.map((block) => (
        <p key={block.label} className="whitespace-pre-wrap">
          <span className="font-semibold text-hm-charcoal">{block.label}. </span>
          {block.text}
        </p>
      ))}
      {copy.details ? (
        <details className="rounded-lg border border-hm-line bg-hm-fog/70 px-3 py-2">
          <summary className="cursor-pointer font-semibold text-hm-charcoal">Details</summary>
          <p className="mt-2 whitespace-pre-wrap">{copy.details}</p>
        </details>
      ) : null}
    </div>
  );
}
