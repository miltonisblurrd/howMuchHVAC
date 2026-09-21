/** California home-improvement lock-in: 10% of the price, never more than $1,000. */
export const MAX_DEPOSIT_CENTS = 100_000;

export function lockInDepositCents(priceCents: number) {
  if (priceCents <= 0) return 0;
  return Math.min(Math.round(priceCents * 0.1), MAX_DEPOSIT_CENTS);
}

export const LOCK_IN_COPY =
  "A deposit locks this price and this install date. The deposit is 10% of the price, up to $1,000. Without a deposit, nothing is held, and the next deposit takes the date.";
