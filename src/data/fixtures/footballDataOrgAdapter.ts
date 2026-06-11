import type { FixtureDataSource, Match, MatchStage } from "../../types";

interface FootballDataOrgTeam {
  name?: string;
  shortName?: string;
  tla?: string;
}

interface FootballDataOrgMatch {
  id: number;
  utcDate: string;
  stage?: string;
  group?: string | null;
  homeTeam?: FootballDataOrgTeam;
  awayTeam?: FootballDataOrgTeam;
}

interface FootballDataOrgResponse {
  matches?: FootballDataOrgMatch[];
}

export interface FootballDataOrgProvider {
  id: string;
  loadMatches(): Promise<Match[]>;
  loadDataSource(): Promise<FixtureDataSource>;
}

interface FootballDataOrgProviderOptions {
  apiKey: string;
  fetcher?: typeof fetch;
  baseUrl?: string;
}

function mapStage(stage?: string): MatchStage {
  switch (stage) {
    case "LAST_32":
      return "Round of 32";
    case "LAST_16":
      return "Round of 16";
    case "QUARTER_FINALS":
      return "Quarter-final";
    case "SEMI_FINALS":
      return "Semi-final";
    case "FINAL":
      return "Final";
    default:
      return "Group";
  }
}

function teamName(team?: FootballDataOrgTeam): string {
  return team?.name ?? team?.shortName ?? team?.tla ?? "TBD";
}

function mapFootballDataOrgMatch(match: FootballDataOrgMatch): Match {
  return {
    id: `fd-${match.id}`,
    homeTeam: teamName(match.homeTeam),
    awayTeam: teamName(match.awayTeam),
    kickoffUtc: new Date(match.utcDate).toISOString(),
    venue: "TBD",
    stage: mapStage(match.stage),
    group: match.group?.replace("GROUP_", "") ?? undefined,
    storylineTags: ["api-fixture"],
    popularity: 70,
    qualificationImpact: match.stage === "FINAL" ? 100 : 75
  };
}

export function createFootballDataOrgProvider({
  apiKey,
  fetcher = fetch,
  baseUrl = "https://api.football-data.org/v4"
}: FootballDataOrgProviderOptions): FootballDataOrgProvider {
  async function loadMatches(): Promise<Match[]> {
    const response = await fetcher(`${baseUrl}/competitions/WC/matches`, {
      headers: { "X-Auth-Token": apiKey }
    });

    if (!response.ok) {
      throw new Error(`football-data.org returned ${response.status}`);
    }

    const data = (await response.json()) as FootballDataOrgResponse;
    return (data.matches ?? []).map(mapFootballDataOrgMatch);
  }

  return {
    id: "football-data-org-wc",
    loadMatches,
    loadDataSource: async () => ({
      provider: "football-data.org",
      coverage: "live-api",
      updatedAt: new Date().toISOString().slice(0, 10),
      sourceUrl: `${baseUrl}/competitions/WC/matches`,
      sourceLabel: "football-data.org World Cup matches endpoint",
      matchCount: (await loadMatches()).length,
      reliabilityNote:
        "Live API adapter prepared for future sync. The current app still defaults to the static FIFA verified sample."
    })
  };
}
