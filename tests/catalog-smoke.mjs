import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function evaluate(file) {
  const source = fs.readFileSync(file, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const sandbox = { exports: {} };
  vm.runInNewContext(compiled.outputText, sandbox, { filename: file });
  return sandbox.exports;
}

const { disciplines } = evaluate("src/data.ts");
const { extraChallengesByDiscipline } = evaluate("src/extraChallenges.ts");
const appSource = fs.readFileSync("src/EnhancedApp.tsx", "utf8");

assert.equal(disciplines.length, 7, "the catalog should keep all seven major disciplines");

const ids = new Set();
let total = 0;
for (const discipline of disciplines) {
  const tests = [...discipline.tests, ...(extraChallengesByDiscipline[discipline.id] ?? [])];
  total += tests.length;
  assert.ok(tests.length >= 10, `${discipline.id} should have at least ten drills`);

  const difficulties = new Set(tests.map((test) => test.difficulty));
  for (const expected of ["Foundation", "Core", "Advanced", "Expert"]) {
    assert.ok(difficulties.has(expected), `${discipline.id} should cover ${expected} difficulty`);
  }

  for (const test of tests) {
    assert.ok(test.id.startsWith(`${discipline.id}-`), `${test.id} should be namespaced to ${discipline.id}`);
    assert.ok(!ids.has(test.id), `duplicate challenge id: ${test.id}`);
    ids.add(test.id);
    assert.ok(test.prompt.length >= 80, `${test.id} should contain an interview-grade prompt`);
    assert.ok(test.starter.length >= 60, `${test.id} should contain substantive coaching guidance`);
    assert.ok(test.signal.length >= 35, `${test.id} should explain the interview signal`);
  }
}

assert.ok(total >= 70, "the combined bank should materially exceed the original forty-question catalog");

const recommendedIds = [...appSource.matchAll(/:\s*"([a-z]+-[a-z0-9-]+)"/g)]
  .map(([, id]) => id)
  .filter((id) => id.includes("-"));
for (const id of recommendedIds) {
  if (id.startsWith("mock:")) continue;
  assert.ok(ids.has(id), `company recommendation ${id} must exist in the combined catalog`);
}

for (const discipline of disciplines) {
  const marker = `${discipline.id}: [`;
  assert.ok(appSource.includes(marker), `mock interview prompt bank should cover ${discipline.id}`);
}

console.log(`Validated ${total} combined interview drills across ${disciplines.length} disciplines.`);
