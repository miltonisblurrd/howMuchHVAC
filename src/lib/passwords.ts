export const MIN_PASSWORD_LENGTH = 8;

export function validateNewPassword(password: string, confirm?: string) {
  const value = password.trim();
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (confirm !== undefined && value !== confirm) {
    return "Passwords do not match.";
  }
  return null;
}
