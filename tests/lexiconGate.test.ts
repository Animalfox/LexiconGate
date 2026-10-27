/** @file Tests for the LexiconGate service. */
import { describe, expect, it } from "vitest";
import type { JokeProvider } from "../src/censor/jokeProvider.js";
import { createLexiconGate } from "../src/lexiconGate.js";

/** Deterministic full-replacement provider for tests without randomness. */
class FixedJokeProvider implements JokeProvider {
  /** @param text - Fixed replacement string */
  constructor(private readonly text: string) {}

  /** @returns The predetermined full-replacement text */
  getReplacement(): string | null {
    return this.text;
  }
}

describe("createLexiconGate", () => {
  it("inspect clean text is not offensive", () => {
    const gate = createLexiconGate({ blackList: ["damn"] });
    const result = gate.inspect("ordinary text");
    expect(result.isOffensive).toBe(false);
    expect(result.adminTicket).toBeNull();
  });

  it("exact black censors without admin ticket", () => {
    const gate = createLexiconGate({ blackList: ["damn"] });
    const result = gate.inspect("has damn here");
    expect(result.isOffensive).toBe(true);
    expect(result.censoredDisplayText).not.toBe(result.originalText);
    expect(result.adminTicket).toBeNull();
  });

  it("substring hit not exact black opens admin ticket", () => {
    const gate = createLexiconGate({ blackList: ["damn"] });
    const result = gate.inspect("superdamn in chat");
    expect(result.isOffensive).toBe(true);
    expect(result.adminTicket).not.toBeNull();
    expect(result.adminTicket?.disputedWords).toContain("superdamn");
  });

  it("tryApplyAdminCallback white allows word", () => {
    const gate = createLexiconGate({ blackList: ["damn"] });
    const decision = gate.tryApplyAdminCallback("white damn");
    expect(decision).toEqual({ action: "allow", word: "damn" });
    expect(gate.whiteList).toContain("damn");
    expect(gate.blackList).not.toContain("damn");
  });

  it("three hits uses mega path", () => {
    const gate = createLexiconGate({
      blackList: ["x", "y", "z"],
      jokes: new FixedJokeProvider("JOKE"),
    });
    const result = gate.inspect("x y z");
    expect(result.isOffensive).toBe(true);
    expect(result.usedMegaReplacement).toBe(true);
    expect(result.censoredDisplayText).toBe("JOKE");
  });
});
