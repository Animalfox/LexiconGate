/** @file Persistence for the lexicon deny and allow lists. */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Storage contract: load and fully replace word sets.
 *
 * Implementations accept and return lowercase forms without empty strings.
 */
export interface LexiconPersistence {
  /**
   * Loads the deny list.
   *
   * @returns Immutable snapshot of entries
   */
  loadBlack(): readonly string[];

  /**
   * Loads the allow list.
   *
   * @returns Immutable snapshot of entries
   */
  loadWhite(): readonly string[];

  /**
   * Fully replaces the deny list.
   *
   * @param words - Word collection
   */
  saveBlack(words: Iterable<string>): void;

  /**
   * Fully replaces the allow list.
   *
   * @param words - Word collection
   */
  saveWhite(words: Iterable<string>): void;
}

/**
 * Normalizes a collection to a unique lowercase array without empty strings.
 *
 * @param words - Input; `undefined` → `[]`
 * @returns Deduplicated array of canonical forms
 */
function normalizeAll(words: Iterable<string> | undefined): string[] {
  const out: string[] = [];
  for (const w of words ?? []) {
    const n = w.trim().toLowerCase();
    if (n.length > 0) out.push(n);
  }
  return [...new Set(out)];
}

/**
 * In-process list storage.
 *
 * Contents are lost on restart unless restored elsewhere.
 */
export class MemoryLexiconPersistence implements LexiconPersistence {
  private black: Set<string>;
  private white: Set<string>;

  /**
   * @param black - Initial deny list
   * @param white - Initial allow list
   */
  constructor(black: Iterable<string> = [], white: Iterable<string> = []) {
    this.black = new Set(normalizeAll(black));
    this.white = new Set(normalizeAll(white));
  }

  /** @inheritdoc */
  loadBlack(): readonly string[] {
    return [...this.black];
  }

  /** @inheritdoc */
  loadWhite(): readonly string[] {
    return [...this.white];
  }

  /** @inheritdoc */
  saveBlack(words: Iterable<string>): void {
    this.black = new Set(normalizeAll(words));
  }

  /** @inheritdoc */
  saveWhite(words: Iterable<string>): void {
    this.white = new Set(normalizeAll(words));
  }
}

/**
 * List storage in text files: one normalized word per line.
 *
 * A missing file loads as an empty list. Saving overwrites the file entirely
 * with a trailing newline.
 */
export class FileLexiconPersistence implements LexiconPersistence {
  /**
   * @param blackPath - Path to the deny-list file
   * @param whitePath - Path to the allow-list file
   */
  constructor(
    private readonly blackPath: string,
    private readonly whitePath: string,
  ) {}

  /** @inheritdoc */
  loadBlack(): readonly string[] {
    return this.loadFile(this.blackPath);
  }

  /** @inheritdoc */
  loadWhite(): readonly string[] {
    return this.loadFile(this.whitePath);
  }

  /** @inheritdoc */
  saveBlack(words: Iterable<string>): void {
    writeFileSync(
      this.blackPath,
      `${normalizeAll(words).join("\n")}\n`,
      "utf8",
    );
  }

  /** @inheritdoc */
  saveWhite(words: Iterable<string>): void {
    writeFileSync(
      this.whitePath,
      `${normalizeAll(words).join("\n")}\n`,
      "utf8",
    );
  }

  /**
   * Reads a list file line by line; returns `[]` if the file is missing.
   *
   * @param path - Path to the text file
   * @returns Normalized snapshot
   */
  private loadFile(path: string): readonly string[] {
    if (!existsSync(path)) return [];
    return normalizeAll(readFileSync(path, "utf8").split(/\r?\n/));
  }
}
