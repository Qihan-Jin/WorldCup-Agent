# MatchPilot 中文实现计划

> **给后续执行者的要求：** 实施本计划时，需要使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，按任务逐步执行。每一步使用 checkbox（`- [ ]`）跟踪进度。

**目标：** 构建一个移动端优先的 MatchPilot 网页应用，帮助世界杯球迷设置主队、获得个性化比赛推荐、生成观赛计划、设置本地比赛提醒，并使用 Ask AI 调整计划或回答观赛问题。

**架构：** 使用 Vite React TypeScript 构建前端应用，并把业务逻辑拆成清晰模块：数据、用户偏好、比赛评分、计划生成、比赛看点、提醒和 AI fallback。应用在没有真实 LLM 或足球数据 API key 的情况下也可以运行，同时预留 DeepSeek/OpenAI-compatible API 和真实赛程数据接入能力。

**技术栈：** Vite、React、TypeScript、Tailwind CSS、Vitest、React Testing Library、localStorage、Web Notification API。

---

## 文件结构

需要创建以下文件，并保持每个文件职责清晰：

- `package.json`：项目脚本和依赖。
- `index.html`：Vite HTML 入口。
- `vite.config.ts`：Vite 和 Vitest 配置。
- `tsconfig.json`：TypeScript 配置。
- `tailwind.config.js`：Tailwind 内容路径和主题。
- `postcss.config.js`：Tailwind PostCSS 配置。
- `src/main.tsx`：React 启动入口。
- `src/App.tsx`：顶层应用壳、底部导航、页面切换。
- `src/styles.css`：Tailwind 引入和全局样式。
- `src/types.ts`：共享业务类型。
- `src/data/mockMatches.ts`：世界杯 mock 比赛数据。
- `src/data/matchRepository.ts`：比赛数据访问接口和 mock 实现。
- `src/profile/profileStore.ts`：基于 localStorage 的用户偏好存储。
- `src/scoring/matchScoring.ts`：比赛推荐评分逻辑。
- `src/planner/planGenerator.ts`：观赛计划生成逻辑。
- `src/insights/insightGenerator.ts`：模板式赛前看点和赛后复盘文案。
- `src/reminders/reminderStore.ts`：基于 localStorage 的提醒存储。
- `src/reminders/reminderScheduler.ts`：站内提醒和 Web Notification 检查。
- `src/ai/aiAdapter.ts`：模型无关 Ask AI 接口和 fallback 实现。
- `src/components/BottomNav.tsx`：移动端底部导航。
- `src/components/MatchCard.tsx`：通用比赛卡片。
- `src/components/ReminderModal.tsx`：提醒设置弹窗。
- `src/pages/OnboardingPage.tsx`：用户偏好设置页。
- `src/pages/HomePage.tsx`：球迷首页。
- `src/pages/PlanPage.tsx`：个性化观赛计划页。
- `src/pages/MatchDetailPage.tsx`：比赛详情和看点页。
- `src/pages/AskAiPage.tsx`：Ask AI 问答页。
- `src/pages/SettingsPage.tsx`：设置页。
- `src/test/setup.ts`：测试环境设置。
- `src/**/*.test.ts` 和 `src/**/*.test.tsx`：模块旁边的测试文件。
- `README.md`：作品集 README。
- `docs/PRD.md`：产品需求文档。
- `docs/agent-workflow.md`：Agent 工作流说明。
- `docs/api-design.md`：数据层和 API 设计。
- `docs/reminder-design.md`：提醒功能设计。

---

## 任务 1：搭建 Vite React TypeScript 项目

**文件：**
- 创建：`package.json`
- 创建：`index.html`
- 创建：`vite.config.ts`
- 创建：`tsconfig.json`
- 创建：`tailwind.config.js`
- 创建：`postcss.config.js`
- 创建：`src/main.tsx`
- 创建：`src/App.tsx`
- 创建：`src/styles.css`
- 创建：`src/test/setup.ts`

- [ ] **步骤 1：创建项目配置文件**

创建 `package.json`：

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

创建 `index.html`：

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

创建 `vite.config.ts`：

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

创建 `tsconfig.json`：

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

创建 `tailwind.config.js`：

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

创建 `postcss.config.js`：

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **步骤 2：创建应用入口文件**

创建 `src/main.tsx`：

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

创建 `src/App.tsx`：

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

创建 `src/styles.css`：

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

创建 `src/test/setup.ts`：

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **步骤 3：安装依赖**

运行：`npm install`

预期结果：依赖安装成功，并生成 `package-lock.json`。

- [ ] **步骤 4：运行构建**

运行：`npm run build`

预期结果：TypeScript 和 Vite 构建成功。

- [ ] **步骤 5：提交**

运行：

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tailwind.config.js postcss.config.js src
git commit -m "chore: scaffold matchpilot app"
```

预期结果：提交成功。如果当前环境无法写入 `.git`，记录权限阻塞并继续开发。

---

## 任务 2：添加业务类型和 mock 比赛数据

**文件：**
- 创建：`src/types.ts`
- 创建：`src/data/mockMatches.ts`
- 创建：`src/data/matchRepository.ts`
- 创建：`src/data/matchRepository.test.ts`

- [ ] **步骤 1：编写数据仓库测试**

创建 `src/data/matchRepository.test.ts`：

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

- [ ] **步骤 2：运行测试，确认失败**

运行：`npm test -- src/data/matchRepository.test.ts`

预期结果：失败，因为 `matchRepository` 还不存在。

- [ ] **步骤 3：创建业务类型**

创建 `src/types.ts`：

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

- [ ] **步骤 4：创建 mock 数据和数据仓库**

创建 `src/data/mockMatches.ts` 和 `src/data/matchRepository.ts`，内容与英文实现计划 Task 2 保持一致。

- [ ] **步骤 5：运行测试，确认通过**

运行：`npm test -- src/data/matchRepository.test.ts`

预期结果：通过。

- [ ] **步骤 6：提交**

运行：

```bash
git add src/types.ts src/data
git commit -m "feat: add match domain data"
```

预期结果：提交成功，或记录权限阻塞。

---

## 任务 3：添加用户偏好存储

**文件：**
- 创建：`src/profile/profileStore.ts`
- 创建：`src/profile/profileStore.test.ts`

目标：用 localStorage 保存用户主队、看球深度、熬夜接受度、社交观赛和默认提醒偏好。

执行步骤：

- [ ] 先创建 `profileStore.test.ts`，验证没有数据时返回默认 profile，并能保存/读取用户 profile。
- [ ] 运行 `npm test -- src/profile/profileStore.test.ts`，确认失败。
- [ ] 创建 `profileStore.ts`，导出 `defaultProfile`、`loadProfile()` 和 `saveProfile(profile)`。
- [ ] 再次运行测试，确认通过。
- [ ] 提交：`git add src/profile && git commit -m "feat: persist fan profile"`。

---

## 任务 4：添加比赛评分和观赛计划生成

**文件：**
- 创建：`src/scoring/matchScoring.ts`
- 创建：`src/scoring/matchScoring.test.ts`
- 创建：`src/planner/planGenerator.ts`
- 创建：`src/planner/planGenerator.test.ts`

目标：根据用户主队、比赛阶段、比赛热度、出线影响、是否适合社交观看等因素，生成比赛优先级和观赛计划。

执行步骤：

- [ ] 编写 `matchScoring.test.ts`，验证主队比赛会获得高分，决赛会进入必看。
- [ ] 编写 `planGenerator.test.ts`，验证计划会分为 `must-watch`、`recommended`、`highlights`、`skip`。
- [ ] 运行相关测试，确认失败。
- [ ] 实现 `scoreMatch(match, profile)`。
- [ ] 实现 `generateViewingPlan(matches, profile)`。
- [ ] 运行测试，确认通过。
- [ ] 提交：`git add src/scoring src/planner && git commit -m "feat: generate personalized viewing plan"`。

---

## 任务 5：添加赛前看点和 Ask AI fallback

**文件：**
- 创建：`src/insights/insightGenerator.ts`
- 创建：`src/insights/insightGenerator.test.ts`
- 创建：`src/ai/aiAdapter.ts`
- 创建：`src/ai/aiAdapter.test.ts`

目标：在不接真实大模型的情况下，先用规则和模板生成类似 AI 的回答，保证 Demo 可运行。

执行步骤：

- [ ] 编写 `insightGenerator.test.ts`，验证比赛详情能生成标题、重要性说明和看点。
- [ ] 编写 `aiAdapter.test.ts`，验证用户说“不能熬夜”时 fallback AI 会建议减少 late kickoff 并改看 highlights。
- [ ] 运行测试，确认失败。
- [ ] 实现 `generateMatchInsight(match)`。
- [ ] 实现 `askFallbackAi(question, profile, matches)` 和 `fallbackAiClient`。
- [ ] 运行测试，确认通过。
- [ ] 提交：`git add src/insights src/ai && git commit -m "feat: add match insights and ai fallback"`。

---

## 任务 6：添加提醒存储和提醒调度

**文件：**
- 创建：`src/reminders/reminderStore.ts`
- 创建：`src/reminders/reminderStore.test.ts`
- 创建：`src/reminders/reminderScheduler.ts`
- 创建：`src/reminders/reminderScheduler.test.ts`

目标：支持用户为比赛设置开赛前 10 分钟、30 分钟或 1 小时提醒。第一版使用 localStorage 和页面内定时检查。

执行步骤：

- [ ] 编写 `reminderStore.test.ts`，验证添加提醒后能保存，且触发时间计算正确。
- [ ] 编写 `reminderScheduler.test.ts`，验证到时间但未 delivered 的提醒会被识别为 due。
- [ ] 运行测试，确认失败。
- [ ] 实现 `addReminder()`、`listReminders()` 和 `markReminderDelivered()`。
- [ ] 实现 `getDueReminders()` 和 `notifyReminder()`。
- [ ] 运行测试，确认通过。
- [ ] 提交：`git add src/reminders && git commit -m "feat: add local match reminders"`。

---

## 任务 7：构建移动端 UI 和页面

**文件：**
- 修改：`src/App.tsx`
- 创建：`src/components/BottomNav.tsx`
- 创建：`src/components/MatchCard.tsx`
- 创建：`src/components/ReminderModal.tsx`
- 创建：`src/pages/OnboardingPage.tsx`
- 创建：`src/pages/HomePage.tsx`
- 创建：`src/pages/PlanPage.tsx`
- 创建：`src/pages/MatchDetailPage.tsx`
- 创建：`src/pages/AskAiPage.tsx`
- 创建：`src/pages/SettingsPage.tsx`
- 创建：`src/App.test.tsx`

目标：把前面的业务能力连接成一个可以操作的移动端网页应用。

页面必须包含：

- Onboarding：`Choose your team`
- Home：`Your World Cup dashboard`
- Plan：`Your viewing plan`
- Match Detail：`Why it matters`
- Ask AI：`Ask AI`
- Settings：`Settings`

执行步骤：

- [ ] 编写 `App.test.tsx`，验证页面存在 `MatchPilot`、`Plan`、`Ask AI`。
- [ ] 运行测试，确认当前初始应用无法通过。
- [ ] 创建 `BottomNav`、`MatchCard`、`ReminderModal`。
- [ ] 创建 6 个页面文件，并调用前面实现的业务模块。
- [ ] 更新 `App.tsx`，完成页面切换、比赛详情打开、提醒弹窗和提醒数量展示。
- [ ] 运行 `npm test -- src/App.test.tsx`。
- [ ] 运行 `npm run build`。
- [ ] 提交：`git add src && git commit -m "feat: build matchpilot mobile interface"`。

---

## 任务 8：添加 DeepSeek/OpenAI-compatible 配置预留

**文件：**
- 修改：`src/ai/aiAdapter.ts`
- 创建：`src/ai/providerConfig.ts`
- 创建：`src/ai/providerConfig.test.ts`

目标：让项目架构支持 DeepSeek 或 OpenAI-compatible API，但第一版默认不在浏览器里直接暴露 API key。

执行步骤：

- [ ] 编写 `providerConfig.test.ts`，验证默认 provider 是 `fallback`。
- [ ] 测试 DeepSeek 配置：当存在 `VITE_AI_PROVIDER=deepseek` 和 `VITE_DEEPSEEK_API_KEY` 时，provider 返回 `deepseek`。
- [ ] 运行测试，确认失败。
- [ ] 实现 `getAiProviderConfig(env)`。
- [ ] 在 `aiAdapter.ts` 顶部加入说明：生产环境真实模型调用应通过后端代理，避免前端暴露 API key。
- [ ] 运行测试，确认通过。
- [ ] 提交：`git add src/ai && git commit -m "docs: prepare configurable ai provider adapter"`。

---

## 任务 9：添加作品集文档

**文件：**
- 创建：`README.md`
- 创建：`docs/PRD.md`
- 创建：`docs/agent-workflow.md`
- 创建：`docs/api-design.md`
- 创建：`docs/reminder-design.md`

目标：让 GitHub 仓库不仅有代码，也能展示产品思考、Agent 架构和后续扩展设计。

执行步骤：

- [ ] 创建 `README.md`，包含项目介绍、功能、技术栈、本地运行方式、作品集说明。
- [ ] 创建 `docs/PRD.md`，说明用户、问题、MVP 范围和成功标准。
- [ ] 创建 `docs/agent-workflow.md`，说明 Profile Collector、Match Ranker、Plan Generator、Context Explainer、Reminder Agent、Plan Adjuster。
- [ ] 创建 `docs/api-design.md`，说明 mock 数据、未来 football API adapter 和 LLM provider adapter。
- [ ] 创建 `docs/reminder-design.md`，说明本地提醒、浏览器通知和未来服务端推送。
- [ ] 提交：`git add README.md docs && git commit -m "docs: add portfolio project documentation"`。

---

## 任务 10：最终验证和浏览器 QA

**文件：**
- 只修改验证过程中发现问题所需的文件。

目标：确认项目能运行、能构建、核心用户路径可用。

执行步骤：

- [ ] 运行完整测试：`npm test`，预期全部通过。
- [ ] 运行生产构建：`npm run build`，预期通过。
- [ ] 启动本地开发服务器：`npm run dev`。
- [ ] 打开本地页面，验证首页没有控制台错误。
- [ ] 验证底部导航可切换 Home、Plan、Ask AI、Settings。
- [ ] 验证比赛卡片在手机宽度下文字可读。
- [ ] 验证提醒弹窗可以打开并保存提醒。
- [ ] 验证 Ask AI 可以返回 fallback 回答。
- [ ] 验证比赛详情页显示 `Why it matters`。
- [ ] 如果发现问题，先补测试，再做最小修复。
- [ ] 最终提交：`git add . && git commit -m "chore: verify matchpilot mvp"`。

---

## 自检结果

规格覆盖：

- 主队设置：任务 3 和任务 7 覆盖。
- 比赛数据：任务 2 覆盖。
- 个性化评分和观赛计划：任务 4 覆盖。
- 比赛看点：任务 5 覆盖。
- Ask AI fallback 和模型 adapter：任务 5 和任务 8 覆盖。
- 比赛提醒：任务 6 和任务 7 覆盖。
- 作品集文档：任务 9 覆盖。
- 最终验证和浏览器 QA：任务 10 覆盖。

类型一致性：

- 共享类型统一放在 `src/types.ts`。
- planner、scoring、reminders、insights、ai 模块都使用共享类型。
- UI 页面统一消费 `Match`、`UserProfile` 和 `ScoredMatch`。

范围控制：

- 第一版不依赖真实足球 API。
- 第一版不强依赖真实大模型。
- DeepSeek/OpenAI-compatible API 作为可扩展 adapter 保留。
- 项目优先保证作品集 Demo 稳定可运行。
