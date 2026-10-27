/** @file Full-text replacement provider for multiple matches. */

/**
 * Contract for full-text replacement when multiple matches occur.
 *
 * Returning `null` instructs {@link CensorEngine} to fall back to a mild
 * replacement.
 */
export interface JokeProvider {
  /**
   * Returns a full-replacement string, or `null` when none is available.
   *
   * @returns Replacement text or `null`
   */
  getReplacement(): string | null;
}

/**
 * Built-in provider: always returns the marker `` `*censored*` ``.
 *
 * Used by default in {@link CensorEngine} and {@link LexiconGate}.
 */
export class NullJokeProvider implements JokeProvider {
  /** @returns The constant `` `*censored*` `` */
  getReplacement(): string | null {
    return "`*censored*`";
  }
}
