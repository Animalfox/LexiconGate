/** @file Tests for the lexicon and text normalization. */
import { describe, expect, it } from "vitest";
import { DualListLexicon } from "../src/lexicon/dualListLexicon.js";
import { normalizeText } from "../src/lexicon/textNormalizer.js";
import { MemoryLexiconPersistence } from "../src/persistence/lexiconPersistence.js";

describe("DualListLexicon", () => {
  it("marks token containing black entry when not exact white", () => {
    const lexicon = new DualListLexicon(
      new MemoryLexiconPersistence(["damn"], []),
    );
    expect(lexicon.isOffensive("this damn!")).toBe(true);
    expect(lexicon.isOffensive("superdamn")).toBe(true);
  });

  it("exempts exact white tokens", () => {
    const lexicon = new DualListLexicon(
      new MemoryLexiconPersistence(["damn"], ["superdamn"]),
    );
    expect(lexicon.isOffensive("superdamn")).toBe(false);
    expect(lexicon.isOffensive("just damn")).toBe(true);
  });

  it("ban moves from white to black and persists", () => {
    const store = new MemoryLexiconPersistence([], ["word"]);
    const lexicon = new DualListLexicon(store);
    lexicon.ban("word");
    expect(lexicon.blackList).toContain("word");
    expect(lexicon.whiteList).not.toContain("word");
    expect(store.loadBlack()).toContain("word");
  });

  it("normalize strips disallowed symbols", () => {
    expect(normalizeText("hello, world!!!")).toBe("hello world");
  });
});
