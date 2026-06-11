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
