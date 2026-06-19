import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const dataSource = fs.readFileSync("src/data.ts", "utf8");
const appSource = fs.readFileSync("src/App.tsx", "utf8");

const compiled = ts.transpileModule(dataSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});

const sandbox = { exports: {} };
vm.runInNewContext(compiled.outputText, sandbox, { filename: "src/data.ts" });

const { disciplines } = sandbox.exports;
assert.ok(Array.isArray(disciplines), "disciplines should export an array");
assert.ok(disciplines.length >= 7, "expected the major interview disciplines");

const testIds = new Set();
const duplicateTestIds = [];

for (const discipline of disciplines) {
  assert.ok(discipline.id, "each discipline needs an id");
  assert.ok(discipline.name, `${discipline.id} needs a display name`);
  assert.ok(discipline.companyFit.length >= 4, `${discipline.id} needs company coverage`);
  assert.ok(discipline.interviewStages.length >= 3, `${discipline.id} needs interview stages`);
  assert.ok(discipline.tests.length >= 4, `${discipline.id} needs a graded test ladder`);

  for (const test of discipline.tests) {
    if (testIds.has(test.id)) {
      duplicateTestIds.push(test.id);
    }

    testIds.add(test.id);
    assert.ok(test.title, `${test.id} needs a title`);
    assert.ok(test.prompt.length > 40, `${test.id} needs a realistic prompt`);
    assert.ok(test.signal, `${test.id} needs a signal`);
    assert.ok(test.starter, `${test.id} needs a starter`);
  }
}

assert.deepEqual(duplicateTestIds, [], "test ids must be unique");

const openAiDisciplines = disciplines
  .filter((discipline) => discipline.companyFit.includes("OpenAI"))
  .map((discipline) => discipline.id)
  .sort();

assert.equal(
  JSON.stringify(openAiDisciplines),
  JSON.stringify(["data", "design", "devops", "product", "qa", "security", "software"]),
  "OpenAI should be available across the major role pathways",
);

const recommendedIds = [...appSource.matchAll(/recommendedTestId:\s+"([^"]+)"/g)].map(
  ([, id]) => id,
);

assert.ok(recommendedIds.length > 0, "company recommendations should be present");

for (const id of recommendedIds) {
  assert.ok(testIds.has(id), `recommended test id ${id} must exist in src/data.ts`);
}

console.log(`Validated ${disciplines.length} disciplines and ${testIds.size} tests.`);
