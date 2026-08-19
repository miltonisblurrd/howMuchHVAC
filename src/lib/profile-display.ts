export function profileInitials(name: string, email?: string) {
  const source = name.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export const ONBOARDING_STORAGE_KEY = "hm-portal-onboarded";

export function onboardingStorageKey(userId: string) {
  return `${ONBOARDING_STORAGE_KEY}:${userId}`;
}
