import { describe, expect, it } from "vitest";
import { getAllMatches } from "../data/matchRepository";
import { defaultProfile } from "../profile/profileStore";
import { askFallbackAi } from "./aiAdapter";

describe("askFallbackAi", () => {
  it("answers a plan adjustment question without external API", () => {
    const answer = askFallbackAi("I cannot stay up late. Adjust my plan.", defaultProfile, getAllMatches());

    expect(answer).toContain("late");
    expect(answer).toContain("highlights");
  });

  it("recommends a top match when asked what to watch", () => {
    const answer = askFallbackAi("Which match should I watch tonight?", defaultProfile, getAllMatches());

    expect(answer).toContain("Top pick");
    expect(answer).toContain("vs");
  });

  it("recommends social matches for watching with friends", () => {
    const answer = askFallbackAi("Which matches are good for watching with friends?", defaultProfile, getAllMatches());

    expect(answer).toContain("friends");
    expect(answer).toContain("vs");
  });

  it("answers final date questions from match data", () => {
    const answer = askFallbackAi("决赛是哪天", defaultProfile, getAllMatches());

    expect(answer).toContain("2026-07-19");
    expect(answer).toContain("Final");
  });

  it("does not invent fixture details for teams outside the static schedule", () => {
    const answer = askFallbackAi("Italy schedule", { ...defaultProfile, favoriteTeam: "Italy" }, getAllMatches());

    expect(answer).toContain("verified fixture");
    expect(answer).not.toContain("mock");
  });
});
