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
