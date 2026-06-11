import type { Match } from "../types";

export interface TeamTournamentSchedule {
  team: string;
  group?: string;
  groupMatches: Match[];
  knockoutPath: Match[];
}

function normalize(value: string): string {
  return value.toLowerCase();
}

function includesGroupSlot(match: Match, group: string): boolean {
  const slotText = normalize(`${match.homeTeam} ${match.awayTeam}`);
  return (
    slotText.includes(`group ${group.toLowerCase()} winners`) ||
    slotText.includes(`group ${group.toLowerCase()} runners-up`) ||
    slotText.includes(`third place group`) && slotText.includes(group.toLowerCase())
  );
}

function winnerSlotFor(matchNumber: number): string {
  return `winner match ${matchNumber}`;
}

function loserSlotFor(matchNumber: number): string {
  return `loser match ${matchNumber}`;
}

function hasSlot(match: Match, slot: string): boolean {
  const slotText = normalize(`${match.homeTeam} ${match.awayTeam}`);
  return slotText.includes(slot);
}

function expandPathFromRoundOf32(seedMatches: Match[], allMatches: Match[]): Match[] {
  const path = [...seedMatches];
  const seen = new Set(seedMatches.map((match) => match.matchNumber));
  let frontier = seedMatches;

  while (frontier.length > 0) {
    const nextFrontier: Match[] = [];

    for (const sourceMatch of frontier) {
      if (!sourceMatch.matchNumber) continue;

      const winnerSlot = winnerSlotFor(sourceMatch.matchNumber);
      const loserSlot = loserSlotFor(sourceMatch.matchNumber);
      const descendants = allMatches.filter(
        (candidate) =>
          candidate.matchNumber &&
          !seen.has(candidate.matchNumber) &&
          (hasSlot(candidate, winnerSlot) || hasSlot(candidate, loserSlot))
      );

      for (const descendant of descendants) {
        seen.add(descendant.matchNumber);
        path.push(descendant);
        nextFrontier.push(descendant);
      }
    }

    frontier = nextFrontier;
  }

  return path.sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
}

export function getTeamTournamentSchedule(team: string, matches: Match[]): TeamTournamentSchedule {
  const groupMatches = matches
    .filter((match) => match.stage === "Group" && (match.homeTeam === team || match.awayTeam === team))
    .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
  const group = groupMatches[0]?.group;

  if (!group) {
    return { team, groupMatches: [], knockoutPath: [] };
  }

  const roundOf32Seeds = matches.filter((match) => match.stage === "Round of 32" && includesGroupSlot(match, group));

  return {
    team,
    group,
    groupMatches,
    knockoutPath: expandPathFromRoundOf32(roundOf32Seeds, matches)
  };
}
