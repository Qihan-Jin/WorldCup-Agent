import type { Match, UserProfile } from "../types";
import { generateViewingPlan } from "../planner/planGenerator";
import { scoreMatch } from "../scoring/matchScoring";

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
  const scoredMatches = matches.map((match) => scoreMatch(match, profile)).sort((a, b) => b.score - a.score);
  const topPick = scoredMatches[0];
  const favoriteMatches = scoredMatches.filter(
    (item) => item.match.homeTeam === profile.favoriteTeam || item.match.awayTeam === profile.favoriteTeam
  );

  if (lower.includes("late") || lower.includes("sleep") || lower.includes("no night")) {
    return `I would reduce late kickoffs and move lower-priority late matches into highlights. Keep ${profile.favoriteTeam} matches and the final as live-watch candidates.`;
  }

  if (lower.includes("final") || question.includes("决赛")) {
    const final = matches.find((match) => match.stage === "Final");

    if (final) {
      return `Final: ${final.homeTeam} vs ${final.awayTeam} is scheduled for ${final.kickoffUtc.slice(0, 10)} at ${final.venue}.`;
    }

    return "I do not see the final in the current match data yet.";
  }

  if (lower.includes("friend") || lower.includes("social") || lower.includes("party")) {
    const socialPick = scoredMatches.find((item) => item.match.storylineTags.includes("social-watch")) ?? topPick;
    return `For watching with friends, choose ${socialPick.match.homeTeam} vs ${socialPick.match.awayTeam}. It has a ${socialPick.score}/100 MatchPilot score and enough storylines for group chat before kickoff.`;
  }

  if (lower.includes("tonight") || lower.includes("watch") || lower.includes("worth")) {
    return `Top pick: ${topPick.match.homeTeam} vs ${topPick.match.awayTeam}. MatchPilot scores it ${topPick.score}/100 because ${topPick.reasons.join(" ")}`;
  }

  if (lower.includes(profile.favoriteTeam.toLowerCase())) {
    const firstFavorite = favoriteMatches[0];

    if (firstFavorite) {
      return `${profile.favoriteTeam} should be your anchor. Start with ${firstFavorite.match.homeTeam} vs ${firstFavorite.match.awayTeam}, then add ${plan.groups["must-watch"].length} must-watch tournament matches.`;
    }

    return `I do not have a verified fixture for ${profile.favoriteTeam} in the current verified fixture sample. I can plan around the matches I do have, but I should not invent dates for teams outside the data source.`;
  }

  return `Based on your ${profile.watchDepth} fan profile, start with ${plan.groups["must-watch"].length} must-watch matches, add friend-friendly recommended matches, and use highlights for lower-priority games.`;
}

export const fallbackAiClient: AiClient = {
  provider: "fallback",
  ask: async ({ question, profile, matches }) => askFallbackAi(question, profile, matches)
};
