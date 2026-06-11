# MatchPilot Fixture Data

MatchPilot currently uses a verified fixture sample instead of generated mock fixtures.

## Current Source

- Provider: FIFA
- Coverage: verified sample
- Updated: 2026-06-04
- Source: https://www.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
- Local file: `src/data/fixtureSample.ts`

The sample covers selected FIFA-published 2026 World Cup fixtures and the final placeholder. It is intentionally not treated as full tournament coverage.

## Product Guardrail

Ask AI receives the fixture source metadata and the available match list. It should only answer fixture, date, and team schedule questions from that provided context. If a team or match is missing from the verified sample, MatchPilot should say the data does not cover it yet instead of inventing details.

## Data Layer

The app now uses a provider-backed repository:

- `src/data/fixtures/fixtureProvider.ts`: common provider contract.
- `src/data/fixtures/staticFixtureProvider.ts`: default local FIFA verified sample.
- `src/data/fixtures/fixtureRepository.ts`: immutable app-facing repository.
- `src/data/matchRepository.ts`: backward-compatible default repository exports.

This keeps app pages, scoring, reminders, and Ask AI independent from where fixture data comes from.

## API-Ready Path

The repository layer exposes `getAllMatches()`, `getMatchById()`, `getMatchesForTeam()`, and `getFixtureDataSource()`. A future live API integration can replace the local fixture array while preserving the app-facing interface.

`src/data/fixtures/footballDataOrgAdapter.ts` prepares a football-data.org integration against:

```text
GET https://api.football-data.org/v4/competitions/WC/matches
X-Auth-Token: <FOOTBALL_DATA_API_KEY>
```

The adapter is intentionally not wired into the current app runtime yet. The current portfolio MVP defaults to static verified fixtures for stability, while the adapter documents and tests the future API integration point.
