/** @file Text normalization before matching against lexicon lists. */
/**
 * Characters removed from the input. Latin and Cyrillic letters, digits, and
 * spaces are kept.
 */
const DISALLOWED = /[^a-zA-Zа-яА-ЯёЁ0-9 ]/g;

/**
 * Brings text to a canonical form for tokenization and list comparison.
 *
 * Order: missing value → empty string; newlines → space; strip disallowed
 * characters; collapse repeated spaces. Case is not changed on this step.
 *
 * @param input - Original text
 * @returns Normalized string (possibly empty)
 */
export function normalizeText(input: string | null | undefined): string {
  if (!input) return "";

  let stripped = input.replace(/\r\n|\n|\r/g, " ").replace(DISALLOWED, "");
  while (stripped.includes("  ")) {
    stripped = stripped.replaceAll("  ", " ");
  }
  return stripped;
}
