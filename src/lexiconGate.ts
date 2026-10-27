/** @file Public LexiconGate text moderation service. */
import {
  AdminReview,
  type AdminReviewDecision,
  type AdminReviewTicket,
} from "./admin/adminReview.js";
import { CensorEngine } from "./censor/censorEngine.js";
import type { JokeProvider } from "./censor/jokeProvider.js";
import { DualListLexicon } from "./lexicon/dualListLexicon.js";
import {
  FileLexiconPersistence,
  type LexiconPersistence,
  MemoryLexiconPersistence,
} from "./persistence/lexiconPersistence.js";

/** Optional extensions shared by both creation modes. */
type LexiconGateSharedOptions = {
  /** Full-text replacement provider for multiple matches. */
  jokes?: JokeProvider;
  /** Random source for announcement templates. */
  random?: () => number;
};

/**
 * Creates the service with in-memory list storage.
 *
 * The `files` field is not allowed in this variant (`never`).
 */
export type LexiconGateMemoryOptions = LexiconGateSharedOptions & {
  /** Initial deny list. */
  blackList?: readonly string[];
  /** Initial allow list. */
  whiteList?: readonly string[];
  /** File paths must not be set in memory mode. */
  files?: never;
};

/**
 * Creates the service with file-backed list storage.
 *
 * The `blackList` and `whiteList` fields are not allowed in this variant
 * (`never`).
 */
export type LexiconGateFileOptions = LexiconGateSharedOptions & {
  /** Paths to the deny-list and allow-list files. */
  files: {
    /** Path to the deny-list file. */
    blackPath: string;
    /** Path to the allow-list file. */
    whitePath: string;
  };
  /** In-memory lists must not be set in file mode. */
  blackList?: never;
  /** In-memory lists must not be set in file mode. */
  whiteList?: never;
};

/** Options for {@link createLexiconGate}: either memory or files, never both. */
export type LexiconGateOptions =
  | LexiconGateMemoryOptions
  | LexiconGateFileOptions;

/**
 * Result of inspecting incoming text.
 *
 * When `isOffensive === false`, replacement and ticket fields are neutral. When
 * `isOffensive === true`, the application usually publishes
 * `censoredDisplayText`; when `adminTicket` is set, it offers admins allow /
 * ban decisions.
 */
export type LexiconInspection = {
  /** Whether disallowed fragments were found. */
  isOffensive: boolean;
  /** Original text unchanged. */
  originalText: string;
  /** Text recommended for publication. */
  censoredDisplayText: string;
  /** Tokens judged disallowed. */
  offensiveTokens: readonly string[];
  /** Whether the entire text was replaced with a joke phrase. */
  usedMegaReplacement: boolean;
  /** Review ticket on inexact match; otherwise `null`. */
  adminTicket: AdminReviewTicket | null;
};

/**
 * Builds a ready LexiconGate service from options.
 *
 * Preferred package entry point: the application does not assemble persistence
 * and internal modules by hand.
 *
 * @param options - Lists, storage files, and optional extensions
 * @returns A {@link LexiconGate} instance
 */
export function createLexiconGate(
  options: LexiconGateOptions = {},
): LexiconGate {
  const persistence: LexiconPersistence =
    "files" in options
      ? new FileLexiconPersistence(
          options.files.blackPath,
          options.files.whitePath,
        )
      : new MemoryLexiconPersistence(
          options.blackList ?? [],
          options.whiteList ?? [],
        );
  return new LexiconGate(persistence, options.jokes, options.random);
}

/**
 * Text moderation service backed by a dual lexicon.
 *
 * Coordinates inspection, token rewriting, and administrative review. Prefer
 * construction via {@link createLexiconGate}.
 */
export class LexiconGate {
  private readonly lexicon: DualListLexicon;
  private readonly censor: CensorEngine;
  private readonly adminReview: AdminReview;

  /**
   * @param persistence - Storage for the deny and allow lists
   * @param jokes - Full-replacement provider; otherwise the built-in neutral
   *   one
   * @param random - Random source for announcement templates
   */
  constructor(
    persistence: LexiconPersistence,
    jokes?: JokeProvider,
    random?: () => number,
  ) {
    this.lexicon = new DualListLexicon(persistence);
    this.censor = new CensorEngine(jokes, random);
    this.adminReview = new AdminReview();
  }

  /**
   * Inspects text and, when needed, builds a rewrite and a review ticket.
   *
   * @param text - Original message string
   * @returns Inspection result for the consuming application
   */
  inspect(text: string): LexiconInspection {
    const censor = this.censor.rewrite(text, this.lexicon);
    if (!censor.wasCensored) {
      return {
        isOffensive: false,
        originalText: text,
        censoredDisplayText: text,
        offensiveTokens: [],
        usedMegaReplacement: false,
        adminTicket: null,
      };
    }

    return {
      isOffensive: true,
      originalText: text,
      censoredDisplayText: censor.displayText,
      offensiveTokens: censor.offensiveTokens,
      usedMegaReplacement: censor.usedMegaReplacement,
      adminTicket: this.adminReview.buildTicket(
        text,
        censor.offensiveTokens,
        this.lexicon,
      ),
    };
  }

  /**
   * Adds words to the deny list and removes them from the allow list.
   *
   * @param words - Words to ban
   */
  banWords(...words: string[]): void {
    this.lexicon.ban(...words);
  }

  /**
   * Adds words to the allow list and removes them from the deny list.
   *
   * @param words - Words to allow
   */
  allowWords(...words: string[]): void {
    this.lexicon.allow(...words);
  }

  /**
   * Builds a public ban announcement phrase.
   *
   * @param actorDisplayName - Display name of the initiator
   * @returns String ready for publication
   */
  announceBan(actorDisplayName: string): string {
    return this.censor.blackReply(actorDisplayName);
  }

  /**
   * Builds a public allow announcement phrase.
   *
   * @param actorDisplayName - Display name of the initiator
   * @param words - Human-readable enumeration of allowed words
   * @returns String ready for publication
   */
  announceAllow(actorDisplayName: string, words: string): string {
    return this.censor.whiteReply(actorDisplayName, words);
  }

  /**
   * Applies an administrative decision from a callback string.
   *
   * @param callbackData - Data of the form `white <word>` / `black <word>`
   * @returns The applied decision, or `null` if the format is unrecognized
   */
  tryApplyAdminCallback(
    callbackData: string | null | undefined,
  ): AdminReviewDecision | null {
    const decision = this.adminReview.tryParseCallback(callbackData);
    if (!decision) return null;

    if (decision.action === "allow") this.lexicon.allow(decision.word);
    else this.lexicon.ban(decision.word);

    return decision;
  }

  /**
   * Current deny-list snapshot.
   *
   * @returns Immutable array of normalized entries
   */
  get blackList(): readonly string[] {
    return this.lexicon.blackList;
  }

  /**
   * Current allow-list snapshot.
   *
   * @returns Immutable array of normalized entries
   */
  get whiteList(): readonly string[] {
    return this.lexicon.whiteList;
  }
}
