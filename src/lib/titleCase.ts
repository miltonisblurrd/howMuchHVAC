/** Title Case every word; keeps short acronyms uppercase. */
export function titleCaseWords(input: string): string {
  return input.replace(/\b([A-Za-z0-9][A-Za-z0-9'/]*)\b/g, (word) => {
    if (/^(HVAC|AC|OC|LA|SD|IAQ|TXV|CA)$/i.test(word)) return word.toUpperCase();
    if (word.includes("Much")) return word; // How Much?
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}
