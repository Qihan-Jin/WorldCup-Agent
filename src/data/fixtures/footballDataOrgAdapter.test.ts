import { describe, expect, it, vi } from "vitest";
import { createFootballDataOrgProvider } from "./footballDataOrgAdapter";

describe("footballDataOrgAdapter", () => {
  it("loads WC fixtures through the football-data.org competition matches endpoint", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        matches: [
          {
            id: 1001,
            utcDate: "2026-06-11T19:00:00Z",
            stage: "GROUP_STAGE",
            group: "GROUP_A",
            homeTeam: { name: "Mexico" },
            awayTeam: { name: "South Africa" },
            competition: { code: "WC" }
          }
        ]
      })
    });
    const provider = createFootballDataOrgProvider({ apiKey: "test-key", fetcher });

    const matches = await provider.loadMatches();

    expect(fetcher).toHaveBeenCalledWith("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: { "X-Auth-Token": "test-key" }
    });
    expect(matches[0]).toMatchObject({
      id: "fd-1001",
      homeTeam: "Mexico",
      awayTeam: "South Africa",
      stage: "Group"
    });
  });
});
