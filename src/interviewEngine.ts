export type Difficulty = "Foundation" | "Core" | "Advanced" | "Expert";

export type ChallengeLike = {
  id: string;
  title: string;
  prompt: string;
  difficulty: Difficulty;
};

export type AttemptRecord = {
  id: string;
  challengeId: string;
  disciplineId: string;
  stageName: string;
  score: number;
  wordCount: number;
  helpLevel: number;
  company?: string | null;
  createdAt: string;
};

export type RubricResult = {
  item: string;
  score: number;
  matchedKeywords: string[];
};

export type SessionFeedback = {
  overallScore: number;
  readiness: string;
  strengths: string[];
  misses: string[];
  nextStep: string;
  wordCount: number;
  dimensions: {
    depth: number;
    structure: number;
    rubricCoverage: number;
    decisionQuality: number;
  };
  rubricResults: RubricResult[];
};

const readinessBands = [
  { threshold: 88, label: "Final-round ready" },
  { threshold: 76, label: "Strong interview signal" },
  { threshold: 64, label: "Competitive, with clear gaps" },
  { threshold: 48, label: "Developing interview signal" },
  { threshold: 0, label: "Needs another pass" },
];

const stopWords = new Set([
  "about", "after", "again", "also", "among", "around", "because", "before",
  "being", "between", "could", "does", "from", "have", "into", "more", "most",
  "other", "over", "should", "than", "that", "their", "there", "these", "they",
  "this", "through", "under", "using", "very", "what", "when", "where", "which",
  "while", "with", "would", "your", "clear", "shows", "show", "uses", "instead",
  "round", "answer", "explains", "explain", "candidate", "candidates",
]);

const structureMarkers = [
  "first", "second", "then", "next", "finally", "because", "therefore", "assume",
  "assumption", "constraint", "tradeoff", "tradeoffs", "risk", "impact", "metric",
  "measure", "validate", "test", "monitor", "rollback", "alternative", "decision",
];

const decisionMarkers = [
  "customer", "user", "impact", "priority", "prioritize", "risk", "tradeoff",
  "constraint", "latency", "availability", "cost", "security", "quality", "metric",
  "monitor", "rollback", "experiment", "validate", "evidence", "because", "result",
];

export function tokenize(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9][a-z0-9-]*/g) ?? [];
}

export function extractKeywords(value: string, limit = 12): string[] {
  const counts = new Map<string, number>();
  for (const token of tokenize(value)) {
    if (token.length < 4 || stopWords.has(token) || /^\d+$/.test(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([token]) => token);
}

function markerScore(tokens: Set<string>, markers: string[], weight: number): number {
  const matches = markers.reduce((count, marker) => count + (tokens.has(marker) ? 1 : 0), 0);
  return Math.min(100, Math.round(matches * weight));
}

function depthScore(wordCount: number): number {
  if (wordCount < 15) return Math.round((wordCount / 15) * 20);
  if (wordCount < 50) return 20 + Math.round(((wordCount - 15) / 35) * 40);
  if (wordCount < 110) return 60 + Math.round(((wordCount - 50) / 60) * 30);
  if (wordCount <= 360) return 100;
  if (wordCount <= 600) return Math.max(82, 100 - Math.round((wordCount - 360) / 14));
  return 78;
}

function scoreRubricItem(answerTokens: Set<string>, item: string): RubricResult {
  const keywords = extractKeywords(item, 8);
  const matchedKeywords = keywords.filter((keyword) => answerTokens.has(keyword));
  const target = Math.max(1, Math.min(3, Math.ceil(keywords.length * 0.35)));
  const score = keywords.length === 0
    ? 50
    : Math.min(100, Math.round((matchedKeywords.length / target) * 100));

  return { item, score, matchedKeywords };
}

export function scoreAnswer(input: {
  answer: string;
  rubric: string[];
  focus: string;
  prompt?: string;
}): SessionFeedback {
  const answer = input.answer.trim();
  const words = tokenize(answer);
  const wordCount = words.length;
  const answerTokens = new Set(words);

  const depth = depthScore(wordCount);
  const structure = markerScore(answerTokens, structureMarkers, 11);
  const rubricResults = input.rubric.map((item) => scoreRubricItem(answerTokens, item));
  const rubricCoverage = rubricResults.length > 0
    ? Math.round(rubricResults.reduce((sum, item) => sum + item.score, 0) / rubricResults.length)
    : 50;

  const focusKeywords = extractKeywords(`${input.focus} ${input.prompt ?? ""}`, 10);
  const focusMatches = focusKeywords.filter((keyword) => answerTokens.has(keyword)).length;
  const focusScore = focusKeywords.length === 0
    ? 50
    : Math.min(100, Math.round((focusMatches / Math.min(4, focusKeywords.length)) * 100));
  const decisionLanguage = markerScore(answerTokens, decisionMarkers, 9);
  const decisionQuality = Math.round(decisionLanguage * 0.55 + focusScore * 0.45);

  let overallScore = Math.round(
    depth * 0.18 + structure * 0.22 + rubricCoverage * 0.40 + decisionQuality * 0.20,
  );

  if (wordCount < 20) overallScore = Math.min(overallScore, 38);
  else if (wordCount < 45) overallScore = Math.min(overallScore, 58);
  else if (wordCount < 70) overallScore = Math.min(overallScore, 72);

  overallScore = Math.max(0, Math.min(100, overallScore));
  const readiness = readinessBands.find((band) => overallScore >= band.threshold)?.label ?? "Needs another pass";

  const strengths: string[] = [];
  const misses: string[] = [];

  if (depth >= 85) strengths.push("Your answer has enough depth to expose your reasoning and tradeoffs.");
  else misses.push("Add enough detail for an interviewer to evaluate how you reached the conclusion.");

  if (structure >= 65) strengths.push("Your sequencing and signposting make the response easy to follow under interview pressure.");
  else misses.push("Use explicit sequencing, assumptions, constraints, and tradeoffs so the reasoning is easier to follow.");

  if (rubricCoverage >= 72) strengths.push("You covered most of the signals the interviewer is evaluating.");
  else {
    const weakest = [...rubricResults].sort((a, b) => a.score - b.score)[0];
    misses.push(weakest ? `Strengthen this interview signal: ${weakest.item}.` : "Address the stated interview rubric more directly.");
  }

  if (decisionQuality >= 70) strengths.push("You connected technical or product choices to impact, risk, and validation.");
  else misses.push(`Tie the answer more directly to the round focus: ${input.focus}.`);

  let nextStep = "Repeat the round in Live mode and aim for the same coverage with a tighter opening.";
  if (overallScore < 48) nextStep = "Use Coach mode once, rebuild the answer around the rubric, then retry without help.";
  else if (overallScore < 64) nextStep = "Retry the same prompt and explicitly address the weakest rubric item before changing problems.";
  else if (overallScore < 76) nextStep = "Run one more pass with less help and sharpen the tradeoffs and closing recommendation.";
  else if (overallScore >= 88) nextStep = "Move to a harder or unseen prompt and preserve the same clarity under less familiar conditions.";

  return {
    overallScore,
    readiness,
    strengths: strengths.slice(0, 3),
    misses: misses.slice(0, 3),
    nextStep,
    wordCount,
    dimensions: { depth, structure, rubricCoverage, decisionQuality },
    rubricResults,
  };
}

export type MasteryStatus = "New" | "Practiced" | "Mastered";

export function attemptsForChallenge(attempts: AttemptRecord[], challengeId: string): AttemptRecord[] {
  return attempts.filter((attempt) => attempt.challengeId === challengeId);
}

export function bestScoreForChallenge(attempts: AttemptRecord[], challengeId: string): number | null {
  const scores = attemptsForChallenge(attempts, challengeId).map((attempt) => attempt.score);
  return scores.length ? Math.max(...scores) : null;
}

export function masteryStatus(attempts: AttemptRecord[], challengeId: string): MasteryStatus {
  const challengeAttempts = attemptsForChallenge(attempts, challengeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (challengeAttempts.length === 0) return "New";

  const best = Math.max(...challengeAttempts.map((attempt) => attempt.score));
  const recent = challengeAttempts.slice(0, 3);
  const recentAverage = recent.reduce((sum, attempt) => sum + attempt.score, 0) / recent.length;
  return best >= 85 && recentAverage >= 74 ? "Mastered" : "Practiced";
}

const difficultyRank: Record<Difficulty, number> = {
  Foundation: 0,
  Core: 1,
  Advanced: 2,
  Expert: 3,
};

export function recommendChallenge<T extends ChallengeLike>(
  challenges: T[],
  attempts: AttemptRecord[],
  preferredChallengeId?: string | null,
): T | null {
  if (challenges.length === 0) return null;

  if (preferredChallengeId) {
    const preferred = challenges.find((challenge) => challenge.id === preferredChallengeId);
    if (preferred && masteryStatus(attempts, preferred.id) !== "Mastered") return preferred;
  }

  const scored = challenges.map((challenge) => {
    const challengeAttempts = attemptsForChallenge(attempts, challenge.id);
    const status = masteryStatus(attempts, challenge.id);
    const best = bestScoreForChallenge(attempts, challenge.id);
    const lastAttempt = challengeAttempts
      .map((attempt) => attempt.createdAt)
      .sort()
      .at(-1) ?? "";

    return {
      challenge,
      status,
      attemptCount: challengeAttempts.length,
      best: best ?? -1,
      lastAttempt,
      difficulty: difficultyRank[challenge.difficulty],
    };
  });

  scored.sort((a, b) => {
    const statusRank = { New: 0, Practiced: 1, Mastered: 2 } as const;
    if (statusRank[a.status] !== statusRank[b.status]) return statusRank[a.status] - statusRank[b.status];
    if (a.status === "New" && a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
    if (a.best !== b.best) return a.best - b.best;
    if (a.attemptCount !== b.attemptCount) return a.attemptCount - b.attemptCount;
    return a.lastAttempt.localeCompare(b.lastAttempt);
  });

  return scored[0]?.challenge ?? challenges[0];
}

export function summarizeProgress(attempts: AttemptRecord[], challengeIds: string[]) {
  const statuses = challengeIds.map((id) => masteryStatus(attempts, id));
  const relevantAttempts = attempts.filter((attempt) => challengeIds.includes(attempt.challengeId));
  const bestScores = challengeIds
    .map((id) => bestScoreForChallenge(attempts, id))
    .filter((score): score is number => score !== null);

  return {
    total: challengeIds.length,
    newCount: statuses.filter((status) => status === "New").length,
    practicedCount: statuses.filter((status) => status === "Practiced").length,
    masteredCount: statuses.filter((status) => status === "Mastered").length,
    attemptCount: relevantAttempts.length,
    averageBestScore: bestScores.length
      ? Math.round(bestScores.reduce((sum, score) => sum + score, 0) / bestScores.length)
      : null,
  };
}

function dateKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function practiceStreak(attempts: AttemptRecord[], now = new Date()): number {
  if (attempts.length === 0) return 0;
  const days = new Set(attempts.map((attempt) => dateKey(attempt.createdAt)));
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!days.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dateKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function sanitizeAttempts(value: unknown): AttemptRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is AttemptRecord => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<AttemptRecord>;
    return Boolean(
      typeof candidate.id === "string" &&
      typeof candidate.challengeId === "string" &&
      typeof candidate.disciplineId === "string" &&
      typeof candidate.stageName === "string" &&
      typeof candidate.score === "number" &&
      candidate.score >= 0 && candidate.score <= 100 &&
      typeof candidate.wordCount === "number" &&
      typeof candidate.helpLevel === "number" &&
      typeof candidate.createdAt === "string" &&
      !Number.isNaN(Date.parse(candidate.createdAt))
    );
  });
}
