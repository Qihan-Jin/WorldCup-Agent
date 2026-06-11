# MatchPilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first MatchPilot web app that helps World Cup fans set a favorite team, get personalized match recommendations, create a viewing plan, set local reminders, and ask AI-style planning questions.

**Architecture:** Use a Vite React TypeScript app with focused domain modules for data, profile storage, scoring, planning, insights, reminders, and AI fallback behavior. The app should work without a real LLM or football API key, while keeping provider adapters ready for DeepSeek/OpenAI-compatible APIs and future real match data.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, localStorage, Web Notification API.

---

## File Structure

Create these files and keep responsibilities narrow:

- `package.json`: project scripts and dependencies.
- `index.html`: Vite HTML entry.
- `vite.config.ts`: Vite and Vitest config.
- `tsconfig.json`: TypeScript config.
- `tailwind.config.js`: Tailwind content and theme.
- `postcss.config.js`: Tailwind PostCSS wiring.
- `src/main.tsx`: React root bootstrap.
- `src/App.tsx`: top-level app shell, tab navigation, onboarding gate.
- `src/styles.css`: Tailwind imports and global app styling.
- `src/types.ts`: shared domain types.
- `src/data/mockMatches.ts`: sample 2026 World Cup match data.
- `src/data/matchRepository.ts`: data access interface and mock implementation.
- `src/profile/profileStore.ts`: localStorage-backed user profile persistence.
- `src/scoring/matchScoring.ts`: match recommendation scoring.
- `src/planner/planGenerator.ts`: grouped viewing plan generation.
- `src/insights/insightGenerator.ts`: template-based match context and recap copy.
- `src/reminders/reminderStore.ts`: localStorage-backed reminder persistence.
- `src/reminders/reminderScheduler.ts`: in-app and Web Notification reminder checks.
- `src/ai/aiAdapter.ts`: provider-agnostic Ask AI interface with fallback implementation.
- `src/components/BottomNav.tsx`: mobile bottom navigation.
- `src/components/MatchCard.tsx`: reusable match card.
- `src/components/ReminderModal.tsx`: reminder choice UI.
- `src/pages/OnboardingPage.tsx`: preference setup.
- `src/pages/HomePage.tsx`: daily fan entry point.
- `src/pages/PlanPage.tsx`: personalized viewing plan.
- `src/pages/MatchDetailPage.tsx`: match context and reminder controls.
- `src/pages/AskAiPage.tsx`: AI-style question and plan adjustment UI.
- `src/pages/SettingsPage.tsx`: preference and notification settings.
- `src/test/setup.ts`: test environment setup.
- `src/**/*.test.ts` and `src/**/*.test.tsx`: focused tests beside modules.
- `README.md`: final portfolio README.
- `docs/PRD.md`: product requirement document.
- `docs/agent-workflow.md`: Agent workflow explanation.
- `docs/api-design.md`: mock/API adapter design.
- `docs/reminder-design.md`: reminder behavior and future extension.

---

## Task 1: Scaffold Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create project config files**

Create `package.json`:

```json
{
  "name": "matchpilot",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "lucide-react": "^0.468.0",
    "vite": "^6.0.0",
    "typescript": "^5.6.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.0"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MatchPilot</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

Create `tailwind.config.js`:

```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#08251d",
        lime: "#b7ff4a",
        ink: "#111827"
      }
    }
  },
  plugins: []
};
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **Step 2: Create app entry files**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-pitch text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-6">
        <p className="text-sm uppercase tracking-[0.25em] text-lime">MatchPilot</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Set your team. Plan your World Cup.</h1>
        <p className="mt-4 text-base text-white/75">
          A mobile-first AI planning agent for fans who want the right matches, at the right time.
        </p>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #08251d;
}
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tailwind.config.js postcss.config.js src
git commit -m "chore: scaffold matchpilot app"
```

Expected: commit succeeds. If `.git` writes are blocked by sandbox permissions, note the blocker and continue without committing.

---

## Task 2: Add Domain Types And Mock Match Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data/mockMatches.ts`
- Create: `src/data/matchRepository.ts`
- Create: `src/data/matchRepository.test.ts`

- [ ] **Step 1: Write repository test**

Create `src/data/matchRepository.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAllMatches, getMatchById, getMatchesForTeam } from "./matchRepository";

describe("matchRepository", () => {
  it("returns all mock matches in kickoff order", () => {
    const matches = getAllMatches();

    expect(matches.length).toBeGreaterThan(4);
    expect(matches[0].kickoffUtc <= matches[1].kickoffUtc).toBe(true);
  });

  it("finds matches for a selected team", () => {
    const matches = getMatchesForTeam("Argentina");

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => match.homeTeam === "Argentina" || match.awayTeam === "Argentina")).toBe(true);
  });

  it("finds a match by id", () => {
    const match = getMatchById("m-arg-jpn");

    expect(match?.homeTeam).toBe("Argentina");
    expect(match?.awayTeam).toBe("Japan");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/matchRepository.test.ts`

Expected: FAIL because `matchRepository` does not exist yet.

- [ ] **Step 3: Create domain types**

Create `src/types.ts`:

```ts
export type MatchStage = "Group" | "Round of 32" | "Round of 16" | "Quarter-final" | "Semi-final" | "Final";

export type WatchDepth = "casual" | "regular" | "tactical";

export type SleepTolerance = "none" | "some" | "high";

export type ViewingPriority = "must-watch" | "recommended" | "highlights" | "skip";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  venue: string;
  stage: MatchStage;
  group?: string;
  storylineTags: string[];
  popularity: number;
  qualificationImpact: number;
}

export interface UserProfile {
  favoriteTeam: string;
  otherTeams: string[];
  sleepTolerance: SleepTolerance;
  watchDepth: WatchDepth;
  socialViewing: boolean;
  reminderMinutes: number;
}

export interface ScoredMatch {
  match: Match;
  score: number;
  reasons: string[];
  priority: ViewingPriority;
}

export interface ViewingPlan {
  summary: string;
  groups: Record<ViewingPriority, ScoredMatch[]>;
}

export interface Reminder {
  id: string;
  matchId: string;
  minutesBefore: number;
  triggerAtUtc: string;
  delivered: boolean;
}
```

- [ ] **Step 4: Create mock data and repository**

Create `src/data/mockMatches.ts`:

```ts
import type { Match } from "../types";

export const mockMatches: Match[] = [
  {
    id: "m-arg-jpn",
    homeTeam: "Argentina",
    awayTeam: "Japan",
    kickoffUtc: "2026-06-12T01:00:00.000Z",
    venue: "Los Angeles",
    stage: "Group",
    group: "A",
    storylineTags: ["favorite-team", "technical-midfield", "global-interest"],
    popularity: 92,
    qualificationImpact: 78
  },
  {
    id: "m-bra-fra",
    homeTeam: "Brazil",
    awayTeam: "France",
    kickoffUtc: "2026-06-13T19:00:00.000Z",
    venue: "New York/New Jersey",
    stage: "Group",
    group: "B",
    storylineTags: ["heavyweight", "star-forwards", "social-watch"],
    popularity: 98,
    qualificationImpact: 88
  },
  {
    id: "m-eng-usa",
    homeTeam: "England",
    awayTeam: "USA",
    kickoffUtc: "2026-06-14T02:00:00.000Z",
    venue: "Dallas",
    stage: "Group",
    group: "C",
    storylineTags: ["rivalry", "host-nation", "social-watch"],
    popularity: 90,
    qualificationImpact: 80
  },
  {
    id: "m-ger-mex",
    homeTeam: "Germany",
    awayTeam: "Mexico",
    kickoffUtc: "2026-06-16T00:00:00.000Z",
    venue: "Mexico City",
    stage: "Group",
    group: "D",
    storylineTags: ["host-nation", "classic-upset-risk"],
    popularity: 86,
    qualificationImpact: 76
  },
  {
    id: "m-esp-por",
    homeTeam: "Spain",
    awayTeam: "Portugal",
    kickoffUtc: "2026-06-18T20:00:00.000Z",
    venue: "Miami",
    stage: "Group",
    group: "E",
    storylineTags: ["derby", "technical-game", "must-watch"],
    popularity: 95,
    qualificationImpact: 84
  },
  {
    id: "m-r16-1",
    homeTeam: "Winner Group A",
    awayTeam: "Runner-up Group B",
    kickoffUtc: "2026-06-30T21:00:00.000Z",
    venue: "Seattle",
    stage: "Round of 32",
    storylineTags: ["knockout", "high-stakes"],
    popularity: 82,
    qualificationImpact: 100
  },
  {
    id: "m-final",
    homeTeam: "Finalist 1",
    awayTeam: "Finalist 2",
    kickoffUtc: "2026-07-19T19:00:00.000Z",
    venue: "New York/New Jersey",
    stage: "Final",
    storylineTags: ["final", "global-event", "must-watch"],
    popularity: 100,
    qualificationImpact: 100
  }
];
```

Create `src/data/matchRepository.ts`:

```ts
import type { Match } from "../types";
import { mockMatches } from "./mockMatches";

export function getAllMatches(): Match[] {
  return [...mockMatches].sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
}

export function getMatchById(matchId: string): Match | undefined {
  return getAllMatches().find((match) => match.id === matchId);
}

export function getMatchesForTeam(team: string): Match[] {
  return getAllMatches().filter((match) => match.homeTeam === team || match.awayTeam === team);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/data/matchRepository.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/types.ts src/data
git commit -m "feat: add match domain data"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 3: Add Profile Storage

**Files:**
- Create: `src/profile/profileStore.ts`
- Create: `src/profile/profileStore.test.ts`

- [ ] **Step 1: Write profile store test**

Create `src/profile/profileStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { defaultProfile, loadProfile, saveProfile } from "./profileStore";

describe("profileStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a default profile when no profile exists", () => {
    expect(loadProfile()).toEqual(defaultProfile);
  });

  it("saves and loads a user profile", () => {
    saveProfile({ ...defaultProfile, favoriteTeam: "Japan", socialViewing: true });

    expect(loadProfile().favoriteTeam).toBe("Japan");
    expect(loadProfile().socialViewing).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/profile/profileStore.test.ts`

Expected: FAIL because `profileStore` does not exist yet.

- [ ] **Step 3: Implement profile store**

Create `src/profile/profileStore.ts`:

```ts
import type { UserProfile } from "../types";

const PROFILE_KEY = "matchpilot.profile";

export const defaultProfile: UserProfile = {
  favoriteTeam: "Argentina",
  otherTeams: ["Japan"],
  sleepTolerance: "some",
  watchDepth: "casual",
  socialViewing: true,
  reminderMinutes: 30
};

export function loadProfile(): UserProfile {
  const raw = localStorage.getItem(PROFILE_KEY);

  if (!raw) {
    return defaultProfile;
  }

  try {
    return { ...defaultProfile, ...JSON.parse(raw) } as UserProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/profile/profileStore.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/profile
git commit -m "feat: persist fan profile"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 4: Add Match Scoring And Plan Generation

**Files:**
- Create: `src/scoring/matchScoring.ts`
- Create: `src/scoring/matchScoring.test.ts`
- Create: `src/planner/planGenerator.ts`
- Create: `src/planner/planGenerator.test.ts`

- [ ] **Step 1: Write scoring test**

Create `src/scoring/matchScoring.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { mockMatches } from "../data/mockMatches";
import { defaultProfile } from "../profile/profileStore";
import { scoreMatch } from "./matchScoring";

describe("scoreMatch", () => {
  it("prioritizes the user's favorite team", () => {
    const argentinaMatch = mockMatches.find((match) => match.id === "m-arg-jpn")!;
    const scored = scoreMatch(argentinaMatch, defaultProfile);

    expect(scored.score).toBeGreaterThanOrEqual(80);
    expect(scored.reasons).toContain("Your favorite team is playing.");
  });

  it("marks the final as must-watch", () => {
    const final = mockMatches.find((match) => match.id === "m-final")!;
    const scored = scoreMatch(final, defaultProfile);

    expect(scored.priority).toBe("must-watch");
  });
});
```

- [ ] **Step 2: Write planner test**

Create `src/planner/planGenerator.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAllMatches } from "../data/matchRepository";
import { defaultProfile } from "../profile/profileStore";
import { generateViewingPlan } from "./planGenerator";

describe("generateViewingPlan", () => {
  it("groups matches by viewing priority", () => {
    const plan = generateViewingPlan(getAllMatches(), defaultProfile);

    expect(plan.summary).toContain("Argentina");
    expect(plan.groups["must-watch"].length).toBeGreaterThan(0);
    expect(Object.keys(plan.groups)).toEqual(["must-watch", "recommended", "highlights", "skip"]);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/scoring/matchScoring.test.ts src/planner/planGenerator.test.ts`

Expected: FAIL because scoring and planner modules do not exist yet.

- [ ] **Step 4: Implement scoring**

Create `src/scoring/matchScoring.ts`:

```ts
import type { Match, ScoredMatch, UserProfile, ViewingPriority } from "../types";

function isLateKickoff(kickoffUtc: string): boolean {
  const hour = new Date(kickoffUtc).getUTCHours();
  return hour >= 0 && hour <= 3;
}

function priorityFromScore(score: number): ViewingPriority {
  if (score >= 85) return "must-watch";
  if (score >= 65) return "recommended";
  if (score >= 45) return "highlights";
  return "skip";
}

export function scoreMatch(match: Match, profile: UserProfile): ScoredMatch {
  let score = Math.round(match.popularity * 0.35 + match.qualificationImpact * 0.35);
  const reasons: string[] = [];

  if (match.homeTeam === profile.favoriteTeam || match.awayTeam === profile.favoriteTeam) {
    score += 28;
    reasons.push("Your favorite team is playing.");
  }

  if (profile.otherTeams.includes(match.homeTeam) || profile.otherTeams.includes(match.awayTeam)) {
    score += 12;
    reasons.push("One of your followed teams is involved.");
  }

  if (match.stage !== "Group") {
    score += 18;
    reasons.push("Knockout matches are high-stakes.");
  }

  if (match.storylineTags.includes("social-watch") && profile.socialViewing) {
    score += 8;
    reasons.push("This is a good match to watch with friends.");
  }

  if (isLateKickoff(match.kickoffUtc) && profile.sleepTolerance === "none") {
    score -= 18;
    reasons.push("Kickoff may be too late for your schedule.");
  }

  if (match.storylineTags.includes("must-watch") || match.storylineTags.includes("final")) {
    score += 12;
    reasons.push("This match has major tournament attention.");
  }

  const normalizedScore = Math.max(0, Math.min(100, score));

  return {
    match,
    score: normalizedScore,
    reasons: reasons.length > 0 ? reasons : ["Balanced match with moderate fan interest."],
    priority: priorityFromScore(normalizedScore)
  };
}
```

- [ ] **Step 5: Implement planner**

Create `src/planner/planGenerator.ts`:

```ts
import type { Match, ScoredMatch, UserProfile, ViewingPlan, ViewingPriority } from "../types";
import { scoreMatch } from "../scoring/matchScoring";

const priorities: ViewingPriority[] = ["must-watch", "recommended", "highlights", "skip"];

export function generateViewingPlan(matches: Match[], profile: UserProfile): ViewingPlan {
  const scoredMatches = matches
    .map((match) => scoreMatch(match, profile))
    .sort((a, b) => b.score - a.score);

  const groups = priorities.reduce<Record<ViewingPriority, ScoredMatch[]>>(
    (acc, priority) => {
      acc[priority] = scoredMatches.filter((match) => match.priority === priority);
      return acc;
    },
    {
      "must-watch": [],
      recommended: [],
      highlights: [],
      skip: []
    }
  );

  return {
    summary: `${profile.favoriteTeam} is your anchor team. MatchPilot found ${groups["must-watch"].length} must-watch matches and ${groups.recommended.length} recommended matches for your World Cup plan.`,
    groups
  };
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/scoring/matchScoring.test.ts src/planner/planGenerator.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/scoring src/planner
git commit -m "feat: generate personalized viewing plan"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 5: Add Insights And Ask AI Fallback

**Files:**
- Create: `src/insights/insightGenerator.ts`
- Create: `src/insights/insightGenerator.test.ts`
- Create: `src/ai/aiAdapter.ts`
- Create: `src/ai/aiAdapter.test.ts`

- [ ] **Step 1: Write insight test**

Create `src/insights/insightGenerator.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { mockMatches } from "../data/mockMatches";
import { generateMatchInsight } from "./insightGenerator";

describe("generateMatchInsight", () => {
  it("creates casual fan context for a match", () => {
    const insight = generateMatchInsight(mockMatches[0]);

    expect(insight.title).toContain("Argentina");
    expect(insight.whyItMatters.length).toBeGreaterThan(20);
    expect(insight.watchFor.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Write AI adapter test**

Create `src/ai/aiAdapter.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAllMatches } from "../data/matchRepository";
import { defaultProfile } from "../profile/profileStore";
import { askFallbackAi } from "./aiAdapter";

describe("askFallbackAi", () => {
  it("answers a plan adjustment question without external API", () => {
    const answer = askFallbackAi("I cannot stay up late. Adjust my plan.", defaultProfile, getAllMatches());

    expect(answer).toContain("late");
    expect(answer).toContain("highlights");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/insights/insightGenerator.test.ts src/ai/aiAdapter.test.ts`

Expected: FAIL because modules do not exist yet.

- [ ] **Step 4: Implement insight generator**

Create `src/insights/insightGenerator.ts`:

```ts
import type { Match } from "../types";

export interface MatchInsight {
  title: string;
  whyItMatters: string;
  watchFor: string[];
  recap: string;
}

export function generateMatchInsight(match: Match): MatchInsight {
  const teams = `${match.homeTeam} vs ${match.awayTeam}`;
  const isKnockout = match.stage !== "Group";

  return {
    title: `${teams}: what to know before kickoff`,
    whyItMatters: isKnockout
      ? `${teams} is a ${match.stage} match, so the stakes are direct: one result can define the tournament path.`
      : `${teams} can shape the group story early, especially because this match has a ${match.qualificationImpact}/100 qualification impact score.`,
    watchFor: [
      match.storylineTags.includes("social-watch") ? "A match with enough storylines to watch with friends." : "How both teams manage pressure in key moments.",
      match.storylineTags.includes("technical-game") ? "Midfield control and passing rhythm." : "Early momentum and set-piece chances.",
      match.storylineTags.includes("host-nation") ? "The crowd effect around a host nation storyline." : "Which side creates the clearer chances after halftime."
    ],
    recap: "After the match, this section can summarize key turning points, standout players, and what the result changes."
  };
}
```

- [ ] **Step 5: Implement fallback AI adapter**

Create `src/ai/aiAdapter.ts`:

```ts
import type { Match, UserProfile } from "../types";
import { generateViewingPlan } from "../planner/planGenerator";

export type AiProvider = "fallback" | "deepseek" | "openai-compatible";

export interface AiRequest {
  question: string;
  profile: UserProfile;
  matches: Match[];
}

export interface AiClient {
  provider: AiProvider;
  ask(request: AiRequest): Promise<string>;
}

export function askFallbackAi(question: string, profile: UserProfile, matches: Match[]): string {
  const lower = question.toLowerCase();
  const plan = generateViewingPlan(matches, profile);

  if (lower.includes("late") || lower.includes("熬夜")) {
    return `I would reduce late kickoffs and move lower-priority late matches into highlights. Keep ${profile.favoriteTeam} matches and the final as live-watch candidates.`;
  }

  if (lower.includes(profile.favoriteTeam.toLowerCase())) {
    return `${profile.favoriteTeam} should be your anchor. Start with favorite-team matches, then add ${plan.groups["must-watch"].length} must-watch tournament matches.`;
  }

  return `Based on your ${profile.watchDepth} fan profile, start with must-watch matches, add friend-friendly recommended matches, and use highlights for lower-priority games.`;
}

export const fallbackAiClient: AiClient = {
  provider: "fallback",
  ask: async ({ question, profile, matches }) => askFallbackAi(question, profile, matches)
};
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/insights/insightGenerator.test.ts src/ai/aiAdapter.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/insights src/ai
git commit -m "feat: add match insights and ai fallback"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 6: Add Reminder Storage And Scheduler

**Files:**
- Create: `src/reminders/reminderStore.ts`
- Create: `src/reminders/reminderStore.test.ts`
- Create: `src/reminders/reminderScheduler.ts`
- Create: `src/reminders/reminderScheduler.test.ts`

- [ ] **Step 1: Write reminder store test**

Create `src/reminders/reminderStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { addReminder, listReminders, markReminderDelivered } from "./reminderStore";

describe("reminderStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds and lists reminders", () => {
    addReminder({ matchId: "m-arg-jpn", minutesBefore: 30, kickoffUtc: "2026-06-12T01:00:00.000Z" });

    expect(listReminders()).toHaveLength(1);
    expect(listReminders()[0].triggerAtUtc).toBe("2026-06-12T00:30:00.000Z");
  });

  it("marks a reminder as delivered", () => {
    const reminder = addReminder({ matchId: "m-arg-jpn", minutesBefore: 10, kickoffUtc: "2026-06-12T01:00:00.000Z" });
    markReminderDelivered(reminder.id);

    expect(listReminders()[0].delivered).toBe(true);
  });
});
```

- [ ] **Step 2: Write scheduler test**

Create `src/reminders/reminderScheduler.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Reminder } from "../types";
import { getDueReminders } from "./reminderScheduler";

describe("getDueReminders", () => {
  it("returns undelivered reminders that are due", () => {
    const reminders: Reminder[] = [
      { id: "r1", matchId: "m1", minutesBefore: 30, triggerAtUtc: "2026-06-12T00:30:00.000Z", delivered: false },
      { id: "r2", matchId: "m2", minutesBefore: 30, triggerAtUtc: "2026-06-13T00:30:00.000Z", delivered: false }
    ];

    const due = getDueReminders(reminders, new Date("2026-06-12T00:31:00.000Z"));

    expect(due.map((reminder) => reminder.id)).toEqual(["r1"]);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/reminders/reminderStore.test.ts src/reminders/reminderScheduler.test.ts`

Expected: FAIL because reminder modules do not exist yet.

- [ ] **Step 4: Implement reminder store**

Create `src/reminders/reminderStore.ts`:

```ts
import type { Reminder } from "../types";

const REMINDER_KEY = "matchpilot.reminders";

export interface AddReminderInput {
  matchId: string;
  minutesBefore: number;
  kickoffUtc: string;
}

function saveReminders(reminders: Reminder[]): void {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
}

export function listReminders(): Reminder[] {
  const raw = localStorage.getItem(REMINDER_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Reminder[];
  } catch {
    return [];
  }
}

export function addReminder(input: AddReminderInput): Reminder {
  const kickoff = new Date(input.kickoffUtc);
  const triggerAt = new Date(kickoff.getTime() - input.minutesBefore * 60 * 1000);
  const reminder: Reminder = {
    id: `${input.matchId}-${input.minutesBefore}`,
    matchId: input.matchId,
    minutesBefore: input.minutesBefore,
    triggerAtUtc: triggerAt.toISOString(),
    delivered: false
  };
  const existing = listReminders().filter((item) => item.id !== reminder.id);
  saveReminders([...existing, reminder]);
  return reminder;
}

export function markReminderDelivered(reminderId: string): void {
  saveReminders(
    listReminders().map((reminder) =>
      reminder.id === reminderId ? { ...reminder, delivered: true } : reminder
    )
  );
}
```

- [ ] **Step 5: Implement reminder scheduler**

Create `src/reminders/reminderScheduler.ts`:

```ts
import type { Reminder } from "../types";

export function getDueReminders(reminders: Reminder[], now: Date): Reminder[] {
  return reminders.filter((reminder) => !reminder.delivered && new Date(reminder.triggerAtUtc) <= now);
}

export function notifyReminder(title: string, body: string): void {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/reminders/reminderStore.test.ts src/reminders/reminderScheduler.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/reminders
git commit -m "feat: add local match reminders"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 7: Build Mobile UI Shell And Pages

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/MatchCard.tsx`
- Create: `src/components/ReminderModal.tsx`
- Create: `src/pages/OnboardingPage.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/PlanPage.tsx`
- Create: `src/pages/MatchDetailPage.tsx`
- Create: `src/pages/AskAiPage.tsx`
- Create: `src/pages/SettingsPage.tsx`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write app smoke test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders MatchPilot shell", () => {
    render(<App />);

    expect(screen.getByText("MatchPilot")).toBeInTheDocument();
    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("Ask AI")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails or still uses placeholder app**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because tab labels do not exist yet.

- [ ] **Step 3: Create shared UI components**

Create `src/components/BottomNav.tsx`:

```tsx
import { CalendarDays, Home, MessageCircle, Settings } from "lucide-react";

export type Tab = "home" | "plan" | "ask" | "settings";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const items = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "plan" as const, label: "Plan", icon: CalendarDays },
  { id: "ask" as const, label: "Ask AI", icon: MessageCircle },
  { id: "settings" as const, label: "Settings", icon: Settings }
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-4 border-t border-white/10 bg-[#071b16]/95 px-2 py-2 backdrop-blur">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeTab;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs ${active ? "text-lime" : "text-white/55"}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
```

Create `src/components/MatchCard.tsx`:

```tsx
import { Bell, ChevronRight } from "lucide-react";
import type { ScoredMatch } from "../types";

interface MatchCardProps {
  scoredMatch: ScoredMatch;
  onOpen: () => void;
  onReminder: () => void;
}

export function MatchCard({ scoredMatch, onOpen, onReminder }: MatchCardProps) {
  const { match, score, reasons, priority } = scoredMatch;

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-lime">{match.stage} · {priority}</p>
          <h3 className="mt-1 text-lg font-semibold">{match.homeTeam} vs {match.awayTeam}</h3>
          <p className="mt-1 text-sm text-white/60">{new Date(match.kickoffUtc).toLocaleString()}</p>
        </div>
        <div className="rounded-md bg-lime px-2 py-1 text-sm font-bold text-pitch">{score}</div>
      </div>
      <p className="mt-3 text-sm text-white/75">{reasons[0]}</p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onReminder} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
          <Bell size={16} /> Remind
        </button>
        <button type="button" onClick={onOpen} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-lime px-3 py-2 text-sm font-semibold text-pitch">
          Details <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}
```

Create `src/components/ReminderModal.tsx`:

```tsx
import type { Match } from "../types";

interface ReminderModalProps {
  match: Match | null;
  onClose: () => void;
  onSetReminder: (minutes: number) => void;
}

export function ReminderModal({ match, onClose, onSetReminder }: ReminderModalProps) {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 px-4 pb-4">
      <section className="w-full max-w-md rounded-lg bg-white p-4 text-ink">
        <h2 className="text-lg font-bold">Remind me</h2>
        <p className="mt-1 text-sm text-slate-600">{match.homeTeam} vs {match.awayTeam}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[10, 30, 60].map((minutes) => (
            <button key={minutes} type="button" onClick={() => onSetReminder(minutes)} className="rounded-md bg-pitch px-3 py-3 text-sm font-semibold text-white">
              {minutes} min
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-3 w-full rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold">
          Cancel
        </button>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Create pages**

Create `src/pages/OnboardingPage.tsx`, `src/pages/HomePage.tsx`, `src/pages/PlanPage.tsx`, `src/pages/MatchDetailPage.tsx`, `src/pages/AskAiPage.tsx`, and `src/pages/SettingsPage.tsx` using the domain modules from previous tasks. Keep each page under 120 lines. Use existing functions: `loadProfile`, `saveProfile`, `getAllMatches`, `generateViewingPlan`, `scoreMatch`, `generateMatchInsight`, `fallbackAiClient`, `addReminder`, and `listReminders`.

Required visible text:

- Onboarding: `Choose your team`
- Home: `Your World Cup dashboard`
- Plan: `Your viewing plan`
- Match Detail: `Why it matters`
- Ask AI: `Ask AI`
- Settings: `Settings`

- [ ] **Step 5: Wire pages in `src/App.tsx`**

Replace `src/App.tsx` with:

```tsx
import { useMemo, useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { ReminderModal } from "./components/ReminderModal";
import { getAllMatches, getMatchById } from "./data/matchRepository";
import { loadProfile } from "./profile/profileStore";
import { addReminder, listReminders } from "./reminders/reminderStore";
import type { Match } from "./types";
import { HomePage } from "./pages/HomePage";
import { PlanPage } from "./pages/PlanPage";
import { AskAiPage } from "./pages/AskAiPage";
import { SettingsPage } from "./pages/SettingsPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { MatchDetailPage } from "./pages/MatchDetailPage";

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [reminderMatch, setReminderMatch] = useState<Match | null>(null);
  const [reminderCount, setReminderCount] = useState(listReminders().length);
  const matches = useMemo(() => getAllMatches(), []);
  const selectedMatch = selectedMatchId ? getMatchById(selectedMatchId) : undefined;

  function handleReminder(minutes: number) {
    if (!reminderMatch) return;
    addReminder({ matchId: reminderMatch.id, minutesBefore: minutes, kickoffUtc: reminderMatch.kickoffUtc });
    setReminderCount(listReminders().length);
    setReminderMatch(null);
  }

  return (
    <main className="min-h-screen bg-pitch text-white">
      <div className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-lime">MatchPilot</p>
            <p className="text-sm text-white/55">AI World Cup Planning Agent</p>
          </div>
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs">{reminderCount} reminders</span>
        </header>

        {!profile.favoriteTeam ? (
          <OnboardingPage profile={profile} onProfileChange={setProfile} />
        ) : selectedMatch ? (
          <MatchDetailPage match={selectedMatch} onBack={() => setSelectedMatchId(null)} onReminder={() => setReminderMatch(selectedMatch)} />
        ) : activeTab === "home" ? (
          <HomePage profile={profile} matches={matches} onOpenMatch={setSelectedMatchId} onReminder={setReminderMatch} />
        ) : activeTab === "plan" ? (
          <PlanPage profile={profile} matches={matches} onOpenMatch={setSelectedMatchId} onReminder={setReminderMatch} />
        ) : activeTab === "ask" ? (
          <AskAiPage profile={profile} matches={matches} />
        ) : (
          <SettingsPage profile={profile} onProfileChange={setProfile} />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => { setSelectedMatchId(null); setActiveTab(tab); }} />
      <ReminderModal match={reminderMatch} onClose={() => setReminderMatch(null)} onSetReminder={handleReminder} />
    </main>
  );
}
```

- [ ] **Step 6: Run app test**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 7: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git add src
git commit -m "feat: build matchpilot mobile interface"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 8: Add DeepSeek/OpenAI-Compatible Adapter Documentation Hook

**Files:**
- Modify: `src/ai/aiAdapter.ts`
- Create: `src/ai/providerConfig.ts`
- Create: `src/ai/providerConfig.test.ts`

- [ ] **Step 1: Write provider config test**

Create `src/ai/providerConfig.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAiProviderConfig } from "./providerConfig";

describe("getAiProviderConfig", () => {
  it("defaults to fallback provider", () => {
    const config = getAiProviderConfig({});

    expect(config.provider).toBe("fallback");
  });

  it("supports deepseek provider when configured", () => {
    const config = getAiProviderConfig({
      VITE_AI_PROVIDER: "deepseek",
      VITE_DEEPSEEK_API_KEY: "test-key"
    });

    expect(config.provider).toBe("deepseek");
    expect(config.baseUrl).toContain("deepseek");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ai/providerConfig.test.ts`

Expected: FAIL because provider config does not exist yet.

- [ ] **Step 3: Implement provider config**

Create `src/ai/providerConfig.ts`:

```ts
import type { AiProvider } from "./aiAdapter";

export interface AiProviderConfig {
  provider: AiProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export function getAiProviderConfig(env: Record<string, string | undefined>): AiProviderConfig {
  if (env.VITE_AI_PROVIDER === "deepseek" && env.VITE_DEEPSEEK_API_KEY) {
    return {
      provider: "deepseek",
      apiKey: env.VITE_DEEPSEEK_API_KEY,
      baseUrl: "https://api.deepseek.com",
      model: env.VITE_DEEPSEEK_MODEL ?? "deepseek-chat"
    };
  }

  if (env.VITE_AI_PROVIDER === "openai-compatible" && env.VITE_OPENAI_COMPATIBLE_API_KEY) {
    return {
      provider: "openai-compatible",
      apiKey: env.VITE_OPENAI_COMPATIBLE_API_KEY,
      baseUrl: env.VITE_OPENAI_COMPATIBLE_BASE_URL,
      model: env.VITE_OPENAI_COMPATIBLE_MODEL ?? "gpt-5-mini"
    };
  }

  return { provider: "fallback" };
}
```

- [ ] **Step 4: Keep `aiAdapter.ts` network-free in MVP**

Add this comment near the top of `src/ai/aiAdapter.ts`:

```ts
// MVP note: the UI uses fallbackAiClient by default. Real DeepSeek/OpenAI-compatible calls should be routed through a backend proxy before production deployment so browser bundles do not expose API keys.
```

- [ ] **Step 5: Run test**

Run: `npm test -- src/ai/providerConfig.test.ts src/ai/aiAdapter.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/ai
git commit -m "docs: prepare configurable ai provider adapter"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 9: Add Portfolio Documentation

**Files:**
- Create: `README.md`
- Create: `docs/PRD.md`
- Create: `docs/agent-workflow.md`
- Create: `docs/api-design.md`
- Create: `docs/reminder-design.md`

- [ ] **Step 1: Create README**

Create `README.md` with these sections:

```md
# MatchPilot

MatchPilot is a mobile-first AI World Cup planning agent for ordinary football fans. It helps users choose a favorite team, rank important matches, generate a personalized viewing plan, and set local reminders before kickoff.

## Features

- Favorite team and fan preference setup
- Personalized match ranking
- Must-watch, recommended, highlights, and skip groups
- Match detail cards with casual-fan context
- Local match reminders
- Ask AI fallback for plan adjustment
- API-ready data and LLM provider architecture

## Tech Stack

- Vite React
- TypeScript
- Tailwind CSS
- Vitest
- localStorage
- Web Notification API

## Run Locally

```bash
npm install
npm run dev
```

## Portfolio Notes

This project is built to demonstrate AI product thinking and agent workflow design. The MVP uses mock data and deterministic fallback logic so the demo works without paid APIs, while the architecture leaves room for DeepSeek, OpenAI-compatible LLMs, and football data APIs.
```
```

- [ ] **Step 2: Create docs from spec**

Create `docs/PRD.md`, `docs/agent-workflow.md`, `docs/api-design.md`, and `docs/reminder-design.md` by extracting the relevant sections from `docs/superpowers/specs/2026-06-03-matchpilot-design-zh.md`.

Each file must include:

- A clear title.
- The product goal.
- MVP behavior.
- Out-of-scope items where relevant.
- Future extension notes.

- [ ] **Step 3: Commit**

Run:

```bash
git add README.md docs
git commit -m "docs: add portfolio project documentation"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Task 10: Final Verification And Browser QA

**Files:**
- Modify only files needed to fix issues found during verification.

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: build PASS.

- [ ] **Step 3: Start dev server**

Run: `npm run dev`

Expected: Vite starts on a local URL such as `http://127.0.0.1:5173`.

- [ ] **Step 4: Browser QA**

Open the local app and verify:

- Home renders without console errors.
- Bottom navigation switches Home, Plan, Ask AI, and Settings.
- Match cards render with readable text on mobile width.
- Reminder modal opens and saves a reminder.
- Ask AI returns a fallback answer.
- Match detail page shows `Why it matters`.

- [ ] **Step 5: Fix any verification failures**

For each failure, write or update a test that reproduces it, then make the smallest implementation change needed.

- [ ] **Step 6: Final commit**

Run:

```bash
git add .
git commit -m "chore: verify matchpilot mvp"
```

Expected: commit succeeds or permission blocker is recorded.

---

## Self-Review

Spec coverage:

- Favorite team setup: covered by Tasks 3 and 7.
- Match data: covered by Task 2.
- Personalized ranking and plan: covered by Task 4.
- Match context: covered by Task 5.
- Ask AI fallback and model adapter strategy: covered by Tasks 5 and 8.
- Reminders: covered by Task 6 and UI wiring in Task 7.
- Portfolio documentation: covered by Task 9.
- Verification and browser QA: covered by Task 10.

Placeholder scan:

- No unresolved placeholder markers are intentionally left in implementation steps.
- Real football API and production LLM calls are intentionally documented as future extensions because the MVP must run without paid keys.

Type consistency:

- Shared types live in `src/types.ts`.
- Planner, scoring, reminders, insights, and AI modules use those shared interfaces.
- UI pages consume the same `Match`, `UserProfile`, and `ScoredMatch` shapes.
