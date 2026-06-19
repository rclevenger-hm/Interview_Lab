# Signal Interview Lab

Signal Interview Lab is a React + Vite interview practice site for people preparing for high-bar hiring loops across multiple disciplines.

The app is designed to help users:

- choose a major discipline first
- explore company-aligned interview pathways
- work through graded tests from foundation to expert difficulty
- run a timed mock interview simulation
- adjust a help meter from strict interview mode to learning mode

It currently supports broad preparation across:

- Software Engineering
- Data Science
- Product Management
- Product Design
- DevOps / SRE
- Security Engineering
- QA / Test Engineering

The current experience also includes OpenAI-focused role modules, Oracle-focused DevOps / SRE coverage, and Cerner / Oracle Health interview flows for interviewer-friendly practice setups.

## Features

- Discipline-first pathway selection so prompts and simulator rounds stay relevant
- Company alignment that recommends a matching test for each company within a discipline
- Graded test ladders with Foundation, Core, Advanced, and Expert difficulty
- Interview simulator with round sequencing, timer, answer workspace, and lightweight scoring
- Help meter with device-aware defaults
- Copy/paste, cut, and drop protection inside the answer workspace
- Mobile-aware assistance defaults and responsive layout support
- Quick start behavior that follows the active user selection instead of forcing a single path
- OpenAI-aligned modules for software, product, data/evals, design, SRE, security, and QA interview practice

## Tech Stack

- React 18
- TypeScript
- Vite
- Plain CSS

## Getting Started

### Requirements

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

## GitHub Pages Deployment

This repo is configured for GitHub Pages as a project site at `/Interview_Lab/`.

Deployments run from `.github/workflows/pages.yml` whenever changes are pushed to `main`. The workflow installs dependencies, runs the lightweight data smoke tests, builds the Vite app, and publishes the `dist` folder to GitHub Pages.

## Project Structure

```text
.
├─ src/
│  ├─ App.tsx        # Main application logic and UI flow
│  ├─ data.ts        # Discipline, stage, company, and test definitions
│  ├─ styles.css     # Visual design and responsive layout
│  └─ main.tsx       # App entry point
├─ index.html
├─ package.json
└─ vite.config.ts
```

## Current Product Direction

The repo is set up as a broad interview preparation product first, not a single-company internal tool. The core UX direction is:

- make discipline selection the first meaningful choice
- keep the simulator hidden until a path is selected
- let company selection steer the recommended test
- support both live interview practice and guided learning
- make the interface usable on both desktop and mobile

## Notes

- Most interview content currently lives in `src/data.ts`, so adding new companies, tests, or disciplines is primarily a content-model update.
- Company-specific recommendations are mapped in `src/App.tsx`.
- The scoring and help systems are intentionally lightweight and aimed at guided practice rather than formal evaluation.

## Scripts

- `npm run dev` - start the local development server
- `npm run build` - compile TypeScript and create a production build
- `npm run preview` - serve the production build locally
