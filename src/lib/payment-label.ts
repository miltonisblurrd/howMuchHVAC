/** What the customer sees. Internal HM- numbers stay in the office. */
export function customerPaymentLabel(input: {
  description?: string | null;
  amountCents: number;
  priceCents?: number | null;
}) {
  const description = (input.description || "").trim();
  const price = input.priceCents ?? 0;
  const percent =
    price > 0 && input.amountCents > 0
      ? Math.round((input.amountCents / price) * 100)
      : null;

  const kind = /balance|final/i.test(description)
    ? "balance"
    : /progress/i.test(description)
      ? "progress payment"
      : /service call/i.test(description)
        ? "service call"
        : "deposit";

  if (percent && percent > 0 && percent <= 100) {
    return `${percent}% ${kind}`;
  }
  if (description && !/^HM-/i.test(description)) return description;
  return "Payment";
}
