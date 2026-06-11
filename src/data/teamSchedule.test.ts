import { describe, expect, it } from "vitest";
import { getAllMatches } from "./matchRepository";
import { getTeamTournamentSchedule } from "./teamSchedule";

describe("getTeamTournamentSchedule", () => {
  it("returns all group matches for a selected team", () => {
    const schedule = getTeamTournamentSchedule("Argentina", getAllMatches());

    expect(schedule.group).toBe("J");
    expect(schedule.groupMatches).toHaveLength(3);
    expect(schedule.groupMatches.every((match) => match.homeTeam === "Argentina" || match.awayTeam === "Argentina")).toBe(true);
  });

  it("returns future knockout path slots connected to the team's group", () => {
    const schedule = getTeamTournamentSchedule("Argentina", getAllMatches());

    expect(schedule.knockoutPath.length).toBeGreaterThan(3);
    expect(schedule.knockoutPath.some((match) => match.stage === "Round of 32")).toBe(true);
    expect(schedule.knockoutPath.some((match) => match.stage === "Final")).toBe(true);
  });
});
