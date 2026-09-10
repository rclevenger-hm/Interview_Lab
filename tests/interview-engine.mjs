import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync("src/interviewEngine.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const sandbox = { exports: {} };
vm.runInNewContext(compiled.outputText, sandbox, { filename: "src/interviewEngine.ts" });
const engine = sandbox.exports;

const rubric = [
  "Explains a clear algorithm before diving into syntax",
  "Names tradeoffs around time, space, and correctness",
  "Surfaces edge cases and validates assumptions",
];

const weak = engine.scoreAnswer({
  answer: "I would use a map and return the result.",
  rubric,
  focus: "Algorithms, edge cases, and implementation clarity",
  prompt: "Design an algorithm and explain tests.",
});

const strong = engine.scoreAnswer({
  answer: `First I would clarify the input constraints and define the correctness invariant. Then I would use a hash map so each lookup is constant time on average, while preserving a simple iteration order. The main tradeoff is extra memory versus avoiding repeated scans. I would validate empty input, duplicate values, very large input, and boundary cases. Because correctness matters more than premature optimization, I would start with the linear-time approach, measure memory impact, and only change it if the constraints require it. Finally I would test representative examples, edge cases, and a stress case, then explain the time and space complexity before shipping.`,
  rubric,
  focus: "Algorithms, edge cases, and implementation clarity",
  prompt: "Design an algorithm and explain tests.",
});

assert.ok(weak.overallScore < 60, "a short generic answer should not receive a strong score");
assert.ok(strong.overallScore > weak.overallScore, "structured rubric-aligned answers should score better");
assert.equal(strong.rubricResults.length, rubric.length, "every rubric item should be scored");
assert.ok(strong.dimensions.structure >= weak.dimensions.structure, "structure dimension should reward explicit sequencing");

const attempts = [
  { id: "a1", challengeId: "one", disciplineId: "software", stageName: "Focused drill", score: 88, wordCount: 140, helpLevel: 0, createdAt: "2026-09-03T12:00:00Z" },
  { id: "a2", challengeId: "one", disciplineId: "software", stageName: "Focused drill", score: 82, wordCount: 150, helpLevel: 0, createdAt: "2026-09-04T12:00:00Z" },
  { id: "a3", challengeId: "one", disciplineId: "software", stageName: "Focused drill", score: 79, wordCount: 160, helpLevel: 0, createdAt: "2026-09-05T12:00:00Z" },
  { id: "a4", challengeId: "two", disciplineId: "software", stageName: "Focused drill", score: 61, wordCount: 100, helpLevel: 2, createdAt: "2026-09-05T13:00:00Z" },
];

assert.equal(engine.masteryStatus(attempts, "one"), "Mastered", "consistent strong scores should produce mastery");
assert.equal(engine.masteryStatus(attempts, "two"), "Practiced", "an attempted weak challenge should remain practiced");
assert.equal(engine.masteryStatus(attempts, "three"), "New", "unattempted challenges should be new");
assert.equal(engine.bestScoreForChallenge(attempts, "one"), 88, "best score should be retained");

const challenges = [
  { id: "one", title: "One", prompt: "x", difficulty: "Foundation" },
  { id: "two", title: "Two", prompt: "x", difficulty: "Core" },
  { id: "three", title: "Three", prompt: "x", difficulty: "Advanced" },
];

assert.equal(engine.recommendChallenge(challenges, attempts, "two").id, "two", "an unmastered company-preferred challenge should win");
assert.equal(engine.recommendChallenge(challenges, attempts, "one").id, "three", "a mastered preferred challenge should yield to an unseen challenge");

const progress = engine.summarizeProgress(attempts, ["one", "two", "three"]);
assert.deepEqual(
  { mastered: progress.masteredCount, practiced: progress.practicedCount, fresh: progress.newCount },
  { mastered: 1, practiced: 1, fresh: 1 },
  "progress summary should separate mastery states",
);

assert.equal(engine.practiceStreak(attempts, new Date("2026-09-05T18:00:00Z")), 3, "practice streak should count consecutive active days");
assert.equal(engine.sanitizeAttempts([{ nope: true }]).length, 0, "invalid saved attempts should be discarded");
assert.equal(engine.sanitizeAttempts(attempts).length, attempts.length, "valid attempts should survive sanitization");

const corruptAttempts = [
  { ...attempts[0], id: "" },
  { ...attempts[0], wordCount: -1 },
  { ...attempts[0], wordCount: 12.5 },
  { ...attempts[0], helpLevel: -1 },
  { ...attempts[0], helpLevel: Number.NaN },
];
assert.equal(engine.sanitizeAttempts(corruptAttempts).length, 0, "corrupt saved attempt metrics and empty identifiers should be discarded");

console.log("Interview engine behavior validated.");
