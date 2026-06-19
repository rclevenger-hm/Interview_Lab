import { useEffect, useState } from "react";
import { disciplines } from "./data";

const companies = [
  "Google",
  "Meta",
  "Amazon",
  "Oracle",
  "Cerner / Oracle Health",
  "OpenAI",
  "Netflix",
  "Stripe",
  "Airbnb",
  "Figma",
];

const companyAlignment: Record<
  string,
  Record<string, { recommendedTestId: string; emphasis: string }>
> = {
  software: {
    Google: {
      recommendedTestId: "software-graph-dependency",
      emphasis: "Algorithm depth, clean reasoning, and follow-up problem solving.",
    },
    Meta: {
      recommendedTestId: "software-feed-ranking",
      emphasis: "Coding speed, data structures, and practical tradeoff explanation.",
    },
    Amazon: {
      recommendedTestId: "software-distributed-cache",
      emphasis: "Scalable design, ownership tradeoffs, and customer-impact framing.",
    },
    Microsoft: {
      recommendedTestId: "software-array-window",
      emphasis: "Correctness, implementation clarity, and maintainable reasoning.",
    },
    OpenAI: {
      recommendedTestId: "software-openai-agent-runtime",
      emphasis: "AI product engineering, tool orchestration, safety checks, and resilient runtime design.",
    },
  },
  data: {
    Airbnb: {
      recommendedTestId: "data-funnel-drop",
      emphasis: "Product metrics, experimentation, and marketplace-style analysis.",
    },
    Netflix: {
      recommendedTestId: "data-model-governance",
      emphasis: "Decision quality at scale, experimentation, and model performance.",
    },
    Uber: {
      recommendedTestId: "data-churn-rescue",
      emphasis: "Operational data judgment, cohort analysis, and causal reasoning.",
    },
    LinkedIn: {
      recommendedTestId: "data-sql-retention",
      emphasis: "Strong SQL thinking, retention logic, and business storytelling.",
    },
    OpenAI: {
      recommendedTestId: "data-openai-eval-quality",
      emphasis: "Evaluation design, model behavior analysis, and quality measurement under ambiguity.",
    },
  },
  product: {
    Stripe: {
      recommendedTestId: "product-prioritization-grid",
      emphasis: "Execution rigor, tradeoffs, and platform-style product decisions.",
    },
    Notion: {
      recommendedTestId: "product-creator-workspace",
      emphasis: "Product sense, workflow clarity, and taste in the first release.",
    },
    OpenAI: {
      recommendedTestId: "product-openai-agent-launch",
      emphasis: "AI product judgment, responsible launch gates, trust calibration, and metrics.",
    },
    Figma: {
      recommendedTestId: "product-improve-checkout",
      emphasis: "User empathy, craft-aware prioritization, and product behavior metrics.",
    },
  },
  design: {
    Apple: {
      recommendedTestId: "design-onboarding-dropoff",
      emphasis: "Interaction quality, clarity, and high-bar product judgment.",
    },
    Figma: {
      recommendedTestId: "design-collaboration-surface",
      emphasis: "Multi-user workflows, systems thinking, and interaction design depth.",
    },
    Dropbox: {
      recommendedTestId: "design-onboarding-fix",
      emphasis: "Usability, flow simplification, and outcome-oriented iteration.",
    },
    Shopify: {
      recommendedTestId: "design-design-system",
      emphasis: "Systems thinking, platform consistency, and organizational design impact.",
    },
    OpenAI: {
      recommendedTestId: "design-openai-copilot-workflow",
      emphasis: "AI interaction design, user trust, uncertainty handling, and workflow control.",
    },
  },
  devops: {
    Google: {
      recommendedTestId: "devops-slo-redesign",
      emphasis: "Reliability culture, SLO thinking, and operational systems maturity.",
    },
    Datadog: {
      recommendedTestId: "devops-alert-flood",
      emphasis: "Observability signal quality, triage, and incident response habits.",
    },
    Cloudflare: {
      recommendedTestId: "devops-checkout-outage",
      emphasis: "Distributed systems resilience, networking tradeoffs, and fast recovery.",
    },
    Shopify: {
      recommendedTestId: "devops-release-guardrails",
      emphasis: "Release safety, blast-radius reduction, and pragmatic automation.",
    },
    Oracle: {
      recommendedTestId: "devops-oracle-db-failover",
      emphasis:
        "Large-scale data platform reliability across Oracle databases, Kafka pipelines, and Hadoop-backed operational workflows.",
    },
    OpenAI: {
      recommendedTestId: "devops-openai-inference-incident",
      emphasis: "Model-serving reliability, inference capacity, graceful degradation, and launch readiness.",
    },
    "Cerner / Oracle Health": {
      recommendedTestId: "devops-cerner-clinical-cutover",
      emphasis:
        "Clinical-system reliability, patient-impact triage, and calm operational judgment during healthcare workflow disruption.",
    },
  },
  security: {
    Cloudflare: {
      recommendedTestId: "security-identity-platform",
      emphasis: "Infrastructure-aware security architecture and abuse prevention.",
    },
    Stripe: {
      recommendedTestId: "security-admin-tool-review",
      emphasis: "Sensitive-data protection, access control, and operational safeguards.",
    },
    Google: {
      recommendedTestId: "security-basic-threat-model",
      emphasis: "Threat modeling depth, layered controls, and technical clarity.",
    },
    "Palo Alto Networks": {
      recommendedTestId: "security-breach-triage",
      emphasis: "Incident judgment, containment discipline, and risk communication.",
    },
    OpenAI: {
      recommendedTestId: "security-openai-prompt-injection",
      emphasis: "Prompt injection defense, tool abuse prevention, permissions, and audit strategy.",
    },
  },
  qa: {
    Microsoft: {
      recommendedTestId: "qa-risk-based-plan",
      emphasis: "Broad coverage thinking, correctness, and product-level test strategy.",
    },
    Atlassian: {
      recommendedTestId: "qa-automation-stack",
      emphasis: "Maintainable automation, CI trust, and collaboration-friendly test architecture.",
    },
    Shopify: {
      recommendedTestId: "qa-marketplace-release",
      emphasis: "Release confidence across payments, pricing, and cross-surface behavior.",
    },
    Adobe: {
      recommendedTestId: "qa-quality-gate-go-no-go",
      emphasis: "Risk framing, stakeholder communication, and hard release decisions.",
    },
    OpenAI: {
      recommendedTestId: "qa-openai-eval-regression",
      emphasis: "AI evaluation coverage, ambiguous regressions, safety filters, and release confidence.",
    },
    "Cerner / Oracle Health": {
      recommendedTestId: "qa-cerner-clinical-regression",
      emphasis:
        "Workflow-critical testing, patient-safety awareness, and structured interview reasoning under release pressure.",
    },
  },
};

type SessionFeedback = {
  overallScore: number;
  readiness: string;
  strengths: string[];
  misses: string[];
  nextStep: string;
};

type HelpLevel = 0 | 1 | 2 | 3;

const helpModes: Array<{
  value: HelpLevel;
  label: string;
  description: string;
}> = [
  { value: 0, label: "Live", description: "Strict interview mode with no extra help." },
  {
    value: 1,
    label: "Nudge",
    description: "Light interviewer prompts that keep the answer moving without rescuing it.",
  },
  { value: 2, label: "Coach", description: "Show structure and what to cover next." },
  { value: 3, label: "Learn", description: "Full learning support before rerunning the round live." },
];

const readinessBands = [
  { threshold: 85, label: "Final-round ready" },
  { threshold: 70, label: "Strong with a few weak spots" },
  { threshold: 55, label: "Promising, but needs more structure" },
  { threshold: 0, label: "Early draft - keep iterating" },
];

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function scoreAnswer(answer: string, rubric: string[], focus: string): SessionFeedback {
  const normalized = answer.trim().toLowerCase();
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const signals = new Set(
    normalized.match(/[a-z]+/g)?.filter((word) => word.length > 3) ?? [],
  );
  const structureWords = ["first", "then", "because", "tradeoff", "risk", "metric", "user"];
  const structureScore = structureWords.reduce(
    (count, word) => count + (signals.has(word) ? 1 : 0),
    0,
  );
  const focusWords =
    focus
      .toLowerCase()
      .match(/[a-z]+/g)
      ?.filter((word) => word.length > 4)
      .slice(0, 3) ?? [];
  const focusScore = focusWords.reduce(
    (count, word) => count + (signals.has(word) ? 1 : 0),
    0,
  );

  let overallScore = 34;
  overallScore += Math.min(wordCount, 220) * 0.14;
  overallScore += structureScore * 6;
  overallScore += focusScore * 8;
  overallScore = Math.max(28, Math.min(96, Math.round(overallScore)));

  const readiness =
    readinessBands.find((band) => overallScore >= band.threshold)?.label ??
    readinessBands[readinessBands.length - 1].label;

  const strengths: string[] = [];
  const misses: string[] = [];

  if (wordCount >= 110) {
    strengths.push("Your answer had enough detail to feel interview-ready instead of rushed.");
  } else {
    misses.push("Add more depth so the interviewer can see your reasoning, not just your conclusion.");
  }

  if (structureScore >= 3) {
    strengths.push("You used structured language that makes it easier to follow your thinking.");
  } else {
    misses.push("Use signposts like first, then, risk, and tradeoff to make the answer easier to track.");
  }

  if (focusScore >= 1) {
    strengths.push(`You touched the round's focus area around ${focusWords.join(", ")}.`);
  } else {
    misses.push(`Anchor the answer more directly to this round's focus: ${focus}.`);
  }

  const uncoveredRubric = rubric.find((item) => {
    const keywords =
      item
        .toLowerCase()
        .match(/[a-z]+/g)
        ?.filter((word) => word.length > 4) ?? [];

    return !keywords.some((word) => signals.has(word));
  });

  if (uncoveredRubric) {
    misses.push(`You can improve against this rubric item: ${uncoveredRubric}.`);
  } else {
    strengths.push("You touched all of the visible rubric themes at least once.");
  }

  return {
    overallScore,
    readiness,
    strengths: strengths.slice(0, 3),
    misses: misses.slice(0, 3),
    nextStep:
      wordCount >= 110
        ? "Run the round again and tighten the opening 30 seconds so the structure lands even faster."
        : "Try a second draft with a crisp opening, two tradeoffs, and a concrete closing recommendation.",
  };
}

function buildHelpContent(
  helpLevel: HelpLevel,
  prompt: string,
  focus: string,
  starter: string,
  rubric: string[],
  followUps: string[],
) {
  const focusWords =
    focus
      .split(/[,/]+|\band\b/i)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);

  const baseOutline = [
    "Open with the problem framing and your assumptions.",
    `Cover the core focus areas: ${focusWords.join(", ") || focus}.`,
    "Close with tradeoffs, risks, and what you would validate next.",
  ];

  const coachingSteps = rubric.map((item, index) => `${index + 1}. ${item}`);
  const exampleAnswer = [
    `I would start by framing the problem around ${focusWords[0] ?? "the main objective"} and naming the key constraints in the prompt.`,
    "From there, I would structure the answer into three parts: the approach, the main tradeoffs, and how I would validate success.",
    `Specifically for this question, I would make sure to address ${focusWords.join(", ") || focus} before closing with the biggest risk and my next step.`,
  ];

  return {
    title:
      helpLevel === 0
        ? "Interview mode"
        : helpLevel === 1
          ? "Light help"
          : helpLevel === 2
            ? "Coaching mode"
            : "Learning mode",
    summary:
      helpLevel === 0
        ? "Answer the question cold, like a real round."
        : helpLevel === 1
          ? starter
          : helpLevel === 2
            ? `Use this structure while answering: ${baseOutline.join(" ")}`
            : "Study the question with full scaffolding, then practice it again with less help.",
    outline: helpLevel >= 2 ? baseOutline : [],
    rubricPreview: helpLevel >= 1 ? rubric.slice(0, helpLevel === 1 ? 2 : rubric.length) : [],
    followUpHint: helpLevel >= 1 ? followUps[0] : "",
    exampleAnswer: helpLevel === 3 ? exampleAnswer : [],
    promptRewrite:
      helpLevel === 3
        ? `Learning framing: ${prompt} Answer it in a structured way that shows your reasoning, tradeoffs, and decision process.`
        : "",
    coachingSteps: helpLevel === 3 ? coachingSteps : [],
  };
}

function findCompanyForTest(
  disciplineId: string,
  testId: string,
): string | null {
  const entries = Object.entries(companyAlignment[disciplineId] ?? {});
  const match = entries.find(([, config]) => config.recommendedTestId === testId);

  return match?.[0] ?? null;
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [answerNotice, setAnswerNotice] = useState("");
  const [helpLevel, setHelpLevel] = useState<HelpLevel>(1);
  const [helpCustomized, setHelpCustomized] = useState(false);

  const selectedDiscipline =
    disciplines.find((discipline) => discipline.id === selectedId) ?? null;
  const simulatorReady = selectedDiscipline !== null;
  const stage = simulatorReady
    ? selectedDiscipline.interviewStages[activeStage] ?? selectedDiscipline.interviewStages[0]
    : null;
  const activeTest = simulatorReady
    ? selectedDiscipline.tests[activeTestIndex] ?? selectedDiscipline.tests[0]
    : null;
  const companyRecommendation =
    selectedDiscipline && selectedCompany
      ? companyAlignment[selectedDiscipline.id]?.[selectedCompany] ?? null
      : null;
  const companyCoverageComplete = selectedDiscipline
    ? selectedDiscipline.companyFit.every(
        (company) => Boolean(companyAlignment[selectedDiscipline.id]?.[company]),
      )
    : false;
  const totalSeconds = stage ? stage.minutes * 60 : 0;
  const [timeLeft, setTimeLeft] = useState(
    disciplines[0].interviewStages[0].minutes * 60,
  );
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const stageProgress =
    simulatorReady && totalSeconds > 0
      ? Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100))
      : 0;
  const strongestSignal =
    feedback?.strengths[0] ??
    activeTest?.signal ??
    "Pick a path to unlock round guidance.";
  const helpMode = helpModes.find((mode) => mode.value === helpLevel) ?? helpModes[1];
  const quickStartCompany =
    selectedCompany ??
    selectedDiscipline?.companyFit[0] ??
    null;
  const quickStartDisciplineId = selectedDiscipline?.id ?? null;
  const quickStartDisciplineName = selectedDiscipline?.name ?? null;
  const quickStartLabel =
    quickStartCompany && quickStartDisciplineName
      ? `${quickStartCompany} ${quickStartDisciplineName} flow`
      : "Choose a discipline to set a quick start";
  const helpContent = buildHelpContent(
    helpLevel,
    activeTest?.prompt ?? "",
    stage?.focus ?? "",
    activeTest?.starter ?? "",
    stage?.rubric ?? [],
    stage?.followUps ?? [],
  );

  useEffect(() => {
    if (!stage) {
      setAnswer("");
      setFeedback(null);
      setIsRunning(false);
      setAnswerNotice("");
      return;
    }

    setAnswer("");
    setFeedback(null);
    setIsRunning(false);
    setTimeLeft(stage.minutes * 60);
    setAnswerNotice("");
  }, [selectedId, activeStage, activeTestIndex, stage?.minutes]);

  useEffect(() => {
    if (!selectedDiscipline) {
      setSelectedCompany(null);
      return;
    }

    const nextCompany =
      selectedCompany && selectedDiscipline.companyFit.includes(selectedCompany)
        ? selectedCompany
        : selectedDiscipline.companyFit[0] ?? null;

    setSelectedCompany(nextCompany);
  }, [selectedDiscipline, selectedCompany]);

  useEffect(() => {
    if (!selectedDiscipline || !companyRecommendation) {
      return;
    }

    const recommendedIndex = selectedDiscipline.tests.findIndex(
      (test) => test.id === companyRecommendation.recommendedTestId,
    );

    if (recommendedIndex >= 0) {
      setActiveTestIndex(recommendedIndex);
    }
  }, [selectedDiscipline, companyRecommendation]);

  useEffect(() => {
    if (!isRunning || !stage) {
      return undefined;
    }

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
  }, [isRunning, stage]);

  useEffect(() => {
    if (helpCustomized || typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const applyDeviceDefault = (matches: boolean) => {
      setHelpLevel(matches ? 2 : 1);
    };

    applyDeviceDefault(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyDeviceDefault(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [helpCustomized]);

  const blockAnswerTransfer = (message: string) => {
    setAnswerNotice(message);
  };

  const activatePresetPathway = (
    disciplineId: string,
    company: string,
    options?: { stageIndex?: number; help?: HelpLevel },
  ) => {
    setSelectedId(disciplineId);
    setSelectedCompany(company);
    setActiveStage(options?.stageIndex ?? 0);
    setActiveTestIndex(0);
    setFeedback(null);
    setIsRunning(false);
    setAnswer("");
    setAnswerNotice("");

    if (typeof options?.help !== "undefined") {
      setHelpCustomized(true);
      setHelpLevel(options.help);
    }
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <div>
            <p className="eyebrow">Signal Interview Lab</p>
            <p className="microcopy">Prep like the final loop already matters.</p>
          </div>
        </div>
        <nav className="topnav" aria-label="Primary">
          <a href="#pathways">Pathways</a>
          <a href={simulatorReady ? "#simulator" : "#pathways"}>Simulator</a>
          <a href="#blueprint">Blueprint</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Interactive prep for top-tier interview loops</p>
            <h1>
              Choose your path and practice the interviews that actually get used.
            </h1>
            <p className="hero-text">
              Move from graded drills to guided mock interviews across software,
              product, data, design, DevOps, security, and QA.
            </p>
            <div className="hero-actions">
              <a href="#pathways" className="primary-link">
                Explore pathways
              </a>
              <a
                href={simulatorReady ? "#simulator" : "#pathways"}
                className="secondary-link"
              >
                {simulatorReady ? "Open the simulator" : "Choose a pathway first"}
              </a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="signal-card">
              <p className="panel-label">Target companies</p>
              <div className="company-grid">
                {(selectedDiscipline?.companyFit ?? companies).map((company) =>
                  selectedDiscipline ? (
                    <button
                      key={company}
                      type="button"
                      className={`company-pill ${selectedCompany === company ? "selected" : ""}`}
                      onClick={() => setSelectedCompany(company)}
                    >
                      {company}
                    </button>
                  ) : (
                    <span key={company}>{company}</span>
                  ),
                )}
              </div>
              {companyRecommendation ? (
                <p className="company-note">
                  <strong>{selectedCompany}</strong>: {companyRecommendation.emphasis}
                </p>
              ) : (
                <p className="company-note">Choose a discipline to unlock company-aligned test guidance.</p>
              )}
            </div>
            {selectedDiscipline ? (
              <div className="signal-card challenge-preview">
                <p className="panel-label">Live challenge preview</p>
                <h2>{activeTest?.title}</h2>
                <p>{activeTest?.prompt}</p>
                <div className="challenge-meta">
                  <span>{activeTest?.difficulty}</span>
                  <span>{activeTest?.signal}</span>
                </div>
              </div>
            ) : (
              <div className="signal-card challenge-preview dormant">
                <p className="panel-label">Live challenge preview</p>
                <h2>Simulator stays hidden until a path is chosen.</h2>
                <p>
                  Select a discipline to reveal the matching rounds, prompts,
                  help meter, and answer workspace.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="pathway-section" id="pathways">
          <div className="section-heading">
            <p className="eyebrow">Major disciplines</p>
            <h2>Choose a discipline to tailor your prep.</h2>
            <p className="section-copy">
              Start with the role you want, then unlock the company set, graded tests, and mock
              interview flow that best match that hiring track.
            </p>
          </div>
          <div className="pathway-utility" aria-label="Quick interview presets">
            <span className="utility-label">Quick start</span>
            <button
              type="button"
              className="utility-chip"
              onClick={() =>
                quickStartDisciplineId && quickStartCompany
                  ? activatePresetPathway(quickStartDisciplineId, quickStartCompany, {
                      stageIndex: 0,
                      help: 1,
                    })
                  : null
              }
              disabled={!quickStartDisciplineId || !quickStartCompany}
            >
              {quickStartLabel}
            </button>
          </div>

          <div className="discipline-tabs" role="tablist" aria-label="Interview disciplines">
            {disciplines.map((discipline) => {
              const selected = discipline.id === selectedDiscipline?.id;

              return (
                <button
                  key={discipline.id}
                  type="button"
                  className={`discipline-tab ${selected ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedId(discipline.id);
                    setActiveStage(0);
                    setActiveTestIndex(0);
                  }}
                  aria-pressed={selected}
                >
                  <span className="tab-name">{discipline.name}</span>
                  <span className="tab-tag">{discipline.tag}</span>
                </button>
              );
            })}
          </div>

          <div className="pathway-layout">
            <article className="pathway-story">
              {selectedDiscipline ? (
                <>
                  <p className="pathway-kicker">{selectedDiscipline.name}</p>
                  <h3>{selectedDiscipline.summary}</h3>
                  <div className="inline-list">
                    {selectedDiscipline.companyFit.map((company) => (
                      <span key={company}>{company}</span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="pathway-kicker">Choose a path</p>
                  <h3>
                    Pick a discipline to reveal the matching prep tracks, interview
                    sequence, and simulator workflow.
                  </h3>
                </>
              )}
            </article>

            <div className="pathway-columns">
              <div>
                <p className="panel-label">Preparation tracks</p>
                <ul className="detail-list">
                  {(selectedDiscipline?.preparationTracks ?? [
                    "Discipline-specific practice tracks appear here after selection.",
                  ]).map((track) => (
                    <li key={track}>{track}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="panel-label">Interview sequence</p>
                <ul className="detail-list">
                  {selectedDiscipline ? (
                    selectedDiscipline.interviewStages.map((item) => (
                      <li key={item.name}>
                        <strong>{item.name}</strong> {"·"} {item.duration}
                      </li>
                    ))
                  ) : (
                    <li>Round-by-round interview stages appear here after a path is selected.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="pathway-section" id="tests">
          <div className="section-heading">
            <p className="eyebrow">Graded Test Bank</p>
            <h2>Build skill through a graded test ladder.</h2>
            <p className="section-copy">
              Each pathway includes beginner-to-advanced drills so users can develop stronger
              judgment, communication, and execution one level at a time.
            </p>
          </div>

          {selectedDiscipline && activeTest ? (
            <div className="pathway-layout">
              <article className="pathway-story">
                <p className="pathway-kicker">{selectedDiscipline.name} test ladder</p>
                <h3>
                  The front page now prioritizes progressive test selection before the deeper
                  simulator so users can understand where they are in the discipline.
                </h3>
                <div className="inline-list">
                  {selectedDiscipline.companyFit.map((company) => (
                    <span key={company}>{company}</span>
                  ))}
                </div>
                <p className="starter-note">
                  {companyCoverageComplete
                    ? "Every company in this discipline now maps to its own aligned test."
                    : "Some company mappings still need to be completed for this discipline."}
                </p>
              </article>

              <div className="pathway-columns">
                <div>
                  <p className="panel-label">Company-aligned tests</p>
                  <div className="discipline-tabs test-ladder">
                    {selectedDiscipline.tests.map((test, index) => (
                      <button
                        key={test.id}
                        type="button"
                        className={`discipline-tab ${index === activeTestIndex ? "selected" : ""}`}
                        onClick={() => setActiveTestIndex(index)}
                        aria-pressed={index === activeTestIndex}
                      >
                        <span className="tab-name">
                          {findCompanyForTest(selectedDiscipline.id, test.id) ?? test.difficulty}
                        </span>
                        <span className="tab-tag">
                          {test.difficulty} · {test.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="workspace-card">
                  <p className="panel-label">Selected test</p>
                  <h3>{activeTest.title}</h3>
                <p className="hero-text">{activeTest.prompt}</p>
                <div className="challenge-meta">
                  <span>{activeTest.difficulty}</span>
                  <span>{activeTest.signal}</span>
                </div>
                {selectedCompany && companyRecommendation ? (
                  <p className="starter-note">
                    Best aligned for <strong>{selectedCompany}</strong>: {companyRecommendation.emphasis}
                  </p>
                ) : null}
                <p className="starter-note">{activeTest.starter}</p>
                <p className="starter-note">{activeTest.confirms}</p>
              </div>
            </div>
          </div>
          ) : (
            <div className="simulator-placeholder">
              <p className="panel-label">Graded tests</p>
              <h3>Select a discipline to reveal its test ladder.</h3>
              <p>
                Each path contains multiple interview-style tests organized by graduated
                difficulty so users can build skill deliberately.
              </p>
              <a href="#pathways" className="primary-link">
                Choose a path first
              </a>
            </div>
          )}
        </section>

        <section className="simulator-section" id="simulator">
          {simulatorReady && stage ? (
            <>
              <div className="section-heading">
                <p className="eyebrow">Interview simulator</p>
                <h2>Run a realistic mock interview round.</h2>
                <p className="section-copy">
                  Practice under time pressure with guided help, structured prompts, and scoring
                  that mirrors the rhythm of a real interview loop.
                </p>
              </div>

              <div className="simulator-layout">
                <aside className="stage-rail" aria-label="Interview stages">
                  {selectedDiscipline.interviewStages.map((item, index) => {
                    const selected = index === activeStage;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        className={`stage-button ${selected ? "selected" : ""}`}
                        onClick={() => setActiveStage(index)}
                      >
                        <span>{item.name}</span>
                        <small>{item.duration}</small>
                      </button>
                    );
                  })}
                </aside>

                <div className="simulator-panel">
                  <p className="panel-label">Current round</p>
                  <h3>{stage.name}</h3>
                  <p className="simulator-focus">{stage.focus}</p>

                  <div className="session-toolbar">
                    <div>
                      <p className="panel-label">Timer</p>
                      <p className="timer-readout">{formatTimer(timeLeft)}</p>
                    </div>
                    <div>
                      <p className="panel-label">Draft length</p>
                      <p className="metric-readout">{wordCount} words</p>
                    </div>
                    <div>
                      <p className="panel-label">Strongest signal</p>
                      <p className="metric-readout">{strongestSignal}</p>
                    </div>
                  </div>
                  <div className="progress-shell" aria-hidden="true">
                    <span style={{ width: `${stageProgress}%` }} />
                  </div>

                  <div className="prompt-block">
                    <p className="panel-label">Practice prompt</p>
                    <p>{activeTest?.prompt}</p>
                    <p className="starter-note">{activeTest?.starter}</p>
                  </div>

                  <div className="help-panel">
                    <div className="help-header">
                      <div>
                        <p className="panel-label">Help meter</p>
                        <h4>{helpContent.title}</h4>
                      </div>
                      <div className="help-readout">
                        <strong>{helpMode.label}</strong>
                        <span>{helpMode.description}</span>
                      </div>
                    </div>
                    <div className="help-scale" role="group" aria-label="Answer help meter">
                      {helpModes.map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          className={`help-step ${helpLevel === mode.value ? "selected" : ""}`}
                          onClick={() => {
                            setHelpCustomized(true);
                            setHelpLevel(mode.value);
                          }}
                        >
                          <span>{mode.value}</span>
                          <small>{mode.label}</small>
                        </button>
                      ))}
                    </div>
                    <p className="starter-note">{helpContent.summary}</p>
                    {helpContent.promptRewrite ? (
                      <div className="help-block">
                        <p className="panel-label">Study framing</p>
                        <p>{helpContent.promptRewrite}</p>
                      </div>
                    ) : null}
                    {helpContent.outline.length > 0 ? (
                      <div className="help-block">
                        <p className="panel-label">Answer outline</p>
                        <ul className="detail-list compact">
                          {helpContent.outline.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {helpContent.rubricPreview.length > 0 ? (
                      <div className="help-block">
                        <p className="panel-label">What to hit</p>
                        <ul className="detail-list compact">
                          {helpContent.rubricPreview.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {helpContent.followUpHint ? (
                      <div className="help-block">
                        <p className="panel-label">Likely follow-up</p>
                        <p>{helpContent.followUpHint}</p>
                      </div>
                    ) : null}
                    {helpContent.coachingSteps.length > 0 ? (
                      <div className="help-block">
                        <p className="panel-label">Learning checklist</p>
                        <ul className="detail-list compact">
                          {helpContent.coachingSteps.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {helpContent.exampleAnswer.length > 0 ? (
                      <div className="help-block">
                        <p className="panel-label">Example answer shape</p>
                        <ul className="detail-list compact">
                          {helpContent.exampleAnswer.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="response-grid">
                    <div>
                      <p className="panel-label">What great candidates show</p>
                      <ul className="detail-list compact">
                        <li>Structured thinking before they jump into the answer</li>
                        <li>Clear tradeoff language when constraints conflict</li>
                        <li>A calm explanation that makes the interviewer trust them</li>
                      </ul>
                    </div>
                    <div>
                      <p className="panel-label">Follow-up pressure test</p>
                      <ul className="detail-list compact">
                        {stage.followUps.map((followUp) => (
                          <li key={followUp}>{followUp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="workspace-grid">
                    <div className="workspace-card">
                      <div className="workspace-heading">
                        <div>
                          <p className="panel-label">Your answer</p>
                          <h4>Mock interview workspace</h4>
                        </div>
                        <div className="workspace-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setIsRunning((current) => !current)}
                          >
                            {isRunning ? "Pause timer" : "Start timer"}
                          </button>
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                              setIsRunning(false);
                              setTimeLeft(totalSeconds);
                            }}
                          >
                            Reset round
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="answer-box"
                        value={answer}
                        onChange={(event) => {
                          setAnswer(event.target.value);
                          setAnswerNotice("");
                        }}
                        onPaste={(event) => {
                          event.preventDefault();
                          blockAnswerTransfer("Pasting is disabled for interview answers.");
                        }}
                        onCut={(event) => {
                          event.preventDefault();
                          blockAnswerTransfer("Cut is disabled so the response stays in the workspace.");
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          blockAnswerTransfer("Dropping text is disabled for interview answers.");
                        }}
                        onKeyDown={(event) => {
                          if (
                            (event.ctrlKey || event.metaKey) &&
                            (event.key === "v" || event.key === "x")
                          ) {
                            event.preventDefault();
                            blockAnswerTransfer(
                              event.key === "v"
                                ? "Pasting is disabled for interview answers."
                                : "Cut is disabled so the response stays in the workspace.",
                            );
                          }

                          if (event.shiftKey && event.key === "Insert") {
                            event.preventDefault();
                            blockAnswerTransfer("Pasting is disabled for interview answers.");
                          }
                        }}
                        placeholder="Write your answer as if the interviewer is listening. Structure it, state assumptions, and explain the tradeoffs you choose."
                      />
                      <div className="workspace-footer">
                        <div>
                          <p className="helper-copy">
                            Treat this like a live round: answer aloud, then refine what
                            you wrote until it feels concise and confident.
                          </p>
                          <p
                            className={`answer-notice ${answerNotice ? "visible" : ""}`}
                            aria-live="polite"
                          >
                            {answerNotice || "Paste and cut are disabled in this workspace."}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => setFeedback(scoreAnswer(answer, stage.rubric, stage.focus))}
                        >
                          Score my answer
                        </button>
                      </div>
                    </div>

                    <div className="workspace-card rubric-card">
                      <p className="panel-label">Round rubric</p>
                      <h4>The interviewer is listening for these signals</h4>
                      <ul className="detail-list compact">
                        {stage.rubric.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {feedback ? (
                    <div className="feedback-panel">
                      <div className="score-badge">
                        <span>{feedback.overallScore}</span>
                        <small>/ 100</small>
                      </div>
                      <div className="feedback-copy">
                        <p className="panel-label">Session feedback</p>
                        <h4>{feedback.readiness}</h4>
                        <p className="starter-note">{feedback.nextStep}</p>
                      </div>
                      <div className="feedback-columns">
                        <div>
                          <p className="panel-label">Strengths</p>
                          <ul className="detail-list compact">
                            {feedback.strengths.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="panel-label">Improve next</p>
                          <ul className="detail-list compact">
                            {feedback.misses.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </section>

        <section className="blueprint-section" id="blueprint">
          <div className="section-heading">
            <p className="eyebrow">Product blueprint</p>
            <h2>Designed to scale into a complete interview platform.</h2>
            <p className="section-copy">
              The current experience already covers role selection, company alignment, drills, and
              simulation, with room for progress tracking, feedback history, and deeper
              personalization.
            </p>
          </div>

          <div className="blueprint-grid">
            <div>
              <p className="panel-label">Phase 1</p>
              <h3>Interactive discipline selection</h3>
              <p>
                Users choose a target role and immediately see the prep tracks,
                companies, and interview stages that fit.
              </p>
            </div>
            <div>
              <p className="panel-label">Phase 2</p>
              <h3>Challenge and feedback engine</h3>
              <p>
                Timed rounds, structured answer capture, live rubrics, and
                scorecards turn practice into something users can repeat and improve.
              </p>
            </div>
            <div>
              <p className="panel-label">Phase 3</p>
              <h3>Personalized company tracks</h3>
              <p>
                Layer in company-specific loops, question banks, and progress maps
                for users targeting a shortlist of dream roles.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
