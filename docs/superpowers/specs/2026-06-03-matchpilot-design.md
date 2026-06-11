# MatchPilot Design Spec

## Product Summary

MatchPilot is a mobile-first AI World Cup planning agent for ordinary football fans who have limited time but want to participate in the 2026 FIFA World Cup in a smarter way.

The product helps users set their favorite team, understand which matches matter, create a personalized viewing plan, and receive match reminders. It also provides lightweight pre-match context, a post-match recap section for completed matches, and an AI assistant for plan adjustments and football questions.

Tagline:

> Set your team. Plan your World Cup.

## Target Users

Primary users are casual or semi-casual football fans who:

- Want to follow the World Cup but cannot watch every match.
- Have a favorite team, player, or region.
- Need help choosing which matches are worth watching live.
- Want simple context before matches without reading long tactical articles.
- May want reminders before important matches.

Heavy football fans can still use MatchPilot, but the first version is optimized for ordinary fans who need guidance, filtering, and planning.

## Core Problem

World Cup information is abundant but fragmented. A casual fan needs to answer practical questions:

- Which matches should I watch live?
- When is my favorite team playing?
- Which matches can I safely skip or watch as highlights?
- What should I know before a match starts?
- Can I get reminded before important matches?

MatchPilot turns raw match schedules and user preferences into a clear personal viewing plan.

## MVP Scope

The first version should be a mobile-first web app or PWA with a mini-program-like experience.

In scope:

- Favorite team setup.
- User preference setup, including available viewing time, sleep tolerance, football knowledge level, and reminder preference.
- Home page with favorite team's next match, recommended matches, and reminder status.
- Personalized viewing plan with must-watch, recommended, highlights-only, and skippable matches.
- Match detail page with importance score, viewing reason, pre-match context, and reminder controls.
- Ask AI page for plan adjustment and football-related questions.
- Browser-based reminder simulation using local storage, timers, and optional Web Notification permission.
- Mock World Cup match data as the default data source.
- A data access layer that can later switch from mock data to a football API.
- Documentation for product thinking, agent workflow, and future API integration.

Out of scope for the first version:

- Real account login.
- Server-side push notification.
- Payment features.
- Full social/community features.
- Live minute-by-minute match tracking.
- Betting, odds, or gambling-related features.
- Full tactical analysis or paid sports data feeds.
- Official WeChat mini-program release.

## User Journey

1. The user opens MatchPilot on mobile.
2. The user chooses a favorite team or asks the app to recommend one.
3. The user sets viewing preferences, such as whether they can stay up late, which days they are free, and how deeply they follow football.
4. MatchPilot creates a personalized World Cup home page.
5. The user sees their favorite team's next match and the top recommended matches.
6. The user opens a generated viewing plan and sees matches grouped by priority.
7. The user opens a match detail page, reads why the match matters, and sets a reminder.
8. The user can ask AI to adjust the plan, such as "only show weekend matches" or "I cannot stay up late."

## Pages

### Onboarding

Purpose: collect enough information to personalize the experience.

Key elements:

- Favorite team selector.
- Option for "I do not have a team yet."
- Viewing availability.
- Sleep tolerance.
- Football knowledge level.
- Social viewing preference.
- Default reminder preference.

### Home

Purpose: daily entry point for fans.

Key elements:

- Favorite team's next match.
- Today's or upcoming recommended matches.
- Match cards with importance score, start time, and recommendation reason.
- Active reminders.
- Entry point to the AI viewing plan.

### Plan

Purpose: show the generated personal World Cup viewing plan.

Key elements:

- Plan summary.
- Must-watch matches.
- Recommended matches.
- Highlights-only matches.
- Skippable matches.
- Adjustment actions, such as "make it lighter", "only weekends", or "focus on my team."

### Match Detail

Purpose: help users decide whether and how to watch one match.

Key elements:

- Teams, date, time, and stage.
- Importance score.
- Why this match matters.
- Key players or storylines.
- Casual-fan explanation.
- Reminder settings.
- Post-match recap section for completed matches.

### Ask AI

Purpose: provide controlled AI assistance around planning and match context.

Example questions:

- Which match should I watch tonight?
- I only follow Argentina. What should I watch next?
- I cannot stay up late this week. Adjust my plan.
- Why is this match important?
- Which matches are good for watching with friends?

### Settings

Purpose: allow the user to change preferences.

Key elements:

- Favorite team.
- Viewing availability.
- Reminder preferences.
- Notification permission status.
- Data source status.

## Agent Workflow

MatchPilot's AI behavior should be structured as an agent workflow instead of an open-ended chatbot.

### Profile Collector

Collects and stores user preferences:

- Favorite team.
- Other interested teams or players.
- Available watching windows.
- Sleep tolerance.
- Football knowledge level.
- Social viewing preference.
- Reminder preference.

### Match Ranker

Scores matches using:

- Favorite team relevance.
- Match stage.
- Team strength or popularity.
- Time friendliness.
- Rivalry or storyline value.
- Potential qualification impact.
- Social watch suitability.

### Plan Generator

Converts ranked matches into a viewing plan:

- Must-watch.
- Recommended.
- Highlights-only.
- Skippable.

Each recommendation should include a short reason.

### Context Explainer

Creates plain-language match context:

- Why the match matters.
- What a casual fan should watch for.
- Key players or narratives.
- Possible impact on qualification or tournament path.

### Reminder Agent

Manages match reminders:

- Stores selected reminders locally.
- Supports reminders such as 10 minutes, 30 minutes, or 1 hour before kickoff.
- Shows an in-app notification if the page is open.
- Uses Web Notification when permission is granted.
- Keeps the architecture ready for future server-side notification support.

### Plan Adjuster

Updates the plan based on user requests:

- Less late-night viewing.
- More favorite-team focus.
- More social matches.
- More beginner-friendly matches.
- More high-stakes matches.

## Data Strategy

The MVP should not depend on a live data API to work.

Default data source:

- Local mock World Cup match data.
- Enough sample matches to demonstrate group-stage and knockout-stage planning.

Future API-ready design:

- Create a football data access layer.
- Keep UI and agent logic independent from the specific data provider.
- Support switching between mock data and external API data.
- Candidate APIs include football-data.org and API-Football, depending on limits, coverage, and key availability.

Recommended real-data scope:

- Fixtures.
- Teams.
- Match status.
- Scores.
- Standings or qualification context if available.

Avoid in MVP:

- Minute-by-minute live commentary.
- Betting odds.
- Expensive advanced player metrics.

## Reminder Design

MVP reminder behavior:

- Users can set reminders from match cards or match detail pages.
- Reminder options include 10 minutes, 30 minutes, and 1 hour before kickoff.
- Reminder data is stored in local storage.
- A timer checks upcoming reminders while the app is open.
- The app shows a toast or modal when a reminder triggers.
- If Web Notification permission is granted, the app can also show a browser notification.

Future notification architecture:

- Store users and reminders in a backend database.
- Use scheduled jobs to check upcoming matches.
- Send push notifications, emails, or mini-program subscription messages.

## Technical Architecture

Recommended stack:

- Vite React or Next.js for the web app.
- TypeScript for data models and agent interfaces.
- Tailwind CSS for mobile-first styling.
- Local storage for MVP user profile and reminders.
- Mock data files for the initial match schedule.
- Optional LLM integration through a service abstraction.
- Vercel deployment for portfolio sharing.

Core modules:

- `data`: mock schedule and future API adapter.
- `profile`: user preference storage.
- `scoring`: match ranking rules.
- `planner`: plan generation.
- `insights`: pre-match explanation generation.
- `reminders`: local reminder scheduling.
- `ai`: optional LLM adapter and fallback templates.
- `ui`: pages, cards, navigation, and mobile layout.

## AI Integration Strategy

The app should work without an LLM API key.

Fallback mode:

- Rule-based scoring.
- Template-generated plans and insights.
- Deterministic demo output.

LLM mode:

- Use structured input from user profile and match data.
- Generate natural-language plan explanations.
- Answer Ask AI questions with guardrails.
- Avoid making unsupported factual claims if live data is unavailable.

This approach makes the project stable for GitHub reviewers while still showing AI product and agent architecture.

## Success Criteria

The MVP is successful if a reviewer can:

- Open the web app on desktop or mobile.
- Choose a favorite team and preferences.
- See a personalized World Cup home page.
- Generate a viewing plan.
- Open a match detail page.
- Set a match reminder and see it listed.
- Ask AI-style questions or use plan adjustment actions.
- Understand the product strategy and architecture from the documentation.

## Portfolio Deliverables

Repository deliverables:

- Working web app.
- `README.md` with project overview, screenshots, setup instructions, and architecture summary.
- `docs/PRD.md`.
- `docs/agent-workflow.md`.
- `docs/api-design.md`.
- `docs/reminder-design.md`.
- Architecture diagram.
- Product screenshots.
- Resume-ready project description in Chinese and English.

Suggested resume description:

> MatchPilot: Built a mobile-first AI World Cup planning agent that personalizes match recommendations based on favorite team, time availability, and viewing preferences. Designed agent workflows for profile collection, match ranking, plan generation, contextual explanation, and reminder management, with mock data fallback and API-ready architecture.

## Implementation Defaults

The first implementation should use these defaults unless a later planning step changes them:

- Use Vite React with TypeScript for a lightweight portfolio-friendly web app.
- Use mock match data in the first implementation pass, with an API adapter interface documented and prepared.
- Start with rule-based scoring and template-based AI fallback behavior, then add optional LLM integration only after the core demo is stable.
- Use a mobile-first visual style inspired by modern sports apps: high contrast, strong match cards, compact navigation, and clear reminder controls.
