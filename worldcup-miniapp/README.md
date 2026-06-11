# WorldCup Agent Mini Program

This folder contains the WeChat Mini Program MVP for MatchPilot / WorldCup Agent.

## Current Launch Scope

The launch-safe Mini Program focuses on stable utility features:

- Choose language.
- Choose a favorite team.
- View today's matches and favorite-team matches.
- Browse the schedule by date.
- Open match details.
- View group standings.
- View knockout-stage placeholders.
- Save local reminder preferences.

AI viewing-plan and Ask AI flows are documented in the portfolio prototype, but are not part of this Mini Program launch build yet. Match statistics are also intentionally hidden until a reliable live stats source is connected.

## AppID

`project.config.json` intentionally keeps `appid` empty in the public repository:

```json
"appid": ""
```

When importing the folder in WeChat DevTools, bind your own Mini Program AppID locally. Do not commit the AppID or AppSecret to GitHub.

## Data Mode

The Mini Program can call football-data.org when a local API key is configured, but the public launch build defaults to a local static fixture fallback:

- Local fallback file: `data/static-matches.js`
- API adapter: `utils/api.js`
- API config: `utils/api-config.js`

Keep `footballDataApiKey` empty for public commits.

## Reminder Scope

The current build stores reminder choices locally and is ready for a future WeChat subscription-message template. True scheduled push notifications require a cloud function or backend scheduler and are not included in this launch-safe build.

## Before Submitting for Review

1. Import `worldcup-miniapp/` in WeChat DevTools.
2. Bind the project to your AppID locally.
3. Confirm the app compiles without errors.
4. Preview on a real device.
5. Check language selection, team selection, home, schedule, match detail, standings, and knockout pages.
6. Confirm no real API keys or AppSecret values are committed.
7. Complete the WeChat privacy protection guide and required platform settings.

## Local Test

Run from this folder:

```bash
npm test
```
