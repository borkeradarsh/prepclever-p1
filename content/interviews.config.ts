// Block 6 content: the owner's interview pages (GCC AI Interview Map,
// Interview Process (Specific), Do's and Don'ts), transcribed as data with the
// wording kept. Every figure carries its source, as the owner's own notes
// say these come from candidate reports and are not officially published.
//
// TODO(verify): every figure below is candidate-reported. Confirm before launch.
// In particular the "20–35% higher pay" line in companyProcesses.gcc conflicts
// with the "about 15 to 22% more than IT services" figure (Zyoin, via
// 02-roles.md) the landing page uses. Reconcile the two.

import type { Sourced } from "@/types/domain";

const CHECKED_ON = "2026-10-24";

// ---------------------------------------------------------------- general

export type RoundStatus = "core" | "sometimes" | "skipped";

export interface InterviewCell {
  status: RoundStatus;
  focus: string;
  /** A typical question, shown as a quote. */
  question?: string;
}

export interface InterviewLevel {
  id: "fresher" | "mid" | "senior";
  title: string;
  years: string;
  bar: string;
  /** One per round, in round order. */
  cells: InterviewCell[];
}

export interface InterviewMap {
  eyebrow: string;
  title: string;
  facts: ({ value: string; label: string; highlight?: boolean } & Sourced)[];
  rounds: { title: string; note?: string }[];
  levels: InterviewLevel[];
  byLevel: string;
  banks: { title: string; body: string };
  source: Sourced;
}

const mapSource: Sourced = {
  sourceLabel:
    "Compiled from candidate reports (Deloitte, IBM, Amex, Walmart, Accenture, RagaAI), GCC job postings (Goldman Sachs, JPMorgan, Target, PwC) and third-party guides. Public first-hand reports are scarce, so treat round counts as typical, not fixed.",
  checkedOn: CHECKED_ON,
  verified: false,
};

export const interviewMap: InterviewMap = {
  eyebrow: "India GCCs · AI / GenAI engineering · 2026",
  title: "AI engineering interviews at GCCs, by level",
  facts: [
    { value: "3–4 rounds", label: "after the screen", ...mapSource, sourceLabel: "Candidate reports" },
    { value: "2–6 weeks", label: "screen to offer", ...mapSource, sourceLabel: "Candidate reports" },
    { value: "+1 at banks", label: "SQL on transaction data", highlight: true, ...mapSource, sourceLabel: "Candidate reports" },
  ],
  rounds: [
    { title: "Recruiter / HR screen" },
    { title: "Online test" },
    { title: "Coding / GenAI deep dive", note: "Banks: + SQL round here" },
    { title: "Design round" },
    { title: "Behavioural round" },
  ],
  levels: [
    {
      id: "fresher",
      title: "Fresher",
      years: "0–2 years",
      bar: "fundamentals and clean code",
      cells: [
        { status: "core", focus: "Academics, projects, internships, joining date." },
        { status: "core", focus: "The main filter. DSA (easy–medium), SQL, ML multiple-choice." },
        {
          status: "core",
          focus: "Basic Python problems, then ML and LLM fundamentals.",
          question: "What is RAG, and why use it instead of a bare LLM?",
        },
        {
          status: "sometimes",
          focus: "Light: walk through your project's pipeline.",
          question: "How did you pick chunk size in your RAG project?",
        },
        { status: "core", focus: "HR or manager. Team projects, motivation.", question: "Why this GCC over a startup?" },
      ],
    },
    {
      id: "mid",
      title: "Mid-level",
      years: "2–6 years",
      bar: "depth on your own project, plus design",
      cells: [
        { status: "core", focus: "Current stack, notice period, current and expected pay." },
        { status: "sometimes", focus: "DSA plus SQL. Often waived for referrals." },
        {
          status: "core",
          focus: "The deciding round. Short coding, then 45+ min on RAG, agents, your project.",
          question: "RAG vs agents: when would you use each?",
        },
        {
          status: "core",
          focus: "LLM / RAG system design for the company's domain.",
          question: "Design document Q&A over millions of documents.",
        },
        {
          status: "core",
          focus: "Hiring manager. Ownership and trade-offs.",
          question: "A trade-off you made shipping an LLM feature?",
        },
      ],
    },
    {
      id: "senior",
      title: "Senior",
      years: "7+ years",
      bar: "design, trade-offs, production incidents",
      cells: [
        { status: "core", focus: "Scope, team size, notice period. Often via referral or search firm." },
        { status: "skipped", focus: "Usually replaced by a live coding screen, if any." },
        {
          status: "core",
          focus: "Lighter coding. Up to 90 min on LLM internals and production choices.",
          question: "Fine-tune vs RAG vs prompting: how do you decide?",
        },
        {
          status: "core",
          focus: "The heaviest round, sometimes two. Cost, latency, scale.",
          question: "Design a fraud-scoring pipeline with drift monitoring.",
        },
        {
          status: "core",
          focus: "Manager or director. Leadership and incidents.",
          question: "What broke in prod, and how did you fix it?",
        },
      ],
    },
  ],
  byLevel:
    "Freshers are tested on fundamentals. Mid-level candidates win on a real RAG or agent project and its evaluation. Senior candidates face more design and production questions, like “what broke in prod and how did you fix it?”",
  banks: {
    title: "Bank GCCs (Amex, JPMorgan, Goldman Sachs)",
    body: "Expect a SQL / data-analysis round on transaction-style data, with joins, window functions and anomaly spotting. Design rounds lean toward fraud, risk and compliance.",
  },
  source: mapSource,
};

// --------------------------------------------------------------- specific

export type StageKind = "gate" | "peak" | "normal";

export interface CompanyStage {
  label: string;
  title: string;
  detail: string;
  kind: StageKind;
}

export interface CompanyProcess {
  id: "goldman-sachs" | "jpmorgan" | "walmart" | "sap-labs";
  name: string;
  hook: string;
  stats: string[];
  stages: CompanyStage[];
  parallelTrack?: { title: string; body: string };
  watchOut?: string;
}

export interface ComparisonRow {
  companyId: CompanyProcess["id"];
  /** Null cells read "Not reported". */
  eligibility: string | null;
  assessment: string | null;
  rounds: string | null;
  timeline: string | null;
  different: string | null;
  glassdoor: string | null;
}

const companySource: Sourced = {
  sourceLabel:
    "Based on candidate-reported data. Cutoffs, round counts and OA formats shift by campus, team and year, and are not officially published by the companies.",
  checkedOn: CHECKED_ON,
  verified: false,
};

export const companyProcesses = {
  eyebrow: "Freshers · campus and off-campus · India",
  title: "Interview process (specific)",
  lede: "For freshers with an interview coming up at Goldman Sachs, JPMorgan Chase, Walmart Global Tech or SAP Labs India. Lateral hires: the online assessment (OA) and eligibility cutoffs here are fresher-specific and mostly won't apply to you. The technical and managerial rounds are the parts that carry over.",
  tldr: [
    { companyId: "goldman-sachs", text: "pairs a two-question HackerRank OA with a Superday-style behavioural close." },
    { companyId: "jpmorgan", text: "runs a separate Code for Good hackathon funnel alongside its standard Super Day loop." },
    { companyId: "walmart", text: "is the only one of the four that scores SQL as its own dedicated round." },
    { companyId: "sap-labs", text: "filters hardest on paper: 60%+ marks and zero backlogs before you even see the OA." },
  ] as { companyId: CompanyProcess["id"]; text: string }[],
  tldrNote: "None of it looks like the TCS NQT-style aptitude test you may have already prepped for.",
  gcc: {
    title: "What a GCC actually is",
    body: "A Global Capability Centre is a multinational's own India office doing real engineering work for the parent company. It is not a vendor contract, the way TCS or Infosys serve their clients.",
    // TODO(verify): conflicts with the 15–22% Zyoin figure on the landing page.
    figure: {
      value: "20–35% higher",
      label: "pay than comparable IT-services offers, per candidate-reported data",
      sourceLabel: "Candidate-reported data",
      checkedOn: CHECKED_ON,
      verified: false,
    } satisfies { value: string; label: string } & Sourced,
  },
  companies: [
    {
      id: "goldman-sachs",
      name: "Goldman Sachs",
      hook: "Two DSA questions, then the Superday.",
      stats: ["Bengaluru", "67.5% positive", "Difficulty 3.28/5"],
      stages: [
        { label: "Stage 1", title: "HackerRank OA", detail: "2 DSA questions, ~90 min, Easy–Medium", kind: "normal" },
        {
          label: "Stage 2 · 3–4 rounds",
          title: "Technical rounds",
          detail: "DSA, object-oriented design, sometimes a light system or cloud-deployment question",
          kind: "normal",
        },
        {
          label: "Stage 3",
          title: "Superday",
          detail: "Compressed, high-intensity behavioural and technical session, used across Goldman's global offices",
          kind: "peak",
        },
      ],
      watchOut:
        "Interviewers pick a project off your resume and probe it in detail. Listing something you can't defend costs more than a shaky DSA answer.",
    },
    {
      id: "jpmorgan",
      name: "JPMorgan Chase",
      hook: "A standard pipeline, plus a separate hackathon funnel.",
      stats: ["Technology Analyst", "3–5 rounds", "2–4 weeks"],
      stages: [
        {
          label: "Gate",
          title: "CGPA cutoff",
          detail: "Above 8.5 on several campus drives. Varies by campus and year, not officially published",
          kind: "gate",
        },
        {
          label: "Stage 1",
          title: "HackerRank OA",
          detail: "2 questions in 1 hour. Mostly arrays and strings, some DP and graphs",
          kind: "normal",
        },
        { label: "Stage 2", title: "Interview rounds", detail: "Spread over 2–4 weeks", kind: "normal" },
        { label: "Stage 3", title: "Super Day", detail: "3–4 interviews back to back in a single day", kind: "peak" },
      ],
      parallelTrack: {
        title: "Parallel track · Code for Good",
        body: "An annual multi-day hackathon where student teams build technology for nonprofits, with 10,000+ applicants a year. Strong performers can get a path to a pre-placement offer without the full loop. Applications close well before the event, so apply early rather than treating it as a fallback.",
      },
    },
    {
      id: "walmart",
      name: "Walmart Global Tech",
      hook: "The one with a dedicated SQL round.",
      stats: ["4–6 rounds", "~4 weeks", "60.4% positive", "Difficulty 2.98/5"],
      stages: [
        {
          label: "Stage 1",
          title: "HackerRank OA",
          detail: "1–2 Medium–Hard problems in 1 hour, mixing Python, SQL and DSA",
          kind: "normal",
        },
        { label: "Stage 2", title: "Technical rounds", detail: "General DSA and technical questioning", kind: "normal" },
        {
          label: "Distinctive",
          title: "Dedicated SQL round",
          detail: "Scored on its own, not folded into a broader technical round",
          kind: "peak",
        },
        { label: "Close", title: "Remaining rounds", detail: "Up to 4–6 rounds in total", kind: "normal" },
      ],
      watchOut:
        "Amazon, Flipkart and most other loops fold SQL into a general round. If your SQL is rustier than your DSA, this is the company that will expose it. The most moderate difficulty of the four still means a real DSA-plus-SQL bar.",
    },
    {
      id: "sap-labs",
      name: "SAP Labs India",
      hook: "The hardest eligibility filter before you even sit the OA.",
      stats: ["5 stages", "60%+ marks", "0 backlogs"],
      stages: [
        {
          label: "Gate",
          title: "Eligibility",
          detail: "60%+ in 10th, 12th and degree, zero active backlogs",
          kind: "gate",
        },
        {
          label: "Stage 1",
          title: "OA",
          detail: "~25 aptitude MCQs plus 2–3 coding problems, one sitting",
          kind: "normal",
        },
        { label: "Stages 2–3", title: "Two technical rounds", detail: "Coding and CS fundamentals", kind: "normal" },
        {
          label: "Stage 4",
          title: "Managerial round",
          detail: "How you work in a team and prioritise competing asks",
          kind: "peak",
        },
        { label: "Stage 5", title: "HR round", detail: "Closing round", kind: "normal" },
      ],
      watchOut:
        "Candidates underrate the managerial round. It's less about coding under time pressure and closer to the Big Four's combined technical-plus-HR rounds than to Amazon's Bar Raiser.",
    },
  ] as CompanyProcess[],
  comparison: {
    heading: "Side by side",
    columns: {
      company: "Company",
      eligibility: "Eligibility filter",
      assessment: "Online assessment",
      rounds: "Rounds",
      timeline: "Timeline",
      different: "What's different",
      glassdoor: "Glassdoor",
    },
    notReported: "Not reported",
    rows: [
      {
        companyId: "goldman-sachs",
        eligibility: null,
        assessment: "2 DSA, ~90 min, Easy–Medium",
        rounds: "3–4 technical + Superday",
        timeline: null,
        different: "Superday close; deep resume probing",
        glassdoor: "67.5% positive · 3.28/5",
      },
      {
        companyId: "jpmorgan",
        eligibility: "CGPA 8.5+ on some campuses",
        assessment: "2 questions, 60 min, arrays/strings, some DP/graphs",
        rounds: "3–5, ending in Super Day",
        timeline: "2–4 weeks",
        different: "Code for Good hackathon route to a PPO",
        glassdoor: null,
      },
      {
        companyId: "walmart",
        eligibility: null,
        assessment: "1–2 Medium–Hard, 60 min, Python + SQL + DSA",
        rounds: "4–6",
        timeline: "~4 weeks",
        different: "SQL scored as its own round",
        glassdoor: "60.4% positive · 2.98/5",
      },
      {
        companyId: "sap-labs",
        eligibility: "60%+ in 10th/12th/degree, 0 backlogs",
        assessment: "~25 aptitude MCQs + 2–3 coding",
        rounds: "5 stages",
        timeline: null,
        different: "Managerial round on teamwork and priorities",
        glassdoor: null,
      },
    ] as ComparisonRow[],
  },
  source: companySource,
};

// ----------------------------------------------------------- dos and don'ts

export interface AdviceGroup {
  title: string;
  items: string[];
}

export const dosAndDonts: { dos: AdviceGroup[]; donts: AdviceGroup[] } = {
  dos: [
    {
      title: "Before applying",
      items: [
        "Start early. New GCCs hire months before their public launch.",
        "Find the consulting firms setting up new GCCs and talk to their recruiters. Ask how they hire and share the roles you’re targeting.",
        "Build relationships with recruiters over time. They can only put your resume forward if they remember you.",
        "Post on LinkedIn about your projects, what you’re building and what you learned recently.",
        "Join local tech communities and hackathons for your stack. GCCs sponsor these events to meet people.",
        "Apply early to parallel routes such as JPMorgan’s Code for Good. Treat them as a real option, not a backup.",
      ],
    },
    {
      title: "Preparing",
      items: [
        "Check the eligibility cutoffs first (CGPA, 60%+ marks, backlogs) so you don’t waste a cycle.",
        "Prepare for the company’s actual format. Practise Easy–Medium DSA on HackerRank, plus SQL for Walmart and the banks.",
        "Know every project on your resume in depth: why you made each choice, what failed, and how you measured it.",
        "For AI roles, have one RAG or agent project you can explain end to end, including how you evaluated it and what it cost.",
        "Research the company. Know what its India centre builds and why you want that team.",
        "Practise answers out loud. Record yourself and refine until they sound natural, not scripted.",
      ],
    },
    {
      title: "In the interview",
      items: [
        "Keep “Tell me about yourself” to about 60 seconds: your role, one result with a number, and what you want next.",
        "Prove strengths with a short story: the situation, what you did, and the result, with numbers wherever possible.",
        "Give a real weakness and explain what you’re doing to fix it.",
        "Own your failures. Say what went wrong, what you learned and what you changed.",
        "Describe conflicts in terms of how you solved the problem, and keep the outcome professional.",
        "Leave a job on positive terms. Talk about what you’re moving toward.",
        "Give a researched salary range, or ask for the budgeted range first.",
        "Have 2–3 questions ready, such as “What does success look like in the first 90 days?” or “What’s the career path from this role?”",
        "Be clear about your notice period and offer a proper handover.",
      ],
    },
  ],
  donts: [
    {
      title: "Before applying",
      items: [
        "Don’t spam recruiters with “any update?” messages. Share things that are relevant to them instead.",
        "Don’t rely only on LinkedIn or Naukri applications. A single role can get 400–500 applicants.",
        "Don’t fill your LinkedIn with life-lesson posts. Show your work.",
        "Don’t prepare only with TCS NQT-style aptitude tests. GCC assessments look different.",
      ],
    },
    {
      title: "In the interview",
      items: [
        "Don’t list anything on your resume you can’t defend under detailed questioning.",
        "Don’t tell your life story (“I was born in…”) or give a 7-minute introduction.",
        "Don’t make claims you can’t back up (“I’m a hard worker”, “I’m detail-oriented”).",
        "Don’t give fake weaknesses (“I’m a perfectionist”, “I work too hard”).",
        "Don’t criticise your current or past employer, even if they deserve it.",
        "Don’t say “I don’t really fail”, and don’t blame others.",
        "Don’t say “I avoid conflict” or complain about difficult colleagues.",
        "Don’t name money or job security as your main motivation.",
        "Don’t give a single salary number without research, and don’t say “I’ll take anything.”",
        "Don’t say “No, I’m good” when asked if you have questions, and don’t ask only about leave or perks.",
        "Don’t say “I can start tomorrow” if you’re currently employed.",
        "Don’t underrate the managerial and HR rounds. At SAP Labs and in Superday-style rounds, they can decide the offer.",
      ],
    },
  ],
};

/** UI labels for the Block 6 pages. */
export const interviewCopy = {
  legend: "Legend",
  corner: "Level → rounds",
  companiesLabel: "Company processes",
  statusLabels: { core: "Core round", sometimes: "Sometimes", skipped: "Usually skipped" } as Record<RoundStatus, string>,
  statusChips: { core: "Core", sometimes: "Sometimes", skipped: "Skipped" } as Record<RoundStatus, string>,
  roundNumber: (n: number) => `Round ${n}`,
  bar: "Bar:",
  offer: "Offer",
  byLevelTitle: "By level",
  typicalQuestion: "Typical question",
  tldrTitle: "TL;DR",
  watchOut: "Watch out:",
  stagesLabel: (name: string) => `${name} interview stages`,
  dos: "Do",
  donts: "Don't",
  dosTitle: "Do's",
  dontsTitle: "Don'ts",
};
