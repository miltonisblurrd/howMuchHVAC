import Stripe from "stripe";
import { site } from "@/lib/site";

let stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export function siteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || site.url;
}
