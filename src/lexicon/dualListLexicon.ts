/** @file Dual lexicon lists and token allowability checks. */
import type { LexiconPersistence } from "../persistence/lexiconPersistence.js";
import { normalizeText } from "./textNormalizer.js";

/**
 * Lexicon with a deny list and an allow list.
 *
 * The deny list matches by lowercase substring containment in a token; the
 * allow list matches only by exact equality of the normalized token. Storage is
 * delegated to {@link LexiconPersistence}.
 */
export class DualListLexicon {
  private readonly persistence: LexiconPersistence;
  private readonly black: Set<string>;
  private readonly white: Set<string>;

  /**
   * Loads both lists from persistence on construction.
   *
   * @param persistence - List load and save
   */
  constructor(persistence: LexiconPersistence) {
    this.persistence = persistence;
    this.black = new Set(persistence.loadBlack());
    this.white = new Set(persistence.loadWhite());
  }

  /**
   * Deny-list snapshot.
   *
   * @returns A new array of normalized entries
   */
  get blackList(): readonly string[] {
    return [...this.black];
  }

  /**
   * Allow-list snapshot.
   *
   * @returns A new array of normalized entries
   */
  get whiteList(): readonly string[] {
    return [...this.white];
  }

  /**
   * Whether the text contains at least one disallowed token.
   *
   * @param text - Arbitrary string; missing value → `false`
   * @returns `true` when {@link findOffensiveTokens} is non-empty
   */
  isOffensive(text: string | null | undefined): boolean {
    return this.findOffensiveTokens(text).length > 0;
  }

  /**
   * Finds tokens that contain a deny-list entry and are not an exact allow-list
   * match.
   *
   * @param text - Input; empty or missing → `[]`
   * @returns Ordered list of disallowed tokens
   */
  findOffensiveTokens(text: string | null | undefined): readonly string[] {
    if (!text) return [];

    const tokens = normalizeText(text)
      .split(" ")
      .filter((t) => t.length > 0);
    const hits: string[] = [];
    for (const token of tokens) {
      const lower = token.toLowerCase();
      const hitsBlack = [...this.black].some((entry) => lower.includes(entry));
      const exactWhite = this.white.has(lower);
      if (hitsBlack && !exactWhite) hits.push(token);
    }
    return hits;
  }

  /**
   * Moves words to the deny list, removes them from the allow list, and saves
   * both lists.
   *
   * Empty values and the reserved words `white` / `black` are ignored.
   *
   * @param words - Words before normalization
   */
  ban(...words: string[]): void {
    for (const raw of words) {
      const word = this.normalizeWord(raw);
      if (word === null || word === "white" || word === "black") continue;
      this.white.delete(word);
      this.black.add(word);
    }
    this.persist();
  }

  /**
   * Moves words to the allow list, removes them from the deny list, and saves
   * both lists.
   *
   * Empty values and the reserved words `white` / `black` are ignored.
   *
   * @param words - Words before normalization
   */
  allow(...words: string[]): void {
    for (const raw of words) {
      const word = this.normalizeWord(raw);
      if (word === null || word === "white" || word === "black") continue;
      this.black.delete(word);
      this.white.add(word);
    }
    this.persist();
  }

  /**
   * Whether the normalized word is an exact deny-list entry.
   *
   * @param word - Raw word
   * @returns `true` when the normalized form is on the deny list
   */
  isExactBlack(word: string): boolean {
    const n = this.normalizeWord(word);
    return n !== null && this.black.has(n);
  }

  /** Persists the current sets through storage. */
  private persist(): void {
    this.persistence.saveBlack(this.black);
    this.persistence.saveWhite(this.white);
  }

  /**
   * Normalizes a word: trim, lowercase, strip disallowed characters.
   *
   * @param raw - Input; empty → `null`
   * @returns Canonical form or `null`
   */
  private normalizeWord(raw: string | null | undefined): string | null {
    if (!raw || raw.trim().length === 0) return null;
    const n = normalizeText(raw).trim().toLowerCase();
    return n.length === 0 ? null : n;
  }
}
