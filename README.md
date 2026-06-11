# MatchPilot

![AI Agent](https://img.shields.io/badge/AI%20Agent-Viewing%20Planner-2A398D)
![Portfolio MVP](https://img.shields.io/badge/Portfolio-MVP-16A34A)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![WeChat Mini Program](https://img.shields.io/badge/WeChat-Mini%20Program-07C160?logo=wechat&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-36%20passing-22C55E)

MatchPilot is a portfolio MVP for an AI product manager: a mobile-first World Cup 2026 viewing planner that helps casual fans decide what to watch, understand why a match matters, and set reminders before kickoff.

The repository contains two complementary deliverables:

- `src/`: a Vite React prototype for the AI viewing-planning experience.
- `worldcup-miniapp/`: a WeChat Mini Program MVP focused on team selection, fixtures, standings, knockout bracket, match detail, and reminders.

## Product Positioning

**One-liner:** Set your team. Plan your World Cup.

Most casual fans do not need another raw fixture table. They need help answering:

- Which match should I watch tonight?
- When does my favorite team play next?
- Why is this match worth my time?
- Can I avoid missing important matches?

MatchPilot frames that workflow as an AI planning agent rather than a generic sports app.

## AI Product Design

The planned agent workflow is split into focused modules:

- **Profile Collector:** captures favorite team, viewing depth, late-night tolerance, and reminder preference.
- **Match Ranker:** scores fixtures using team relevance, match stage, time friendliness, and storyline value.
- **Plan Generator:** groups matches into must-watch, recommended, highlights, and skippable buckets.
- **Context Explainer:** translates match context into plain-language talking points for casual fans.
- **Reminder Agent:** stores reminder intent and prepares future push-notification integration.

The React prototype demonstrates the AI planning shape with deterministic fallback logic. The Mini Program implements the stronger utility loop first: choose language and team, check schedule, view match details, follow standings and knockout rounds, and set reminders.

## Implemented Features

### React Prototype

- Mobile-first onboarding and preference storage.
- Personalized home page and viewing-plan page.
- Rule-based match scoring and plan generation.
- Ask AI page with fallback responses.
- Reminder modal and local reminder storage.
- Tested domain modules for scoring, planning, insights, AI fallback, fixtures, and reminders.

### WeChat Mini Program

- Chinese/English language selection.
- Favorite-team selection with search.
- Home dashboard with next match, countdown, today's matches, team schedule, and reminders.
- Calendar-style schedule view.
- Match detail page with overview, squads, status, Beijing time, local time, venue, and reminders.
- Group standings with favorite-team highlighting.
- Knockout bracket view.
- football-data.org API adapter with short local cache.

## Data Strategy

The portfolio prototype defaults to local verified fixture samples so the app can be reviewed without paid data access. The codebase also keeps an API-ready path:

- React adapter: `src/data/fixtures/footballDataOrgAdapter.ts`
- Mini Program adapter: `worldcup-miniapp/utils/api.js`

No real API keys are committed. Use `.env.example` for backend proxy configuration and `worldcup-miniapp/utils/api-config.js` for local Mini Program experiments.

## Run Locally

Install dependencies from the repository root:

```bash
npm install
```

Run the React prototype:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Open the Mini Program by importing `worldcup-miniapp/` in WeChat DevTools. To call football-data.org locally, put your own API key in `worldcup-miniapp/utils/api-config.js` before running, and do not commit the key.

## Portfolio Notes

This project is intended to show AI product management thinking across user problem framing, MVP scoping, agent workflow design, fallback behavior, data-source strategy, and hands-on prototype delivery.

Current public-facing scope:

- Implemented: fixture browsing, team focus, standings, knockout bracket, match detail, reminders, React AI-planning prototype.
- Planned next: move AI viewing-plan and Ask AI flows into the Mini Program, replace placeholder squad/stat content with verified sources, and add cloud-backed scheduled notifications.

See [docs/portfolio-case-study.md](docs/portfolio-case-study.md) for the product case study.
