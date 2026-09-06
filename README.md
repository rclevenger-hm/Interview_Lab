# Signal Interview Lab

Signal Interview Lab is a React + Vite interview-preparation product for candidates preparing for complete hiring loops, not only algorithm rounds.

It currently supports seven major pathways:

- Software Engineering
- Data Science
- Product Management
- Product Design
- DevOps / SRE
- Security Engineering
- QA / Test Engineering

## What the product does now

The current experience includes:

- **72 curated interview drills** spanning Foundation, Core, Advanced, and Expert difficulty
- **Role-first preparation** across all seven disciplines
- **Company anchor tracks** for companies represented in each role pathway
- **Search and filtering** by text, difficulty, and mastery status
- **Mastery tracking** with New, Practiced, and Mastered states
- **Adaptive next-three queue** that prioritizes company relevance, unseen fundamentals, and weaker attempted material
- **Focused drill mode** for individual interview problems
- **Mock interview mode** with stage-specific prompt banks so coding, system design, behavioral, incident, product, design, and other rounds use the correct rubric
- **Timed answer workspace** with Live, Nudge, Coach, and Learn assistance levels
- **Rubric-level deterministic scoring** across depth, structure, rubric coverage, and decision quality
- **Attempt history and practice streaks**
- **Local-first persistence** with JSON progress export/import
- **Responsive desktop and mobile UI**

## Why it is different from a coding-only prep site

Signal Interview Lab is intended to prepare the whole candidate. Coding interviews matter, but senior hiring loops also evaluate system design, debugging, incidents, reliability, product judgment, experimentation, security reasoning, test strategy, communication, and behavioral evidence. The product therefore treats coding as one interview surface inside a broader readiness model.

## Current architecture

```text
.
├─ src/
│  ├─ EnhancedApp.tsx       # Main customer experience and mock interview flows
│  ├─ catalog.ts            # Combined base + expanded challenge catalog
│  ├─ data.ts               # Core disciplines, stages, companies, and original drills
│  ├─ extraChallenges.ts    # Expanded interview question bank
│  ├─ interviewEngine.ts    # Scoring, mastery, recommendations, streaks, persistence validation
│  ├─ enhanced.css          # Responsive product UI
│  └─ main.tsx              # App entry point
├─ tests/
│  ├─ data-smoke.mjs        # Original data integrity checks
│  ├─ catalog-smoke.mjs     # Catalog depth, difficulty, IDs, company mappings, mock coverage
│  └─ interview-engine.mjs  # Scoring, mastery, recommendations, progress, streak behavior
└─ .github/workflows/
   ├─ ci.yml                # Pull-request test + build gate
   └─ pages.yml             # GitHub Pages deployment
```

## Getting started

### Requirements

- Node.js 18+ (CI uses Node 20)
- npm

### Install and run

```bash
npm install
npm run dev
```

### Test

```bash
npm test
```

The test command validates the original catalog, expanded catalog, company mappings, mock prompt coverage, scoring behavior, mastery behavior, adaptive recommendations, persisted attempt validation, and practice streaks.

### Production build

```bash
npm run build
```

## GitHub Pages

The repository deploys the production `dist` build to the `gh-pages` branch when changes reach `main`. Pull requests run a separate CI workflow first so test and TypeScript/build regressions can be caught before deployment.

## Roadmap toward LeetCode-class depth

The current product now has the study-plan, question-bank, progress, filtering, company-alignment, and simulation foundations needed for a serious interview-prep product. It is intentionally broader than an algorithms-only platform, but it does **not** yet claim parity with a mature coding judge.

The highest-value next milestones are:

1. **Secure multi-language coding judge** — isolated execution workers, hidden/public test cases, CPU/memory/time limits, submission history, and Python/JavaScript/TypeScript/Java/Go/C++ support.
2. **Code editor and technical editorials** — runnable examples, custom test cases, debugging output, complexity analysis, and reviewed solution explanations.
3. **150+ deeply tagged drills** — topics, role level, interview stage, company relevance, recency metadata, prerequisites, and calibrated difficulty.
4. **Account-backed sync** — optional sign-in and cloud progress so candidates can move between devices without manual export/import.
5. **Stronger evaluation services** — server-side rubric evaluation for open-ended answers, calibrated against reviewed exemplars while retaining deterministic product tests.
6. **Personal study plans** — target interview date, available weekly time, weak-skill detection, spaced repetition, and readiness forecasts.

## Product principles

- Do not give a candidate a high score merely for writing a long answer.
- Keep mock prompts aligned with the interview stage that evaluates them.
- Make coaching progressively removable so users can prove the skill without scaffolding.
- Treat progress as mastery over repeated attempts rather than a one-time completion checkbox.
- Keep company-specific content useful without pretending unverifiable prompts are exact confidential interview questions.
- Add a real sandboxed judge before advertising executable coding assessment.
