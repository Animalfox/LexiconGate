/** @file Administrative review of disputed tokens. */
import type { DualListLexicon } from "../lexicon/dualListLexicon.js";
import { normalizeText } from "../lexicon/textNormalizer.js";

/**
 * Administrative decision for a disputed word.
 *
 * `allow` — allow list (callback prefix `white`); `ban` — deny list (callback
 * prefix `black`).
 */
export type AdminReviewAction = "allow" | "ban";

/** Allow and ban button payloads for one word. */
export type AdminReviewButton = {
  /** Normalized disputed word. */
  word: string;
  /** Allow decision string: `white <word>`. */
  allowCallback: string;
  /** Ban decision string: `black <word>`. */
  banCallback: string;
};

/** Review ticket: original message, disputed words, and buttons. */
export type AdminReviewTicket = {
  /** Original message text. */
  originalMessage: string;
  /** Disputed words that do not match the deny list exactly. */
  disputedWords: readonly string[];
  /** Buttons for each disputed word. */
  buttons: readonly AdminReviewButton[];
};

/** Parsed administrative decision. */
export type AdminReviewDecision = {
  /** Action after mapping `white` → `allow`, `black` → `ban`. */
  action: AdminReviewAction;
  /** Word from the decision string tail. */
  word: string;
};

/**
 * Builds review tickets and parses decision strings without mutating lists.
 * List updates are performed by {@link LexiconGate}.
 */
export class AdminReview {
  /**
   * Builds a ticket from tokens judged disallowed.
   *
   * Tokens are normalized and deduplicated; exact deny-list matches are
   * dropped. Returns `null` when the disputed set is empty.
   *
   * @param originalMessage - Original text
   * @param offensiveTokens - Tokens after inspection
   * @param lexicon - Lexicon for exact-match checks
   * @returns Ticket or `null`
   */
  buildTicket(
    originalMessage: string,
    offensiveTokens: readonly string[],
    lexicon: DualListLexicon,
  ): AdminReviewTicket | null {
    const disputed = [
      ...new Set(
        offensiveTokens
          .map((t) => normalizeText(t).trim().toLowerCase())
          .filter((t) => t.length > 0)
          .filter((t) => !lexicon.isExactBlack(t)),
      ),
    ];

    if (disputed.length === 0) return null;

    const buttons = disputed.map((word) => ({
      word,
      allowCallback: `white ${word}`,
      banCallback: `black ${word}`,
    }));

    return { originalMessage, disputedWords: disputed, buttons };
  }

  /**
   * Parses an administrative decision string.
   *
   * Expected format: `white <word…>` or `black <word…>`. The tail after the
   * first token forms the word (phrases are allowed).
   *
   * @param callbackData - Raw string; empty → `null`
   * @returns Decision or `null` on invalid format
   */
  tryParseCallback(
    callbackData: string | null | undefined,
  ): AdminReviewDecision | null {
    if (!callbackData || callbackData.trim().length === 0) return null;

    const parts = normalizeText(callbackData)
      .toLowerCase()
      .split(" ")
      .filter((p) => p.length > 0);
    if (parts.length < 2) return null;

    const action = parts[0];
    const word = parts.slice(1).join(" ");
    if ((action !== "white" && action !== "black") || word.length === 0)
      return null;

    return {
      action: action === "white" ? "allow" : "ban",
      word,
    };
  }
}
