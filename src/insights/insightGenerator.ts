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
      match.storylineTags.includes("social-watch")
        ? "A match with enough storylines to watch with friends."
        : "How both teams manage pressure in key moments.",
      match.storylineTags.includes("technical-game")
        ? "Midfield control and passing rhythm."
        : "Early momentum and set-piece chances.",
      match.storylineTags.includes("host-nation")
        ? "The crowd effect around a host nation storyline."
        : "Which side creates the clearer chances after halftime."
    ],
    recap:
      "After the match, this section can summarize key turning points, standout players, and what the result changes."
  };
}
