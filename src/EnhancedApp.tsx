import { useEffect, useMemo, useRef, useState } from "react";
import { disciplines } from "./catalog";
import type { Challenge } from "./data";
import {
  bestScoreForChallenge,
  masteryStatus,
  practiceStreak,
  recommendChallenge,
  sanitizeAttempts,
  scoreAnswer,
  summarizeProgress,
  type AttemptRecord,
  type MasteryStatus,
  type SessionFeedback,
} from "./interviewEngine";

const ATTEMPTS_KEY = "signal-interview-lab:v2:attempts";
const PREFS_KEY = "signal-interview-lab:v2:preferences";

const companyRecommendations: Record<string, Record<string, string>> = {
  software: {
    Google: "software-graph-dependency",
    Meta: "software-feed-ranking",
    Amazon: "software-distributed-cache",
    Microsoft: "software-array-window",
    OpenAI: "software-openai-agent-runtime",
  },
  data: {
    Airbnb: "data-funnel-drop",
    Netflix: "data-model-governance",
    Uber: "data-churn-rescue",
    LinkedIn: "data-sql-retention",
    OpenAI: "data-openai-eval-quality",
  },
  product: {
    Stripe: "product-prioritization-grid",
    Notion: "product-creator-workspace",
    OpenAI: "product-openai-agent-launch",
    Figma: "product-improve-checkout",
  },
  design: {
    Apple: "design-onboarding-dropoff",
    Figma: "design-collaboration-surface",
    Dropbox: "design-onboarding-fix",
    Shopify: "design-design-system",
    OpenAI: "design-openai-copilot-workflow",
  },
  devops: {
    Google: "devops-slo-redesign",
    Datadog: "devops-alert-flood",
    Cloudflare: "devops-checkout-outage",
    Shopify: "devops-release-guardrails",
    Oracle: "devops-oracle-db-failover",
    OpenAI: "devops-openai-inference-incident",
    "Cerner / Oracle Health": "devops-cerner-clinical-cutover",
  },
  security: {
    Cloudflare: "security-identity-platform",
    Stripe: "security-admin-tool-review",
    Google: "security-basic-threat-model",
    "Palo Alto Networks": "security-breach-triage",
    OpenAI: "security-openai-prompt-injection",
  },
  qa: {
    Microsoft: "qa-risk-based-plan",
    Atlassian: "qa-automation-stack",
    Shopify: "qa-marketplace-release",
    Adobe: "qa-quality-gate-go-no-go",
    OpenAI: "qa-openai-eval-regression",
    "Cerner / Oracle Health": "qa-cerner-clinical-regression",
  },
};

const mockPromptBank: Record<string, string[][]> = {
  software: [
    [
      "Implement a function that merges overlapping maintenance windows and returns the minimum set of non-overlapping intervals. Explain complexity and edge cases before coding.",
      "Given a stream of events, return the first key whose frequency crosses a threshold within a rolling window. Explain the data structure choices and tests.",
      "Design the algorithm for detecting cycles and producing a deployment order in a dependency graph that changes over time.",
    ],
    [
      "Design a globally distributed notification service supporting email, push, and SMS with user preferences, retries, deduplication, and regional failure isolation.",
      "Design a collaborative document service with low-latency edits, offline clients, conflict resolution, and durable history.",
      "Design a multi-tenant job platform that executes millions of scheduled jobs while enforcing quotas, retries, and idempotency.",
    ],
    [
      "Tell me about a technically correct decision you changed after another engineer challenged your assumptions. What changed your mind?",
      "Describe a production incident where you had incomplete information and strong pressure to act. How did you decide what to do first?",
      "Tell me about a time you improved a system that nobody had explicitly asked you to own. How did you earn support and measure the result?",
    ],
  ],
  data: [
    [
      "A new onboarding flow increased activation but 30-day retention fell. Build the analysis plan, metrics, slices, and hypotheses you would investigate first.",
      "Write the SQL reasoning for identifying users whose weekly engagement declined for three consecutive weeks while accounting for late events.",
      "A marketplace reports higher bookings but lower successful fulfillment. Define the metric tree and the first analyses you would run.",
    ],
    [
      "Design a model and evaluation plan for predicting support escalation risk when labels are delayed and positive cases are rare.",
      "A ranking model improves offline NDCG but hurts a key user metric after launch. Diagnose the discrepancy and define the next experiment.",
      "Design an evaluation system for an AI assistant where quality failures are sparse, subjective, and costly to miss.",
    ],
    [
      "Leadership wants one number that says whether a product is healthy. Explain what you would present, what you would refuse to collapse into one metric, and why.",
      "Tell me about a time your analysis contradicted a strong stakeholder belief. How did you communicate uncertainty and influence the decision?",
      "You discover an important metric has been wrong for months. Walk through how you would validate the issue, communicate it, and repair decision trust.",
    ],
  ],
  product: [
    [
      "Design a product for people who need to coordinate urgent household repairs across multiple service providers. Choose the first user and first release.",
      "Improve the first-week experience for a professional collaboration tool with strong signup but weak return usage.",
      "A mature product has flat growth but high satisfaction among power users. Decide where you would look for the next growth opportunity.",
    ],
    [
      "A team can ship only one of three initiatives: reliability, a growth loop, or enterprise permissions. Build the decision framework and choose one.",
      "A feature launched successfully but support volume doubled. Decide what metrics and evidence determine whether to iterate, roll back, or keep shipping.",
      "Define goals, guardrails, launch stages, and rollback criteria for an AI feature that can take external actions for users.",
    ],
    [
      "Tell me about a time engineering and design strongly disagreed on the right product decision. How did you create alignment without forcing consensus?",
      "Describe a time you killed or significantly reduced a project you had previously supported. What evidence changed your decision?",
      "Tell me about a time you had to communicate an unpopular prioritization decision to a team that had already invested effort.",
    ],
  ],
  design: [
    [
      "Present a project where your first design direction was wrong. Show how research, constraints, or implementation feedback changed the outcome.",
      "Choose one portfolio project and explain the hardest design tradeoff, what alternatives you rejected, and how you know the result worked.",
      "Walk through a project where the shipped result was less polished than you wanted. Explain the decision and what you protected.",
    ],
    [
      "Design a mobile workflow for a caregiver coordinating medication, appointments, and updates with other family members under stressful conditions.",
      "Design a bulk-review experience for an enterprise user who must approve hundreds of AI-suggested changes while preserving control and auditability.",
      "Redesign a permission-sharing experience where users frequently grant broader access than intended and struggle to understand inheritance.",
    ],
    [
      "Tell me about a critique that initially felt wrong but ultimately improved your work. How did you evaluate the feedback?",
      "Describe a time engineering constraints forced a major design change. How did you preserve the user outcome while changing the solution?",
      "Tell me about a time you disagreed with another designer's direction. How did you argue the case and what happened next?",
    ],
  ],
  devops: [
    [
      "A service's latency doubles after a deploy, but CPU and error rate look normal. Walk through your first fifteen minutes of investigation.",
      "A Linux host has high load average, low CPU utilization, and many requests timing out. Explain the commands, signals, and hypotheses you would use.",
      "Kafka consumer lag rises sharply for only a subset of partitions. Explain how you isolate broker, partition, consumer, and downstream causes.",
    ],
    [
      "Design a multi-region service with a 99.99% availability target, safe deployments, dependency isolation, capacity planning, and clear SLO ownership.",
      "Design a Kubernetes platform for hundreds of teams where you need safe multi-tenancy, progressive delivery, observability, and cost controls.",
      "Design a disaster-recovery strategy for a stateful service with strict RPO and RTO requirements but expensive cross-region replication.",
    ],
    [
      "A severe incident was caused by a reasonable change that passed every existing check. Lead the postmortem: what do you examine and what actions do you avoid?",
      "Your team has hundreds of alerts and nobody trusts paging. Explain how you would reduce noise without creating blind spots.",
      "Reliability work keeps losing priority to features. Explain how you would use SLOs, error budgets, and incident evidence to change engineering behavior.",
    ],
  ],
  security: [
    [
      "Threat-model a file upload and sharing feature used by both internal and external users. Prioritize the top threats and controls.",
      "Threat-model a password-reset flow that supports email, support-assisted recovery, and high-value accounts.",
      "Threat-model an AI assistant that can browse internal documents and call tools with the user's permissions.",
    ],
    [
      "Design authentication, authorization, secrets handling, and audit logging for an internal admin platform that can make irreversible customer changes.",
      "Design the security model for a multi-tenant API platform with delegated administrators, service accounts, and third-party integrations.",
      "Design how a company should issue, rotate, scope, and monitor machine credentials across CI/CD and production workloads.",
    ],
    [
      "A privileged employee account appears to have accessed unusual amounts of sensitive data. Walk through triage, containment, evidence preservation, and communication.",
      "An upstream package used by hundreds of services may be compromised. Explain how you determine exposure and coordinate containment.",
      "You find a critical vulnerability hours before a major launch. Explain how you decide whether to block, mitigate, or proceed.",
    ],
  ],
  qa: [
    [
      "Create a risk-based test strategy for a checkout change touching pricing, tax, promotions, and order confirmation under a compressed schedule.",
      "Design test coverage for an API consumed by mobile clients that may remain on old versions for months.",
      "A feature has many permutations across roles and permissions. Explain how you build a compact but defensible test matrix.",
    ],
    [
      "Design an automation architecture for web, mobile, and API surfaces where current end-to-end tests are slow and flaky.",
      "Design a CI quality strategy that keeps feedback under ten minutes while preserving confidence for high-risk releases.",
      "Design test data management for parallel automated suites running across ephemeral environments without cross-test contamination.",
    ],
    [
      "A release has two severe bugs, an 18% latency regression, and strong business pressure to ship. Make the go/no-go recommendation and defend it.",
      "Production shows failures that your test environment cannot reproduce. Explain how you gather evidence, adjust coverage, and decide the next release action.",
      "A flaky test fails 3% of runs but covers a revenue-critical workflow. Decide how it should affect the release gate and what you fix first.",
    ],
  ],
};

type HelpLevel = 0 | 1 | 2 | 3;
type DifficultyFilter = "All" | Challenge["difficulty"];
type StatusFilter = "All" | MasteryStatus;
type PracticeKind = "drill" | "mock";

const helpModes: Array<{ value: HelpLevel; label: string; description: string }> = [
  { value: 0, label: "Live", description: "No rubric or hints until you submit." },
  { value: 1, label: "Nudge", description: "One starting hint, then you own the answer." },
  { value: 2, label: "Coach", description: "See the rubric while you practice." },
  { value: 3, label: "Learn", description: "Full structure before you attempt the round." },
];

function readAttempts(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return sanitizeAttempts(JSON.parse(window.localStorage.getItem(ATTEMPTS_KEY) ?? "[]"));
  } catch {
    return [];
  }
}

function readPreferences() {
  if (typeof window === "undefined") return { disciplineId: "software", company: null as string | null };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? "{}");
    return {
      disciplineId: typeof parsed.disciplineId === "string" ? parsed.disciplineId : "software",
      company: typeof parsed.company === "string" ? parsed.company : null,
    };
  } catch {
    return { disciplineId: "software", company: null as string | null };
  }
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function challengeRubric(challenge: Challenge): string[] {
  const signal = challenge.signal.replace(/^Tests\s+/i, "Demonstrates ").replace(/\.$/, "");
  return [
    "States assumptions and a structured approach before jumping into details",
    signal,
    "Surfaces important edge cases, tradeoffs, risks, and a way to validate the decision",
  ];
}

function challengeFocus(challenge: Challenge) {
  return challenge.signal.replace(/^Tests\s+/i, "").replace(/\.$/, "");
}

function statusClass(status: MasteryStatus) {
  return status.toLowerCase();
}

function buildQueue(challenges: Challenge[], attempts: AttemptRecord[], preferredId?: string | null) {
  const queue: Challenge[] = [];
  let remaining = [...challenges];
  let preferred = preferredId;
  while (queue.length < 3 && remaining.length > 0) {
    const next = recommendChallenge(remaining, attempts, preferred);
    if (!next) break;
    queue.push(next);
    remaining = remaining.filter((challenge) => challenge.id !== next.id);
    preferred = null;
  }
  return queue;
}

function App() {
  const initialPrefs = useMemo(() => readPreferences(), []);
  const [selectedId, setSelectedId] = useState(initialPrefs.disciplineId);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(initialPrefs.company);
  const [attempts, setAttempts] = useState<AttemptRecord[]>(readAttempts);
  const [activeTestId, setActiveTestId] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [practiceKind, setPracticeKind] = useState<PracticeKind>("drill");
  const [activeStage, setActiveStage] = useState(0);
  const [mockPromptIndex, setMockPromptIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [helpLevel, setHelpLevel] = useState<HelpLevel>(1);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const importRef = useRef<HTMLInputElement | null>(null);

  const selectedDiscipline = disciplines.find((discipline) => discipline.id === selectedId) ?? disciplines[0];
  const selectedTests = selectedDiscipline.tests;
  const selectedStage = selectedDiscipline.interviewStages[activeStage] ?? selectedDiscipline.interviewStages[0];
  const recommendedId = selectedCompany
    ? companyRecommendations[selectedDiscipline.id]?.[selectedCompany] ?? null
    : null;
  const activeTest = selectedTests.find((test) => test.id === activeTestId) ?? selectedTests[0];
  const queue = useMemo(
    () => buildQueue(selectedTests, attempts, recommendedId),
    [selectedTests, attempts, recommendedId],
  );
  const progress = useMemo(
    () => summarizeProgress(attempts, selectedTests.map((test) => test.id)),
    [attempts, selectedTests],
  );
  const globalIds = useMemo(() => disciplines.flatMap((discipline) => discipline.tests.map((test) => test.id)), []);
  const globalProgress = useMemo(() => summarizeProgress(attempts, globalIds), [attempts, globalIds]);
  const streak = practiceStreak(attempts);

  const filteredTests = selectedTests.filter((test) => {
    const matchesDifficulty = difficultyFilter === "All" || test.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "All" || masteryStatus(attempts, test.id) === statusFilter;
    const haystack = `${test.title} ${test.prompt} ${test.signal}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    return matchesDifficulty && matchesStatus && matchesQuery;
  });

  const stagePrompts = mockPromptBank[selectedDiscipline.id]?.[activeStage] ?? selectedStage.followUps;
  const mockPrompt = stagePrompts[mockPromptIndex % Math.max(stagePrompts.length, 1)] ?? selectedStage.followUps[0] ?? selectedStage.focus;
  const prompt = practiceKind === "drill" ? activeTest.prompt : mockPrompt;
  const focus = practiceKind === "drill" ? challengeFocus(activeTest) : selectedStage.focus;
  const rubric = practiceKind === "drill" ? challengeRubric(activeTest) : selectedStage.rubric;
  const starter = practiceKind === "drill"
    ? activeTest.starter
    : "Open by framing the problem, state the assumptions that materially affect your answer, and tell the interviewer how you will structure the response.";
  const totalSeconds = practiceKind === "drill" ? 45 * 60 : selectedStage.minutes * 60;
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    const company = selectedCompany && selectedDiscipline.companyFit.includes(selectedCompany)
      ? selectedCompany
      : selectedDiscipline.companyFit[0] ?? null;

    if (company !== selectedCompany) {
      setSelectedCompany(company);
      return;
    }

    if (!selectedTests.some((test) => test.id === activeTestId)) {
      const preferred = company ? companyRecommendations[selectedDiscipline.id]?.[company] : null;
      setActiveTestId(preferred ?? selectedTests[0]?.id ?? "");
    }

    setActiveStage(0);
    setMockPromptIndex(0);
  }, [selectedDiscipline.id, selectedCompany]);

  useEffect(() => {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, 500)));
  }, [attempts]);

  useEffect(() => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ disciplineId: selectedDiscipline.id, company: selectedCompany }));
  }, [selectedDiscipline.id, selectedCompany]);

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  }, [practiceKind, activeTest.id, activeStage, mockPromptIndex, totalSeconds]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const selectChallenge = (challengeId: string) => {
    setActiveTestId(challengeId);
    setPracticeKind("drill");
    window.setTimeout(() => document.getElementById("practice")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const submitAnswer = () => {
    const result = scoreAnswer({ answer, rubric, focus, prompt });
    setFeedback(result);
    setIsRunning(false);

    const now = new Date().toISOString();
    const challengeId = practiceKind === "drill"
      ? activeTest.id
      : `mock:${selectedDiscipline.id}:${activeStage}:${mockPromptIndex}`;
    const attempt: AttemptRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      challengeId,
      disciplineId: selectedDiscipline.id,
      stageName: practiceKind === "drill" ? "Focused drill" : selectedStage.name,
      score: result.overallScore,
      wordCount: result.wordCount,
      helpLevel,
      company: selectedCompany,
      createdAt: now,
    };
    setAttempts((current) => [attempt, ...current].slice(0, 500));
  };

  const nextMockPrompt = () => {
    setMockPromptIndex((current) => current + 1);
  };

  const exportProgress = () => {
    const payload = JSON.stringify(
      {
        version: 2,
        exportedAt: new Date().toISOString(),
        preferences: { disciplineId: selectedDiscipline.id, company: selectedCompany },
        attempts,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `signal-interview-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (file: File | undefined) => {
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const imported = sanitizeAttempts(payload?.attempts ?? payload);
      if (imported.length === 0 && !window.confirm("No valid attempts were found. Replace current progress with an empty history?")) return;
      setAttempts(imported);
    } catch {
      window.alert("That file is not a valid Signal Interview Lab progress export.");
    }
  };

  const resetProgress = () => {
    if (window.confirm("Reset all saved interview attempts on this device? This cannot be undone unless you exported a backup.")) {
      setAttempts([]);
    }
  };

  const recentAttempts = attempts.filter((attempt) => attempt.disciplineId === selectedDiscipline.id).slice(0, 6);

  return (
    <div className="lab-shell">
      <header className="lab-topbar">
        <a className="lab-brand" href="#dashboard" aria-label="Signal Interview Lab home">
          <span className="lab-brand-mark">S</span>
          <span><strong>Signal</strong><small>Interview Lab</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#dashboard">Dashboard</a>
          <a href="#bank">Question bank</a>
          <a href="#practice">Practice</a>
          <a href="#history">History</a>
        </nav>
      </header>

      <main>
        <section className="lab-hero" id="dashboard">
          <div>
            <p className="lab-eyebrow">Interview preparation across the whole hiring loop</p>
            <h1>Practice the role, not just the algorithm.</h1>
            <p className="lab-lede">
              Build durable interview skill with a larger question bank, adaptive practice queue,
              realistic mock rounds, rubric-level scoring, and progress that survives a refresh.
            </p>
          </div>
          <div className="hero-kpis" aria-label="Overall progress">
            <div><strong>{globalProgress.total}</strong><span>curated drills</span></div>
            <div><strong>{globalProgress.masteredCount}</strong><span>mastered</span></div>
            <div><strong>{streak}</strong><span>day streak</span></div>
          </div>
        </section>

        <section className="lab-section role-section" aria-labelledby="role-heading">
          <div className="section-title-row">
            <div>
              <p className="lab-eyebrow">Target</p>
              <h2 id="role-heading">Choose the interview you are actually preparing for.</h2>
            </div>
            <div className="progress-actions">
              <button type="button" onClick={exportProgress}>Export progress</button>
              <button type="button" onClick={() => importRef.current?.click()}>Import</button>
              <button type="button" className="danger-text" onClick={resetProgress}>Reset</button>
              <input
                ref={importRef}
                className="visually-hidden"
                type="file"
                accept="application/json,.json"
                onChange={(event) => void importProgress(event.target.files?.[0])}
              />
            </div>
          </div>

          <div className="role-tabs" role="tablist" aria-label="Interview disciplines">
            {disciplines.map((discipline) => (
              <button
                type="button"
                key={discipline.id}
                className={discipline.id === selectedDiscipline.id ? "selected" : ""}
                onClick={() => setSelectedId(discipline.id)}
              >
                <strong>{discipline.name}</strong>
                <span>{discipline.tag}</span>
              </button>
            ))}
          </div>

          <div className="target-grid">
            <div className="target-card">
              <p className="lab-label">Role focus</p>
              <h3>{selectedDiscipline.name}</h3>
              <p>{selectedDiscipline.summary}</p>
              <div className="track-list">
                {selectedDiscipline.preparationTracks.map((track) => <span key={track}>{track}</span>)}
              </div>
            </div>
            <div className="target-card">
              <p className="lab-label">Company track</p>
              <div className="company-buttons">
                {selectedDiscipline.companyFit.map((company) => (
                  <button
                    key={company}
                    type="button"
                    className={company === selectedCompany ? "selected" : ""}
                    onClick={() => {
                      setSelectedCompany(company);
                      const testId = companyRecommendations[selectedDiscipline.id]?.[company];
                      if (testId) setActiveTestId(testId);
                    }}
                  >
                    {company}
                  </button>
                ))}
              </div>
              <p className="target-note">
                {recommendedId
                  ? `${selectedCompany} has a recommended anchor drill, while the adaptive queue still prioritizes unfinished weak spots.`
                  : "This company uses the role-wide question bank and adaptive queue."}
              </p>
            </div>
          </div>
        </section>

        <section className="lab-section progress-section" aria-labelledby="progress-heading">
          <div className="section-title-row">
            <div>
              <p className="lab-eyebrow">Readiness</p>
              <h2 id="progress-heading">A study plan that reacts to what you have already done.</h2>
            </div>
            <div className="role-progress">
              <span>{progress.masteredCount}/{progress.total} mastered</span>
              <div aria-hidden="true"><i style={{ width: `${progress.total ? (progress.masteredCount / progress.total) * 100 : 0}%` }} /></div>
            </div>
          </div>

          <div className="readiness-grid">
            <article className="metric-card">
              <span>Best-score average</span>
              <strong>{progress.averageBestScore ?? "—"}{progress.averageBestScore !== null ? "%" : ""}</strong>
              <small>Across drills you have attempted</small>
            </article>
            <article className="metric-card">
              <span>Practiced</span>
              <strong>{progress.practicedCount}</strong>
              <small>Attempted but not yet mastered</small>
            </article>
            <article className="metric-card">
              <span>Unseen</span>
              <strong>{progress.newCount}</strong>
              <small>Fresh prompts remaining in this role</small>
            </article>
            <article className="metric-card">
              <span>Attempts</span>
              <strong>{progress.attemptCount}</strong>
              <small>Saved locally on this device</small>
            </article>
          </div>

          <div className="queue-panel">
            <div>
              <p className="lab-label">Next three</p>
              <h3>Adaptive practice queue</h3>
              <p>Company relevance comes first, then unseen foundations and the lowest-scoring practiced skills.</p>
            </div>
            <div className="queue-list">
              {queue.map((challenge, index) => {
                const status = masteryStatus(attempts, challenge.id);
                const best = bestScoreForChallenge(attempts, challenge.id);
                return (
                  <button key={challenge.id} type="button" onClick={() => selectChallenge(challenge.id)}>
                    <span className="queue-index">{index + 1}</span>
                    <span className="queue-copy"><strong>{challenge.title}</strong><small>{challenge.difficulty} · {status}{best !== null ? ` · best ${best}` : ""}</small></span>
                    <span aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lab-section" id="bank" aria-labelledby="bank-heading">
          <div className="section-title-row">
            <div>
              <p className="lab-eyebrow">Question bank</p>
              <h2 id="bank-heading">Find the weak spot instead of scrolling blindly.</h2>
            </div>
            <span className="result-count">{filteredTests.length} of {selectedTests.length} drills</span>
          </div>

          <div className="bank-filters">
            <label>
              <span>Search</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Kubernetes, SQL, tradeoffs" />
            </label>
            <label>
              <span>Difficulty</span>
              <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value as DifficultyFilter)}>
                <option>All</option><option>Foundation</option><option>Core</option><option>Advanced</option><option>Expert</option>
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
                <option>All</option><option>New</option><option>Practiced</option><option>Mastered</option>
              </select>
            </label>
          </div>

          <div className="challenge-table" role="list">
            {filteredTests.map((test) => {
              const status = masteryStatus(attempts, test.id);
              const best = bestScoreForChallenge(attempts, test.id);
              const company = Object.entries(companyRecommendations[selectedDiscipline.id] ?? {}).find(([, id]) => id === test.id)?.[0];
              return (
                <button key={test.id} type="button" className="challenge-row" onClick={() => selectChallenge(test.id)} role="listitem">
                  <span className={`status-dot ${statusClass(status)}`} aria-label={status} />
                  <span className="challenge-main">
                    <strong>{test.title}</strong>
                    <small>{test.signal}</small>
                  </span>
                  <span className="challenge-meta"><b>{test.difficulty}</b>{company ? <small>{company}</small> : null}</span>
                  <span className="challenge-score">{best === null ? "—" : best}<small>{best === null ? "not tried" : "best"}</small></span>
                  <span className="challenge-arrow" aria-hidden="true">→</span>
                </button>
              );
            })}
            {filteredTests.length === 0 ? <p className="empty-state">No drills match those filters.</p> : null}
          </div>
        </section>

        <section className="lab-section practice-section" id="practice" aria-labelledby="practice-heading">
          <div className="section-title-row">
            <div>
              <p className="lab-eyebrow">Practice room</p>
              <h2 id="practice-heading">Train cold, train coached, then prove you can repeat it.</h2>
            </div>
            <div className="mode-toggle" role="group" aria-label="Practice mode">
              <button type="button" className={practiceKind === "drill" ? "selected" : ""} onClick={() => setPracticeKind("drill")}>Focused drill</button>
              <button type="button" className={practiceKind === "mock" ? "selected" : ""} onClick={() => setPracticeKind("mock")}>Mock interview</button>
            </div>
          </div>

          {practiceKind === "drill" ? (
            <div className="practice-context">
              <div><span className={`status-pill ${statusClass(masteryStatus(attempts, activeTest.id))}`}>{masteryStatus(attempts, activeTest.id)}</span><span>{activeTest.difficulty}</span></div>
              <h3>{activeTest.title}</h3>
              <p>{activeTest.signal}</p>
            </div>
          ) : (
            <div className="mock-stage-bar">
              {selectedDiscipline.interviewStages.map((stage, index) => (
                <button key={stage.name} type="button" className={index === activeStage ? "selected" : ""} onClick={() => { setActiveStage(index); setMockPromptIndex(0); }}>
                  <strong>{stage.name}</strong><small>{stage.duration}</small>
                </button>
              ))}
            </div>
          )}

          <div className="practice-grid">
            <div className="practice-main">
              <div className="prompt-card">
                <div className="prompt-header">
                  <div><p className="lab-label">{practiceKind === "drill" ? "Challenge" : selectedStage.name}</p><h3>{focus}</h3></div>
                  {practiceKind === "mock" ? <button type="button" onClick={nextMockPrompt}>New prompt</button> : null}
                </div>
                <p className="prompt-text">{prompt}</p>
                {helpLevel >= 1 ? <p className="hint"><strong>Starting nudge:</strong> {starter}</p> : null}
                {helpLevel >= 3 ? (
                  <ol className="learning-outline">
                    <li>Frame the objective and state assumptions that change the answer.</li>
                    <li>Walk through the approach in a clear sequence instead of jumping to a conclusion.</li>
                    <li>Name tradeoffs, failure modes, and what evidence would change your decision.</li>
                    <li>Close with validation, monitoring, or the next concrete step.</li>
                  </ol>
                ) : null}
              </div>

              <div className="answer-card">
                <div className="answer-toolbar">
                  <div><span>Timer</span><strong>{formatTimer(timeLeft)}</strong></div>
                  <div><span>Words</span><strong>{wordCount}</strong></div>
                  <div className="timer-actions">
                    <button type="button" onClick={() => setIsRunning((current) => !current)}>{isRunning ? "Pause" : "Start"}</button>
                    <button type="button" onClick={() => { setIsRunning(false); setTimeLeft(totalSeconds); }}>Reset</button>
                  </div>
                </div>
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Answer as if the interviewer is listening. State assumptions, explain the sequence, make tradeoffs explicit, and close with validation."
                />
                <div className="submit-row">
                  <small>Your work is saved only when you score the attempt. Progress stays in this browser unless you export it.</small>
                  <button type="button" onClick={submitAnswer} disabled={wordCount < 12}>Score attempt</button>
                </div>
              </div>
            </div>

            <aside className="coach-panel">
              <p className="lab-label">Help meter</p>
              <div className="help-options">
                {helpModes.map((mode) => (
                  <button key={mode.value} type="button" className={helpLevel === mode.value ? "selected" : ""} onClick={() => setHelpLevel(mode.value)}>
                    <span>{mode.value}</span><strong>{mode.label}</strong><small>{mode.description}</small>
                  </button>
                ))}
              </div>
              {helpLevel >= 2 || feedback ? (
                <div className="rubric-preview">
                  <p className="lab-label">Rubric</p>
                  <ul>{rubric.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ) : (
                <div className="rubric-locked"><strong>Rubric hidden</strong><span>Live and Nudge modes keep evaluation criteria out of view until you submit.</span></div>
              )}
            </aside>
          </div>

          {feedback ? (
            <div className="feedback-card">
              <div className="score-column"><strong>{feedback.overallScore}</strong><span>/ 100</span><small>{feedback.readiness}</small></div>
              <div className="feedback-body">
                <div className="dimension-grid">
                  {Object.entries(feedback.dimensions).map(([name, value]) => (
                    <div key={name}><span>{name.replace(/([A-Z])/g, " $1")}</span><strong>{value}</strong><i><b style={{ width: `${value}%` }} /></i></div>
                  ))}
                </div>
                <div className="feedback-lists">
                  <div><p className="lab-label">Working</p><ul>{feedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><p className="lab-label">Improve next</p><ul>{feedback.misses.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
                <div className="rubric-results">
                  <p className="lab-label">Rubric coverage</p>
                  {feedback.rubricResults.map((item) => (
                    <div key={item.item}><span>{item.item}</span><strong>{item.score}</strong></div>
                  ))}
                </div>
                <p className="next-step"><strong>Next step:</strong> {feedback.nextStep}</p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="lab-section" id="history" aria-labelledby="history-heading">
          <div className="section-title-row">
            <div><p className="lab-eyebrow">History</p><h2 id="history-heading">Recent attempts for {selectedDiscipline.name}.</h2></div>
          </div>
          <div className="history-list">
            {recentAttempts.map((attempt) => {
              const challenge = selectedTests.find((test) => test.id === attempt.challengeId);
              return (
                <div key={attempt.id} className="history-row">
                  <div><strong>{challenge?.title ?? attempt.stageName}</strong><small>{new Date(attempt.createdAt).toLocaleString()} · {attempt.company ?? "role-wide"}</small></div>
                  <div><span>{attempt.wordCount} words</span><span>{helpModes.find((mode) => mode.value === attempt.helpLevel)?.label ?? "Custom"}</span><strong>{attempt.score}</strong></div>
                </div>
              );
            })}
            {recentAttempts.length === 0 ? <p className="empty-state">No attempts yet. Pick a drill from the queue and score your first response.</p> : null}
          </div>
        </section>

      </main>

      <footer className="lab-footer"><span>Signal Interview Lab</span><span>Local-first progress · exportable history · adaptive practice</span></footer>
    </div>
  );
}

export default App;
