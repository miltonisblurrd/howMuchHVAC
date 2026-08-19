export function isDevLoginEnabled() {
  return process.env.NODE_ENV === "development";
}

export const DEV_LOGIN_PASSWORD = process.env.DEV_LOGIN_PASSWORD || "howmuch-dev";
