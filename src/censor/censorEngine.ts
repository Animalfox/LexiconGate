/** @file Disallowed-token rewriting and public announcement templates. */
import type { DualListLexicon } from "../lexicon/dualListLexicon.js";
import { type JokeProvider, NullJokeProvider } from "./jokeProvider.js";

/** Placeholder inserted before a mild replacement is substituted. */
const PLACEHOLDER = "`{replace}`";

/**
 * Mild replacements; chosen pseudo-randomly when fewer than three matches
 * occur.
 */
const MILD_REPLACEMENTS = [
  "`*bumped*`",
  "`*annoyed*`",
  "`*swearing*`",
  "`*sneezed*`",
  "`*hiccuped*`",
  "`*stumbled*`",
] as const;

/** Result of word-wise text rewriting. */
export type CensorResult = {
  /** Whether the text was rewritten. */
  wasCensored: boolean;
  /** Text for publication. */
  displayText: string;
  /** Tokens judged disallowed, in order of appearance. */
  offensiveTokens: readonly string[];
  /** Whether the whole message was replaced (at least three matches). */
  usedMegaReplacement: boolean;
};

/**
 * Rewrites disallowed tokens and builds template announcements.
 *
 * Does not own lists: receives {@link DualListLexicon} on each `rewrite` call.
 */
export class CensorEngine {
  private readonly jokes: JokeProvider;
  private readonly random: () => number;

  /**
   * @param jokes - Full-replacement provider; defaults to
   *   {@link NullJokeProvider}
   * @param random - Function in `[0, 1)` for template choice; defaults to
   *   `Math.random`
   */
  constructor(jokes?: JokeProvider, random: () => number = Math.random) {
    this.jokes = jokes ?? new NullJokeProvider();
    this.random = random;
  }

  /**
   * Rewrites text when disallowed content is present.
   *
   * With no matches, returns the original text. Otherwise marks tokens and
   * either applies a full replacement (at least three matches) or mild in-place
   * substitutions.
   *
   * @param originalText - Original string (split on spaces)
   * @param lexicon - Lexicon used for checks
   * @returns Rewrite result
   */
  rewrite(originalText: string, lexicon: DualListLexicon): CensorResult {
    if (!lexicon.isOffensive(originalText)) {
      return {
        wasCensored: false,
        displayText: originalText,
        offensiveTokens: [],
        usedMegaReplacement: false,
      };
    }

    const words = originalText.split(" ");
    const offensiveWords: string[] = [];
    let countOfReplaced = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word === undefined || !lexicon.isOffensive(word)) continue;
      countOfReplaced++;
      offensiveWords.push(word);
      words[i] = PLACEHOLDER;
    }

    let display: string;
    let mega = false;
    if (countOfReplaced >= 3) {
      display = this.jokes.getReplacement() ?? this.mildReplacement();
      mega = true;
    } else {
      display = words.join(" ");
      while (display.includes(PLACEHOLDER)) {
        const at = display.indexOf(PLACEHOLDER);
        display =
          display.slice(0, at) +
          this.mildReplacement() +
          display.slice(at + PLACEHOLDER.length);
      }
    }

    return {
      wasCensored: true,
      displayText: display,
      offensiveTokens: offensiveWords,
      usedMegaReplacement: mega,
    };
  }

  /**
   * Random phrase announcing addition to the deny list.
   *
   * @param actorDisplayName - Initiator name for some templates
   * @returns One of the fixed replies
   */
  blackReply(actorDisplayName: string): string {
    const replies = [
      `${actorDisplayName} blocks an unwanted word.`,
      `${actorDisplayName} adds this swear word to the deny list.`,
      "Policy blocks a bad word.",
      "Blocking a vulgar phrase.",
    ];
    return this.pick(replies);
  }

  /**
   * Random phrase announcing addition to the allow list.
   *
   * @param actorDisplayName - Initiator name
   * @param words - Human-readable description of allowed words
   * @returns One of the fixed replies
   */
  whiteReply(actorDisplayName: string, words: string): string {
    const replies = [
      `${actorDisplayName} allows ${words}.`,
      `${actorDisplayName} adds ${words} to the allow list.`,
      `Allowing ${words}.`,
    ];
    return this.pick(replies);
  }

  /**
   * Picks a mild replacement from {@link MILD_REPLACEMENTS}.
   *
   * @returns Replacement string
   */
  private mildReplacement(): string {
    return this.pick(MILD_REPLACEMENTS);
  }

  /**
   * Picks an array element by {@link pickIndex}.
   *
   * @param items - Non-empty set of templates
   * @returns The chosen element
   */
  private pick<T>(items: readonly T[]): T {
    const item = items[this.pickIndex(items.length)];
    if (item === undefined) {
      throw new Error("empty censor template set");
    }
    return item;
  }

  /**
   * Index in `[0, length)` from the injected random source.
   *
   * @param length - Array length (must be greater than zero)
   * @returns Integer index
   */
  private pickIndex(length: number): number {
    return Math.floor(this.random() * length);
  }
}
