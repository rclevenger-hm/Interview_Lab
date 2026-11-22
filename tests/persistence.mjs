import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { sanitizeAttempts } from "../src/interviewEngine.ts";

const attempt = {
  id: "saved-attempt",
  challengeId: "software-array-window",
  disciplineId: "software",
  stageName: "Focused drill",
  score: 88,
  wordCount: 140,
  helpLevel: 0,
  createdAt: "2026-09-03T12:00:00Z",
};

const invalidCompanies = [{ name: "Google" }, ["Google"], 42, true, false];
for (const company of invalidCompanies) {
  const input = { ...attempt, company };
  const normalized = sanitizeAttempts([input]);
  assert.deepEqual(normalized, [{ ...attempt, company: null }],
    "malformed optional company metadata must not discard an otherwise valid attempt");
  assert.equal(input.company, company, "sanitization must not mutate its input");
  assert.deepEqual(sanitizeAttempts(normalized), normalized, "sanitization must be idempotent");
  assert.deepEqual(sanitizeAttempts(JSON.parse(JSON.stringify(normalized))), normalized,
    "saving and reloading normalized progress must preserve the attempt");
}

for (const company of ["Google", "Custom company", "", null, undefined]) {
  assert.deepEqual(sanitizeAttempts([{ ...attempt, company }]), [{ ...attempt, company: company ?? null }],
    "valid company names and legacy missing/null company metadata must remain compatible");
}
assert.deepEqual(sanitizeAttempts([attempt]), [{ ...attempt, company: null }],
  "legacy records without a company must survive");
assert.equal(sanitizeAttempts([{ ...attempt, company: {}, score: -1 }]).length, 0,
  "repairing optional metadata must not relax required-field validation");

// Exercise the real saved-history loader and React view, not just the sanitizer.
// Vite transforms TSX in middleware mode without opening a listening server.
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
try {
  const { default: App } = await server.ssrLoadModule("/src/EnhancedApp.tsx");
  const savedAttempts = [
    { ...attempt, id: "legacy" },
    { ...attempt, id: "company", company: "Custom company" },
    { ...attempt, id: "object", company: { name: "Google" } },
    { ...attempt, id: "array", company: ["Google"] },
  ];

  for (const records of [savedAttempts, sanitizeAttempts(savedAttempts)]) {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: (key) => key === "signal-interview-lab:v2:attempts"
            ? JSON.stringify(records)
            : null,
        },
      },
    });
    const html = renderToStaticMarkup(createElement(App));
    const history = html.match(/<section[^>]+id="history"[\s\S]*?<\/section>/)?.[0];
    assert.ok(history, "saved progress must not prevent the History section from rendering");
    assert.equal((history.match(/class="history-row"/g) ?? []).length, 4,
      "all otherwise valid legacy and repaired attempts must remain visible after loading");
    assert.equal((history.match(/role-wide/g) ?? []).length, 3,
      "missing or malformed company metadata must use the role-wide fallback");
    assert.match(history, /Custom company/, "valid company labels must remain visible");
  }
} finally {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else delete globalThis.window;
  await server.close();
}

console.log("Saved-history compatibility and rendering validated.");
