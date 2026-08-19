export const SKIP_DASH_SKEL_KEY = "hm-skip-dash-skel";
export const SKIP_PORTAL_SKEL_KEY = "hm-skip-portal-skel";

/** Login already had a wait — dashboard should count up, not skeleton. */
export function markSkipSkeleton(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* private mode */
  }
}

export function markSkipDashboardSkeleton() {
  markSkipSkeleton(SKIP_DASH_SKEL_KEY);
}

export function markSkipPortalSkeleton() {
  markSkipSkeleton(SKIP_PORTAL_SKEL_KEY);
}
