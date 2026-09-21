export type OptionCopy = {
  summary: string;
  equipment: string;
  addons: string;
  warranty: string;
  details: string;
};

const PREFIX = "[[hm-price]]";

export function packOptionCopy(input: OptionCopy) {
  const summary = input.summary.trim();
  const extra = {
    equipment: input.equipment.trim(),
    addons: input.addons.trim(),
    warranty: input.warranty.trim(),
    details: input.details.trim(),
  };
  if (!extra.equipment && !extra.addons && !extra.warranty && !extra.details) return summary;
  return `${PREFIX}${JSON.stringify({ summary, ...extra })}`;
}

export function unpackOptionCopy(raw: string | null | undefined): OptionCopy {
  const text = raw || "";
  if (!text.startsWith(PREFIX)) {
    return { summary: text, equipment: "", addons: "", warranty: "", details: "" };
  }
  try {
    const parsed = JSON.parse(text.slice(PREFIX.length)) as Partial<OptionCopy>;
    return {
      summary: String(parsed.summary || ""),
      equipment: String(parsed.equipment || ""),
      addons: String(parsed.addons || ""),
      warranty: String(parsed.warranty || ""),
      details: String(parsed.details || ""),
    };
  } catch {
    return { summary: text, equipment: "", addons: "", warranty: "", details: "" };
  }
}
