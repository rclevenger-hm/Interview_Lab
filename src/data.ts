export type InterviewStage = {
  name: string;
  focus: string;
  duration: string;
  minutes: number;
  followUps: string[];
  rubric: string[];
};

export type Challenge = {
  id: string;
  title: string;
  prompt: string;
  difficulty: "Foundation" | "Core" | "Advanced" | "Expert";
  signal: string;
  starter: string;
  confirms: string;
};

export type Discipline = {
  id: string;
  name: string;
  tag: string;
  summary: string;
  companyFit: string[];
  preparationTracks: string[];
  interviewStages: InterviewStage[];
  tests: Challenge[];
};

export const disciplines: Discipline[] = [
  {
    id: "software",
    name: "Software Engineering",
    tag: "DSA + systems + communication",
    summary:
      "Build fluency across coding rounds, system design, behavioral storytelling, and leadership principles.",
    companyFit: ["Google", "Meta", "Amazon", "Microsoft", "OpenAI"],
    preparationTracks: [
      "Data structures sprints",
      "System design whiteboards",
      "Behavioral answer coaching",
    ],
    interviewStages: [
      {
        name: "Coding Screen",
        focus: "Algorithms, edge cases, and implementation clarity",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "How would your approach change if the feed updates continuously while results are being calculated?",
          "Which edge cases would you test before shipping this solution?",
          "What data structure lets you keep the top K efficiently as scores change?",
        ],
        rubric: [
          "Explains a clear algorithm before diving into syntax",
          "Names tradeoffs around time, space, and correctness",
          "Surfaces edge cases and validates assumptions",
        ],
      },
      {
        name: "System Design",
        focus: "Tradeoffs, scale, and communication under pressure",
        duration: "60 min",
        minutes: 60,
        followUps: [
          "Where would you place ranking logic to keep latency low without making the system rigid?",
          "How would you design for graceful degradation if engagement features fail?",
          "What would you cache, and how would you invalidate it safely?",
        ],
        rubric: [
          "Frames the system with users, APIs, storage, and bottlenecks",
          "Chooses sensible tradeoffs instead of hand-waving scale",
          "Communicates sequencing and constraints calmly",
        ],
      },
      {
        name: "Leadership Round",
        focus: "Ownership, conflict, and decision quality",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Describe a time you had to push back on a strong stakeholder with incomplete data.",
          "How do you recover trust after a rollout goes sideways?",
          "What signals tell you a team is optimizing locally instead of for the product?",
        ],
        rubric: [
          "Uses structured storytelling with context, action, and result",
          "Shows ownership without sounding defensive",
          "Connects the story to team impact and learning",
        ],
      },
    ],
    tests: [
      {
        id: "software-array-window",
        title: "Sliding Window Metrics",
        prompt:
          "Given a stream of page visits, return the longest contiguous range that satisfies a rate threshold and explain how you would test edge cases.",
        difficulty: "Foundation",
        signal: "Tests coding fluency, iteration control, and debugging discipline.",
        starter:
          "Start by naming the input shape, deciding what should stay in the window, and identifying the invariant that must remain true.",
        confirms:
          "Confirmed by official software interview prep themes covering coding, problem solving, and testing expectations.",
      },
      {
        id: "software-graph-dependency",
        title: "Dependency Graph Release",
        prompt:
          "Design an algorithm that determines a safe deployment order for services with dependencies, blocked edges, and rollback rules.",
        difficulty: "Core",
        signal: "Tests graph traversal, constraint handling, and communication.",
        starter:
          "Start by modeling the services as nodes, then explain how cycles, blocked dependencies, and failure handling affect the algorithm.",
        confirms:
          "Confirmed by public software engineer interview guidance emphasizing algorithmic reasoning and system constraints.",
      },
      {
        id: "software-feed-ranking",
        title: "Realtime Feed Ranking",
        prompt:
          "Design a function that returns the top K ranked posts while balancing recency, engagement, and author diversity.",
        difficulty: "Advanced",
        signal: "Tests priority queues, custom scoring, and explanation quality.",
        starter:
          "Start by naming the inputs, defining the ranking signal, and deciding what you need to optimize first: correctness, speed, or explainability.",
        confirms:
          "Confirmed by official guidance that large-company software loops test coding plus scalability and prioritization tradeoffs.",
      },
      {
        id: "software-distributed-cache",
        title: "Distributed Cache Failover",
        prompt:
          "Design a distributed caching layer for a global product where stale reads are tolerable for some endpoints but not for account-critical actions.",
        difficulty: "Expert",
        signal: "Tests systems design depth, reliability tradeoffs, and high-level communication.",
        starter:
          "Start with the read and write paths, then explain consistency choices, failure modes, and what you would monitor.",
        confirms:
          "Confirmed by official software interview prep pages that system design, distributed systems, and testing are part of senior loops.",
      },
      {
        id: "software-openai-agent-runtime",
        title: "Agent Runtime Reliability",
        prompt:
          "Design the core service for an AI assistant that can call tools, stream responses, enforce safety checks, and recover cleanly when model or tool calls fail.",
        difficulty: "Expert",
        signal: "Tests AI product engineering, distributed systems judgment, and reliability tradeoffs.",
        starter:
          "Start with the request lifecycle, then explain how you would isolate tool failures, preserve user trust, and observe model, policy, and infrastructure behavior separately.",
        confirms:
          "Confirmed by AI infrastructure and product engineering interview patterns that test systems design, safety constraints, and production debugging.",
      },
    ],
  },
  {
    id: "data",
    name: "Data Science",
    tag: "analytics + experimentation + modeling",
    summary:
      "Practice case framing, metrics design, SQL problem solving, machine learning tradeoffs, and executive communication.",
    companyFit: ["Airbnb", "Netflix", "Uber", "LinkedIn", "OpenAI"],
    preparationTracks: [
      "SQL and product analytics drills",
      "Experiment interpretation labs",
      "Model selection frameworks",
    ],
    interviewStages: [
      {
        name: "Analytics Case",
        focus: "Metrics, hypotheses, and business framing",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "What leading and lagging metrics would you pair here?",
          "How would you separate correlation from an actual churn driver?",
          "What user segments deserve their own analysis path?",
        ],
        rubric: [
          "Frames the business problem before jumping into analysis",
          "Chooses metrics that connect behavior to outcomes",
          "Builds a sequence of hypotheses and tests",
        ],
      },
      {
        name: "Technical Modeling",
        focus: "Feature choices, validation, and model risk",
        duration: "50 min",
        minutes: 50,
        followUps: [
          "Which features risk leakage, and how would you audit for it?",
          "How would you choose between interpretability and raw lift?",
          "What does success look like after deployment, not just offline validation?",
        ],
        rubric: [
          "Connects modeling choices to the business decision",
          "Shows awareness of bias, leakage, and monitoring",
          "Uses evaluation methods that fit the problem shape",
        ],
      },
      {
        name: "Executive Readout",
        focus: "Translating data into decisions",
        duration: "30 min",
        minutes: 30,
        followUps: [
          "If leadership only funds one intervention, which would you recommend first?",
          "How would you explain uncertainty without sounding unprepared?",
          "What action would you stop the team from taking based on the data?",
        ],
        rubric: [
          "Communicates recommendations with clarity and restraint",
          "Explains confidence and uncertainty cleanly",
          "Moves from analysis to action",
        ],
      },
    ],
    tests: [
      {
        id: "data-funnel-drop",
        title: "Activation Funnel Diagnosis",
        prompt:
          "Users complete signup but fail to activate. Propose the first analysis slices, metrics, and hypotheses you would use to isolate the problem.",
        difficulty: "Foundation",
        signal: "Tests product analytics framing and metrics selection.",
        starter:
          "Start by defining activation precisely, then split the funnel by time, segment, and acquisition source before jumping to conclusions.",
        confirms:
          "Confirmed by recurring analytics-case and metrics-design interview formats used in data science and analytics loops.",
      },
      {
        id: "data-sql-retention",
        title: "Retention Cohort Investigation",
        prompt:
          "Design the logic for a SQL-based cohort analysis that compares retention for three onboarding variants while accounting for late event ingestion.",
        difficulty: "Core",
        signal: "Tests SQL reasoning, event modeling, and data quality awareness.",
        starter:
          "Start by defining the cohort entry event, the retention event, and how you would protect the analysis from incomplete data.",
        confirms:
          "Confirmed by public interview prep patterns emphasizing SQL, experimentation, and cohort reasoning.",
      },
      {
        id: "data-churn-rescue",
        title: "Subscription Churn Rescue",
        prompt:
          "Propose an analysis plan to detect churn drivers, prioritize interventions, and measure long-term improvement.",
        difficulty: "Advanced",
        signal: "Tests experiment design, causal thinking, and business judgment.",
        starter:
          "Start by defining churn precisely, then map the funnel moments where user behavior begins to diverge.",
        confirms:
          "Confirmed by data science interview loops that combine experimentation, diagnostics, and executive recommendation.",
      },
      {
        id: "data-model-governance",
        title: "Production Model Drift Review",
        prompt:
          "A high-impact ranking model has degraded in production over six weeks. Diagnose the most likely causes, propose checks, and decide what you would ship next.",
        difficulty: "Expert",
        signal: "Tests ML operations judgment, validation strategy, and stakeholder communication.",
        starter:
          "Start by separating data drift, concept drift, and pipeline failures, then explain how each would change your response.",
        confirms:
          "Confirmed by official machine learning role guidance that evaluation, productionization, and monitoring matter beyond offline accuracy.",
      },
      {
        id: "data-openai-eval-quality",
        title: "AI Evaluation Quality Review",
        prompt:
          "A new assistant feature is passing offline benchmarks but users report inconsistent answer quality in production. Design the evaluation plan, quality slices, and launch decision framework.",
        difficulty: "Expert",
        signal: "Tests eval design, measurement judgment, and responsible product decision-making.",
        starter:
          "Start by separating offline benchmark performance from user-visible quality, then define the eval set, failure taxonomy, and release thresholds.",
        confirms:
          "Confirmed by AI data science and evaluation interview patterns that emphasize measurement design, model behavior analysis, and decision quality.",
      },
    ],
  },
  {
    id: "product",
    name: "Product Management",
    tag: "strategy + execution + influence",
    summary:
      "Train on product sense, analytical reasoning, roadmap tradeoffs, and stakeholder management for high-bar PM loops.",
    companyFit: ["Stripe", "Notion", "OpenAI", "Figma"],
    preparationTracks: [
      "Product sense prompts",
      "Execution and prioritization games",
      "Stakeholder scenario rehearsals",
    ],
    interviewStages: [
      {
        name: "Product Sense",
        focus: "User empathy, problem framing, and product taste",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Who is the first user you would design this for, and who are you explicitly not serving yet?",
          "What job is this product replacing today?",
          "How would you know if the first release created new user behavior instead of shallow curiosity?",
        ],
        rubric: [
          "Starts with users and sharp problem framing",
          "Balances ambition with a credible first release",
          "Defines success with behavior-based metrics",
        ],
      },
      {
        name: "Execution",
        focus: "Goals, metrics, and tradeoff management",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Which dependency is most likely to slow this down, and how would you de-risk it?",
          "What would you cut if the team lost 30 percent of its bandwidth?",
          "How do you handle disagreement between design polish and launch speed?",
        ],
        rubric: [
          "Breaks goals into measurable decisions and milestones",
          "Shows principled prioritization under constraint",
          "Handles tradeoffs without losing the product thesis",
        ],
      },
      {
        name: "Cross-Functional Round",
        focus: "Influence without authority",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "How would you align engineering and GTM if they define success differently?",
          "Tell me about a time you changed a stakeholder's mind without escalating.",
          "Where do you insist on clarity before the team starts building?",
        ],
        rubric: [
          "Demonstrates influence through alignment, not force",
          "Uses communication to unblock ambiguity",
          "Keeps the team centered on user value",
        ],
      },
    ],
    tests: [
      {
        id: "product-improve-checkout",
        title: "Improve Checkout Confidence",
        prompt:
          "Improve a digital checkout experience with high cart completion but poor repeat purchase behavior.",
        difficulty: "Foundation",
        signal: "Tests user framing, success metrics, and product sense.",
        starter:
          "Start with the user problem behind repeat behavior, not just the funnel number, then propose a focused first release.",
        confirms:
          "Confirmed by PM interview guidance emphasizing product sense, user problems, and metrics.",
      },
      {
        id: "product-prioritization-grid",
        title: "Roadmap Tradeoff Sprint",
        prompt:
          "You have three competing roadmap asks from growth, reliability, and monetization teams. Choose what ships next and defend the tradeoffs.",
        difficulty: "Core",
        signal: "Tests prioritization and execution judgment.",
        starter:
          "Start by defining the business objective, then show how you would compare impact, confidence, and delivery risk.",
        confirms:
          "Confirmed by PM execution interviews that test prioritization under constrained resources.",
      },
      {
        id: "product-creator-workspace",
        title: "Launch a Creator Workspace",
        prompt:
          "Define the north-star metric, first-release scope, and launch risks for a collaborative creator planning tool.",
        difficulty: "Advanced",
        signal: "Tests prioritization, strategy, and articulation.",
        starter:
          "Start with who the creator is, what painful workflow you are replacing, and why they should care now.",
        confirms:
          "Confirmed by PM interview prep materials that product sense and execution are core top-company PM tests.",
      },
      {
        id: "product-market-expansion",
        title: "International Expansion Decision",
        prompt:
          "Decide whether to localize a successful product for two new regions with very different regulatory and behavioral constraints.",
        difficulty: "Expert",
        signal: "Tests strategy, sequencing, and cross-functional decision quality.",
        starter:
          "Start by explaining how you would validate demand, constraints, and operational readiness before committing roadmap investment.",
        confirms:
          "Confirmed by product strategy and leadership-style PM interviews that test market judgment and influence.",
      },
      {
        id: "product-openai-agent-launch",
        title: "AI Agent Launch Decision",
        prompt:
          "Define the launch plan for an AI agent feature that can take actions on behalf of users, where success depends on usefulness, trust, safety, and clear failure handling.",
        difficulty: "Expert",
        signal: "Tests AI product sense, responsible rollout, and cross-functional judgment.",
        starter:
          "Start with the target user and job-to-be-done, then define the trust boundaries, launch metrics, risk gates, and what you would intentionally leave out of v1.",
        confirms:
          "Confirmed by AI product management interview patterns that test product judgment, safety-aware rollout, metrics, and ambiguity management.",
      },
    ],
  },
  {
    id: "design",
    name: "Product Design",
    tag: "craft + systems + storytelling",
    summary:
      "Prepare for portfolio presentations, whiteboard challenges, critique sessions, and collaboration-heavy interviews.",
    companyFit: ["Apple", "Figma", "Dropbox", "Shopify", "OpenAI"],
    preparationTracks: [
      "Portfolio story shaping",
      "Whiteboard challenge walkthroughs",
      "Critique and collaboration drills",
    ],
    interviewStages: [
      {
        name: "Portfolio Review",
        focus: "Narrative, craft, and outcome clarity",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Which decision in this project best shows your taste under constraint?",
          "What changed because of your work, not just because the project shipped?",
          "How do you explain a messy process without losing the story?",
        ],
        rubric: [
          "Tells a cohesive story from problem to outcome",
          "Explains design choices and iteration rationale",
          "Connects craft to measurable impact",
        ],
      },
      {
        name: "Design Exercise",
        focus: "Interaction design and iteration speed",
        duration: "60 min",
        minutes: 60,
        followUps: [
          "What assumption would you validate first before polishing the UI?",
          "How would this experience adapt for returning users?",
          "What constraints would force a different design system choice?",
        ],
        rubric: [
          "Starts with the user journey before the interface",
          "Balances speed, clarity, and extensibility",
          "Talks through iteration rather than presenting a frozen answer",
        ],
      },
      {
        name: "Collaboration Panel",
        focus: "Feedback handling and cross-functional partnership",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "Describe a time engineering feedback changed your design in a good way.",
          "How do you handle critique that conflicts with your own judgment?",
          "What makes a handoff trustworthy to the rest of the team?",
        ],
        rubric: [
          "Shows maturity in critique and collaboration",
          "Demonstrates systems thinking, not just screens",
          "Communicates clearly with non-design partners",
        ],
      },
    ],
    tests: [
      {
        id: "design-onboarding-fix",
        title: "Onboarding Friction Triage",
        prompt:
          "A mobile onboarding flow has strong install volume but major abandonment before the first successful action. Redesign the experience.",
        difficulty: "Foundation",
        signal: "Tests user journey framing, friction analysis, and first-step prioritization.",
        starter:
          "Start by mapping the user intent and where confidence drops, then outline the first design moves you would test.",
        confirms:
          "Confirmed by common product design exercise formats focused on journey clarity and iteration.",
      },
      {
        id: "design-collaboration-surface",
        title: "Collaborative Editing Surface",
        prompt:
          "Design a collaborative review flow for multiple editors working on the same document with comments, approvals, and version context.",
        difficulty: "Core",
        signal: "Tests systems thinking and interaction design.",
        starter:
          "Start with the roles involved, then explain how awareness, conflict resolution, and history should appear in the interface.",
        confirms:
          "Confirmed by design interview patterns that test interaction systems and multi-state product behavior.",
      },
      {
        id: "design-onboarding-dropoff",
        title: "Redesign Onboarding Drop-Off",
        prompt:
          "Create a response plan for a mobile onboarding flow with high abandonment after account creation.",
        difficulty: "Advanced",
        signal: "Tests framing, systems thinking, and communication.",
        starter:
          "Start by identifying where user intent collapses, what evidence you need, and which design moves are reversible.",
        confirms:
          "Confirmed by portfolio and whiteboard design interviews that emphasize framing, iteration, and outcome thinking.",
      },
      {
        id: "design-design-system",
        title: "Design System Recovery",
        prompt:
          "A company has inconsistent UI patterns across web and mobile. Define how you would rebuild trust, prioritize system work, and measure adoption.",
        difficulty: "Expert",
        signal: "Tests design systems judgment, organizational influence, and rollout strategy.",
        starter:
          "Start with the highest-cost inconsistencies, then explain how you would sequence foundations, migration, and governance.",
        confirms:
          "Confirmed by senior product design interviews that test systems maturity and cross-functional leadership.",
      },
      {
        id: "design-openai-copilot-workflow",
        title: "AI Copilot Workflow Design",
        prompt:
          "Design a workflow for a professional user who needs an AI copilot to inspect work, suggest changes, explain uncertainty, and hand control back without disrupting trust.",
        difficulty: "Advanced",
        signal: "Tests AI interaction design, trust calibration, and workflow clarity.",
        starter:
          "Start with the user's job-to-be-done and the moments where automation should assist, ask, or stay out of the way.",
        confirms:
          "Confirmed by AI product design interview patterns that test interaction judgment, ambiguity handling, and responsible user experience design.",
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps / SRE",
    tag: "reliability + oracle stack + incident response",
    summary:
      "Prepare for infrastructure interviews covering reliability engineering, observability, automation strategy, and operational judgment.",
    companyFit: ["Google", "Datadog", "Cloudflare", "Shopify", "Oracle", "OpenAI", "Cerner / Oracle Health"],
    preparationTracks: [
      "Incident response rehearsals",
      "Infrastructure-as-code design drills",
      "Reliability and observability reviews",
    ],
    interviewStages: [
      {
        name: "Operations Screen",
        focus: "Troubleshooting depth, incident handling, and production instincts",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "What would you inspect first if error rates spike right after a deploy?",
          "How do you separate signal from noise when dashboards are lighting up everywhere?",
          "When do you rollback immediately versus continue gathering information?",
        ],
        rubric: [
          "Uses a structured incident response approach",
          "Prioritizes customer impact and time-to-recovery",
          "Communicates decisions clearly under pressure",
        ],
      },
      {
        name: "Systems Design",
        focus: "Availability, scaling, failure domains, and automation strategy",
        duration: "60 min",
        minutes: 60,
        followUps: [
          "Where are the single points of failure in your proposed design?",
          "How would you design deployments to reduce blast radius?",
          "What SLOs and alerts would you create for this system first?",
        ],
        rubric: [
          "Designs for resilience instead of just happy-path scale",
          "Explains monitoring, rollback, and recovery plans",
          "Balances complexity with operational simplicity",
        ],
      },
      {
        name: "Postmortem Round",
        focus: "Learning loops, accountability, and reliability culture",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "How do you write a blameless postmortem that still drives change?",
          "What action items deserve engineering investment versus process changes?",
          "How do you prevent repeat incidents when teams are already overloaded?",
        ],
        rubric: [
          "Shows ownership without blame",
          "Turns incidents into durable operational improvements",
          "Connects reliability work to team habits and system design",
        ],
      },
    ],
    tests: [
      {
        id: "devops-alert-flood",
        title: "Alert Flood Stabilization",
        prompt:
          "A new deploy causes alert volume to spike across multiple services. Stabilize the system and decide which signals matter first.",
        difficulty: "Foundation",
        signal: "Tests basic incident response sequencing and triage.",
        starter:
          "Start with customer impact, containment, and how you would identify the most trustworthy leading signals.",
        confirms:
          "Confirmed by official infrastructure and technical interview prep themes that emphasize troubleshooting and problem solving.",
      },
      {
        id: "devops-release-guardrails",
        title: "Release Guardrails Design",
        prompt:
          "Design a deployment workflow with canaries, rollback protection, and automated checks for a high-traffic service.",
        difficulty: "Core",
        signal: "Tests automation strategy and blast-radius thinking.",
        starter:
          "Start with failure domains, then explain how health checks and progressive delivery reduce operator risk.",
        confirms:
          "Confirmed by public SRE and platform interview patterns centered on deployment safety and reliability.",
      },
      {
        id: "devops-checkout-outage",
        title: "Multi-Region Checkout Outage",
        prompt:
          "Walk through how you would stabilize, investigate, and harden a checkout platform after a failed multi-region rollout causes elevated latency and intermittent errors.",
        difficulty: "Advanced",
        signal: "Tests incident command, reliability design, and operational prioritization.",
        starter:
          "Start with customer impact, containment, and the fastest path to stabilize the system before widening the investigation.",
        confirms:
          "Confirmed by official engineering guidance that distributed systems, testing, and design tradeoffs are evaluated in technical loops.",
      },
      {
        id: "devops-slo-redesign",
        title: "Global SLO Re-Architecture",
        prompt:
          "A platform has grown across regions and teams, but its SLOs no longer reflect real customer pain. Redesign the reliability model and enforcement plan.",
        difficulty: "Expert",
        signal: "Tests operational strategy, observability maturity, and leadership judgment.",
        starter:
          "Start by separating user-facing outcomes from internal service metrics, then explain how error budgets would change engineering behavior.",
        confirms:
          "Confirmed by SRE interview norms that senior candidates are tested on SLOs, reliability culture, and long-term systems thinking.",
      },
      {
        id: "devops-hadoop-capacity-recovery",
        title: "Hadoop Cluster Recovery Plan",
        prompt:
          "A critical Hadoop cluster is running out of healthy nodes during a nightly ingestion window, causing YARN queue contention, missed SLAs, and repeated HDFS rebalance failures. Explain how you would stabilize the platform and prevent recurrence.",
        difficulty: "Core",
        signal: "Tests distributed data platform operations, capacity planning, and recovery sequencing.",
        starter:
          "Start with cluster health, customer-facing batch impact, and how you would separate storage pressure, scheduler contention, and node instability before changing capacity.",
        confirms:
          "Confirmed by public DevOps, SRE, and data-platform interview patterns that evaluate Hadoop operations, batch reliability, and production triage.",
      },
      {
        id: "devops-kafka-partition-drift",
        title: "Kafka Partition Drift Incident",
        prompt:
          "After a broker maintenance event, Kafka consumer lag spikes unevenly across partitions, ISR shrinks on key topics, and downstream services begin timing out. Walk through diagnosis, stabilization, and the longer-term guardrails you would add.",
        difficulty: "Advanced",
        signal: "Tests streaming infrastructure judgment, incident response under pressure, and failure-isolation thinking.",
        starter:
          "Start with business-critical topics, broker and partition health, and how you would decide between traffic shedding, replica repair, and consumer-side mitigation.",
        confirms:
          "Confirmed by public platform engineering and SRE interview themes focused on Kafka operations, replication health, and reliability tradeoffs in event-driven systems.",
      },
      {
        id: "devops-oracle-db-failover",
        title: "Oracle Database Failover Drill",
        prompt:
          "A revenue-critical Oracle database environment shows replication delay during peak traffic, backup windows are colliding with OLTP load, and leadership wants a cleaner failover story. Design the runbook, monitoring plan, and architecture changes you would recommend.",
        difficulty: "Expert",
        signal: "Tests database reliability strategy, operational runbook design, and Oracle-specific production judgment.",
        starter:
          "Start with recovery objectives, primary versus standby health, and how you would monitor replication lag, backup pressure, and failover readiness before proposing architecture changes.",
        confirms:
          "Confirmed by public Oracle infrastructure, database operations, and SRE interview patterns that emphasize HA design, failover readiness, and operational discipline.",
      },
      {
        id: "devops-cerner-clinical-cutover",
        title: "Clinical Cutover Stability Review",
        prompt:
          "During a Cerner / Oracle Health release window, medication order latency rises after an interface cutover between the EHR, integration engine, and downstream pharmacy systems. Explain how you would triage patient-impact risk, stabilize the platform, and lead the next decisions.",
        difficulty: "Advanced",
        signal: "Tests on-the-feet incident reasoning, high-stakes prioritization, and communication under healthcare workflow pressure.",
        starter:
          "Start with patient safety, the most critical clinical workflows, and how you would narrow whether the issue sits in the application tier, interface queue, or downstream dependency before expanding the fix.",
        confirms:
          "Confirmed by public healthcare platform, Oracle operations, and SRE interview patterns that emphasize production judgment, integration reliability, and incident command.",
      },
      {
        id: "devops-openai-inference-incident",
        title: "Inference Capacity Incident",
        prompt:
          "A model-serving tier is seeing sharp latency spikes, queue growth, and intermittent streaming failures during a product launch. Stabilize the system and explain what you would change before the next launch.",
        difficulty: "Expert",
        signal: "Tests AI infrastructure operations, capacity planning, and incident command.",
        starter:
          "Start with user-visible impact, request queues, model-serving capacity, and whether the fastest mitigation is traffic shaping, fallback behavior, or infrastructure scaling.",
        confirms:
          "Confirmed by AI infrastructure and SRE interview patterns that emphasize model-serving reliability, observability, and graceful degradation.",
      },
    ],
  },
  {
    id: "security",
    name: "Security Engineering",
    tag: "threats + controls + secure systems",
    summary:
      "Practice the mix of application security, detection thinking, architecture review, and risk communication expected in top security interviews.",
    companyFit: ["Cloudflare", "Stripe", "Google", "Palo Alto Networks", "OpenAI"],
    preparationTracks: [
      "Threat modeling sessions",
      "Secure design walkthroughs",
      "Detection and incident response drills",
    ],
    interviewStages: [
      {
        name: "Threat Modeling",
        focus: "Attack surfaces, abuse cases, and control selection",
        duration: "50 min",
        minutes: 50,
        followUps: [
          "Which asset or trust boundary is most critical in this system?",
          "What attacker would you optimize defenses against first?",
          "How do you decide whether a control belongs in code, infra, or process?",
        ],
        rubric: [
          "Identifies assets, actors, and trust boundaries clearly",
          "Prioritizes realistic threats over exhaustive lists",
          "Proposes layered mitigations with sensible tradeoffs",
        ],
      },
      {
        name: "Secure Systems Design",
        focus: "Authentication, authorization, data protection, and abuse prevention",
        duration: "60 min",
        minutes: 60,
        followUps: [
          "How would you protect sensitive data at rest and in transit here?",
          "Where can privilege escalation happen in your design?",
          "What logging would you need for detection without over-collecting sensitive data?",
        ],
        rubric: [
          "Builds security into the architecture rather than adding it late",
          "Balances usability, performance, and security controls",
          "Explains detection and response implications of design decisions",
        ],
      },
      {
        name: "Incident Judgment",
        focus: "Triage, containment, communication, and business risk",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "How do you decide if an alert is a true incident or noisy telemetry?",
          "What gets communicated to leadership first during a live breach investigation?",
          "When do you rotate credentials broadly versus narrowly?",
        ],
        rubric: [
          "Thinks clearly under uncertainty",
          "Balances containment speed with evidence preservation",
          "Communicates risk in terms the business can act on",
        ],
      },
    ],
    tests: [
      {
        id: "security-basic-threat-model",
        title: "Simple Threat Model",
        prompt:
          "Threat-model a file sharing feature that allows users to upload documents and generate shareable links.",
        difficulty: "Foundation",
        signal: "Tests basic abuse-case thinking and trust-boundary awareness.",
        starter:
          "Start by listing assets, actors, and trust boundaries before naming the top risks.",
        confirms:
          "Confirmed by security engineering interview formats that emphasize threat modeling and practical control selection.",
      },
      {
        id: "security-admin-tool-review",
        title: "Internal Admin Tool Review",
        prompt:
          "Assess the security risks in an internal admin tool that can read customer records, trigger refunds, and impersonate support sessions, then propose the most important protections.",
        difficulty: "Core",
        signal: "Tests threat prioritization, secure design judgment, and communication.",
        starter:
          "Start by naming the highest-risk actions, the likely abuse paths, and the controls that would reduce the most risk first.",
        confirms:
          "Confirmed by security interview guidance that candidates are tested on abuse prevention, access control, and risk tradeoffs.",
      },
      {
        id: "security-identity-platform",
        title: "Identity Platform Hardening",
        prompt:
          "Design the authentication, authorization, and audit model for a multi-tenant platform with delegated admins and API access tokens.",
        difficulty: "Advanced",
        signal: "Tests secure systems design and layered controls.",
        starter:
          "Start with identities, roles, and secrets, then explain where compromise is most likely and how you would constrain blast radius.",
        confirms:
          "Confirmed by official security-adjacent architecture interviews that authn, authz, and logging are central evaluation areas.",
      },
      {
        id: "security-breach-triage",
        title: "Breach Triage and Containment",
        prompt:
          "A suspicious pattern suggests an internal credential may have been abused to access sensitive systems. Decide what you investigate, contain, and communicate first.",
        difficulty: "Expert",
        signal: "Tests incident leadership, evidence handling, and business risk framing.",
        starter:
          "Start by separating evidence preservation from containment urgency, then explain what decisions cannot wait.",
        confirms:
          "Confirmed by public security engineering interview reports that senior loops test incident judgment, containment, and communication.",
      },
      {
        id: "security-openai-prompt-injection",
        title: "AI Tool Abuse Threat Model",
        prompt:
          "Threat-model an AI assistant that can read private workspace data and call internal tools. Identify prompt injection, data exfiltration, permission, and audit risks, then choose the first controls you would ship.",
        difficulty: "Expert",
        signal: "Tests AI security judgment, abuse-case prioritization, and layered control design.",
        starter:
          "Start with assets, tool permissions, untrusted inputs, and the boundary between model instructions and enforceable system controls.",
        confirms:
          "Confirmed by AI security interview patterns that emphasize prompt injection, tool abuse, data access, and practical mitigations.",
      },
    ],
  },
  {
    id: "qa",
    name: "QA / Test Engineering",
    tag: "quality + automation + release confidence",
    summary:
      "Train for interviews around test strategy, automation depth, failure analysis, and release-readiness judgment across complex systems.",
    companyFit: ["Microsoft", "Atlassian", "Shopify", "Adobe", "OpenAI", "Cerner / Oracle Health"],
    preparationTracks: [
      "Test strategy scenarios",
      "Automation framework design prompts",
      "Bug triage and release-risk drills",
    ],
    interviewStages: [
      {
        name: "Test Strategy",
        focus: "Coverage planning, risk-based testing, and product judgment",
        duration: "45 min",
        minutes: 45,
        followUps: [
          "What would you test first if the release deadline moved up by a week?",
          "Which areas deserve exploratory testing instead of scripted checks?",
          "How do you decide what not to automate yet?",
        ],
        rubric: [
          "Builds a risk-based testing plan rather than a checklist dump",
          "Connects testing depth to product impact and release confidence",
          "Chooses the right mix of manual, exploratory, and automated coverage",
        ],
      },
      {
        name: "Automation Design",
        focus: "Framework architecture, maintainability, and CI integration",
        duration: "50 min",
        minutes: 50,
        followUps: [
          "How would you keep flaky end-to-end tests from eroding team trust?",
          "What belongs in UI automation versus API or integration layers?",
          "How do you structure test data so suites stay reliable across environments?",
        ],
        rubric: [
          "Designs automation for maintainability, not just volume",
          "Understands the testing pyramid and layer tradeoffs",
          "Accounts for CI speed, reliability, and debuggability",
        ],
      },
      {
        name: "Release Risk Round",
        focus: "Defect triage, go/no-go judgment, and communication",
        duration: "40 min",
        minutes: 40,
        followUps: [
          "What makes a bug release-blocking versus acceptable for follow-up?",
          "How do you present quality risk to engineering and product without sounding vague?",
          "What evidence would you gather before recommending a launch delay?",
        ],
        rubric: [
          "Makes clear risk-based release decisions",
          "Communicates defects in business and user terms",
          "Uses evidence instead of intuition alone",
        ],
      },
    ],
    tests: [
      {
        id: "qa-risk-based-plan",
        title: "Risk-Based Test Plan",
        prompt:
          "Create a test plan for a feature launch with payments, notifications, and account state changes under a short deadline.",
        difficulty: "Foundation",
        signal: "Tests risk-based planning and coverage prioritization.",
        starter:
          "Start with the highest-cost user failures, then explain what you would automate, what you would explore manually, and what you would defer.",
        confirms:
          "Confirmed by official technical interview guidance that testing and problem solving are evaluated in engineering loops.",
      },
      {
        id: "qa-automation-stack",
        title: "Automation Layer Strategy",
        prompt:
          "Design a maintainable automation strategy for a product with mobile, web, and API surfaces, where end-to-end tests are currently flaky and slow.",
        difficulty: "Core",
        signal: "Tests automation architecture and CI judgment.",
        starter:
          "Start by separating what belongs in unit, integration, API, UI, and exploratory layers before choosing tooling or framework details.",
        confirms:
          "Confirmed by QA and SDET interview patterns that focus on automation tradeoffs and framework maintainability.",
      },
      {
        id: "qa-marketplace-release",
        title: "Marketplace Release Readiness",
        prompt:
          "Create a test plan for a marketplace checkout release that changes pricing logic, promotions, and order confirmation flows across web and mobile.",
        difficulty: "Advanced",
        signal: "Tests prioritization, automation judgment, and release communication.",
        starter:
          "Start with the highest-risk user journeys, then explain which checks belong at unit, integration, end-to-end, and exploratory layers.",
        confirms:
          "Confirmed by QA interview prep materials that release risk and layered testing are core evaluation areas.",
      },
      {
        id: "qa-quality-gate-go-no-go",
        title: "Go / No-Go Decision Review",
        prompt:
          "A major release has two severe bugs, several flaky tests, and high business pressure to launch. Make the release recommendation and defend it.",
        difficulty: "Expert",
        signal: "Tests release judgment, evidence-based risk framing, and stakeholder communication.",
        starter:
          "Start by quantifying user impact, detectability, and reversibility, then explain what evidence would change your decision.",
        confirms:
          "Confirmed by senior QA and test engineering interviews that go/no-go judgment and communication are tested explicitly.",
      },
      {
        id: "qa-cerner-clinical-regression",
        title: "Clinical Workflow Regression Plan",
        prompt:
          "Build a test strategy for a Cerner / Oracle Health release that changes patient scheduling, medication order entry, and lab result delivery across desktop workflows, APIs, and integration feeds.",
        difficulty: "Advanced",
        signal: "Tests risk-based coverage, patient-safety thinking, and how clearly the candidate reasons through a complex release live.",
        starter:
          "Start with the highest-risk clinical workflows, then explain what must be manually explored, what belongs in automation, and what evidence you would need before recommending release.",
        confirms:
          "Confirmed by public healthcare QA, enterprise test engineering, and release-readiness interview patterns that evaluate workflow risk, automation depth, and communication.",
      },
      {
        id: "qa-openai-eval-regression",
        title: "AI Evaluation Regression Gate",
        prompt:
          "Create a release test strategy for an AI assistant update where model behavior, tool calls, safety filters, latency, and answer quality can all regress without a simple pass/fail signal.",
        difficulty: "Expert",
        signal: "Tests AI QA strategy, eval coverage, release risk, and ambiguous failure handling.",
        starter:
          "Start by defining the highest-risk user journeys, then explain which checks belong in automated evals, human review, integration testing, and launch monitoring.",
        confirms:
          "Confirmed by AI QA and release engineering interview patterns that test eval design, regression risk, and production readiness judgment.",
      },
    ],
  },
];
