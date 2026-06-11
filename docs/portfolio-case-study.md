# MatchPilot Portfolio Case Study

## Overview

MatchPilot is a mobile-first AI World Cup planning agent for casual fans who want to participate in the 2026 tournament without tracking every fixture manually.

The product turns raw match data into an actionable viewing plan: anchor around a favorite team, identify high-value matches, explain why they matter, and set reminders before kickoff.

## Problem

During a World Cup, casual fans face information overload:

- The fixture list is long and time zones are inconvenient.
- Many users care about one team, a few stars, or social viewing moments rather than every match.
- Raw schedules do not explain whether a match is worth staying up for.
- Reminder behavior is fragmented across calendars, chats, and sports apps.

The core product question is: **How might we help a time-constrained fan decide what to watch and avoid missing the matches that matter to them?**

## Target User

Primary users are casual and lightweight football fans:

- They have a favorite team or region.
- They want a simple recommendation, not tactical analysis.
- They may watch only a handful of matches live.
- They need match context in plain language.
- They benefit from reminders because many kickoff times are outside normal routines.

## Product Hypothesis

If MatchPilot captures a user's favorite team and viewing preferences, then it can turn a complex tournament schedule into a personalized plan that feels useful enough to revisit throughout the tournament.

## MVP Scope

The MVP is split into two layers:

### Utility MVP

Implemented in the WeChat Mini Program:

- Language selection.
- Favorite-team selection.
- Home dashboard with next match and countdown.
- Today's matches and favorite-team schedule.
- Calendar-style fixture browsing.
- Match detail pages.
- Group standings.
- Knockout bracket.
- Local reminder storage and WeChat subscription-message readiness.

### AI Planning Prototype

Implemented in the React prototype:

- User profile storage.
- Rule-based match scoring.
- Personalized viewing-plan generation.
- Ask AI page with fallback answers.
- Match insight generation.
- Adapter-ready data layer.

This split keeps the public demo useful while also showing how the AI product concept would scale.

## Agent Workflow

MatchPilot is designed as a structured agent workflow rather than a free-form chatbot.

### Profile Collector

Collects favorite team, watch depth, time tolerance, and reminder preferences.

### Match Ranker

Scores each match based on:

- Favorite-team relevance.
- Tournament stage.
- Time friendliness.
- Storyline value.
- Social-watch potential.

### Plan Generator

Groups matches into:

- Must-watch.
- Recommended.
- Highlights.
- Skippable.

### Context Explainer

Explains why a match matters in casual-fan language: stakes, storylines, players to watch, and what the result could change.

### Reminder Agent

Stores reminder intent and prepares the system for future scheduled push notifications.

## Data Strategy

The project separates stable product logic from data-source details.

- The React prototype defaults to local verified fixture samples for reliable demos.
- The codebase includes a football-data.org adapter for future live data.
- The Mini Program has a football-data.org integration layer with local cache.
- No production API keys are committed.

This lets the project demonstrate API readiness without depending on paid or unstable data during portfolio review.

## Key Trade-Offs

### Rules First, LLM Second

The first version uses deterministic scoring and fallback AI responses. This makes demos stable and prevents hallucinated match facts. LLM integration is treated as an explanation layer that should operate only over verified fixture context.

### Utility Before Full AI in Mini Program

The Mini Program prioritizes useful tournament navigation before adding Ask AI. This reduces launch risk and gives the AI layer a concrete workflow to enhance later.

### Local Reminders Before Cloud Push

Local reminder storage and subscription-message readiness are implemented first. True scheduled push requires a backend or cloud function and is intentionally left as the next infrastructure step.

## What I Would Improve Next

1. Move AI viewing-plan and Ask AI flows into the Mini Program.
2. Add a backend proxy for LLM calls so keys never appear in client code.
3. Replace placeholder squads and stats with licensed or manually verified data.
4. Add cloud-scheduled reminder delivery.
5. Add product analytics events for team selection, reminder creation, match-detail opens, and Ask AI prompts.

## Resume Summary

Designed and implemented MatchPilot, a mobile-first AI World Cup viewing-planning agent for casual football fans. The product captures a user's favorite team and viewing preferences, ranks matches by relevance and watchability, generates personalized viewing plans, explains match context, and supports kickoff reminders. The project includes a React AI-planning prototype, a WeChat Mini Program MVP, modular agent workflow design, local fallback logic, and API-ready data architecture.
