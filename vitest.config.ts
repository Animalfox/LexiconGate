/** @file Vitest configuration for the LexiconGate package. */
import { defineConfig } from "vitest/config";

/** Root test-runner configuration. */
export default defineConfig({
  test: {
    /** Specs relative to the repository root. */
    include: ["tests/**/*.test.ts"],
  },
});
