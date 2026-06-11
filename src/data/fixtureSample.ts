import type { FixtureDataSource, Match, MatchStage } from "../types";

export const fixtureDataSource: Omit<FixtureDataSource, "matchCount"> = {
  provider: "FIFA",
  coverage: "full-static",
  updatedAt: "2026-06-04",
  sourceUrl: "https://www.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums",
  sourceLabel: "FIFA World Cup 2026 official match schedule",
  reliabilityNote:
    "Full static 104-match schedule compiled from the published 2026 World Cup draw and match schedule. It is not a live score feed."
};

type Offset = -7 | -6 | -5 | -4;

function kickoffUtc(localDate: string, localTime: string, offset: Offset): string {
  const [year, month, day] = localDate.split("-").map(Number);
  const [hour, minute] = localTime.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - offset, minute)).toISOString();
}

function tagsFor(stage: MatchStage, homeTeam: string, awayTeam: string): string[] {
  const tags = stage === "Group" ? ["group-stage"] : ["knockout"];
  if (`${homeTeam} ${awayTeam}`.includes("Final")) tags.push("tbd");
  if (stage === "Final") tags.push("final", "global-event", "must-watch");
  if (stage !== "Group") tags.push("high-stakes");
  return tags;
}

function impactFor(stage: MatchStage): number {
  if (stage === "Final") return 100;
  if (stage === "Semi-final") return 96;
  if (stage === "Quarter-final") return 92;
  if (stage === "Round of 16") return 88;
  if (stage === "Round of 32") return 84;
  if (stage === "Third place") return 86;
  return 76;
}

function m(
  matchNumber: number,
  stage: MatchStage,
  localDate: string,
  localTime: string,
  offset: Offset,
  venue: string,
  homeTeam: string,
  awayTeam: string,
  group?: string
): Match {
  return {
    id: `m-${matchNumber}`,
    matchNumber,
    homeTeam,
    awayTeam,
    kickoffUtc: kickoffUtc(localDate, localTime, offset),
    kickoffLocal: `${localDate} ${localTime}`,
    venue,
    stage,
    group,
    storylineTags: tagsFor(stage, homeTeam, awayTeam),
    popularity: stage === "Group" ? 78 : 88,
    qualificationImpact: impactFor(stage)
  };
}

export const fixtureSampleMatches: Match[] = [
  m(1, "Group", "2026-06-11", "13:00", -6, "Mexico City", "Mexico", "South Africa", "A"),
  m(2, "Group", "2026-06-11", "20:00", -6, "Guadalajara", "Korea Republic", "Czechia", "A"),
  m(3, "Group", "2026-06-12", "15:00", -4, "Toronto", "Canada", "Bosnia and Herzegovina", "B"),
  m(4, "Group", "2026-06-12", "20:00", -7, "San Francisco Bay Area", "Qatar", "Switzerland", "B"),
  m(5, "Group", "2026-06-13", "12:00", -4, "Boston", "Brazil", "Morocco", "C"),
  m(6, "Group", "2026-06-13", "18:00", -4, "Philadelphia", "Haiti", "Scotland", "C"),
  m(7, "Group", "2026-06-13", "14:00", -7, "Los Angeles", "USA", "Paraguay", "D"),
  m(8, "Group", "2026-06-13", "21:00", -7, "Vancouver", "Australia", "Türkiye", "D"),
  m(9, "Group", "2026-06-14", "12:00", -5, "Houston", "Curaçao", "Germany", "E"),
  m(10, "Group", "2026-06-14", "15:00", -4, "MetLife Stadium", "Côte d'Ivoire", "Ecuador", "E"),
  m(11, "Group", "2026-06-14", "13:00", -6, "Monterrey", "Netherlands", "Japan", "F"),
  m(12, "Group", "2026-06-14", "18:00", -5, "Dallas", "Tunisia", "Sweden", "F"),
  m(13, "Group", "2026-06-15", "12:00", -4, "Atlanta", "Belgium", "Egypt", "G"),
  m(14, "Group", "2026-06-15", "15:00", -4, "Miami", "IR Iran", "New Zealand", "G"),
  m(15, "Group", "2026-06-15", "15:00", -5, "Kansas City", "Spain", "Cabo Verde", "H"),
  m(16, "Group", "2026-06-15", "18:00", -5, "Houston", "Saudi Arabia", "Uruguay", "H"),
  m(17, "Group", "2026-06-16", "12:00", -4, "Philadelphia", "France", "Senegal", "I"),
  m(18, "Group", "2026-06-16", "15:00", -4, "MetLife Stadium", "Norway", "Iraq", "I"),
  m(19, "Group", "2026-06-16", "15:00", -5, "Kansas City", "Argentina", "Algeria", "J"),
  m(20, "Group", "2026-06-16", "18:00", -5, "Dallas", "Austria", "Jordan", "J"),
  m(21, "Group", "2026-06-17", "12:00", -4, "Miami", "Portugal", "Uzbekistan", "K"),
  m(22, "Group", "2026-06-17", "15:00", -5, "Houston", "Colombia", "Congo DR", "K"),
  m(23, "Group", "2026-06-17", "16:00", -5, "Dallas", "England", "Croatia", "L"),
  m(24, "Group", "2026-06-17", "18:00", -7, "San Francisco Bay Area", "Ghana", "Panama", "L"),
  m(25, "Group", "2026-06-18", "12:00", -4, "Atlanta", "South Africa", "Czechia", "A"),
  m(26, "Group", "2026-06-18", "19:00", -6, "Mexico City", "Mexico", "Korea Republic", "A"),
  m(27, "Group", "2026-06-18", "15:00", -4, "Philadelphia", "Canada", "Qatar", "B"),
  m(28, "Group", "2026-06-18", "18:00", -7, "Los Angeles", "Switzerland", "Bosnia and Herzegovina", "B"),
  m(29, "Group", "2026-06-19", "12:00", -4, "Boston", "Scotland", "Morocco", "C"),
  m(30, "Group", "2026-06-19", "18:00", -4, "Miami", "Brazil", "Haiti", "C"),
  m(31, "Group", "2026-06-19", "15:00", -7, "Seattle", "USA", "Australia", "D"),
  m(32, "Group", "2026-06-19", "18:00", -5, "Kansas City", "Türkiye", "Paraguay", "D"),
  m(33, "Group", "2026-06-20", "12:00", -5, "Houston", "Ecuador", "Germany", "E"),
  m(34, "Group", "2026-06-20", "18:00", -7, "Vancouver", "Curaçao", "Côte d'Ivoire", "E"),
  m(35, "Group", "2026-06-20", "16:00", -5, "Dallas", "Sweden", "Japan", "F"),
  m(36, "Group", "2026-06-20", "19:00", -6, "Monterrey", "Netherlands", "Tunisia", "F"),
  m(37, "Group", "2026-06-21", "12:00", -4, "MetLife Stadium", "New Zealand", "Egypt", "G"),
  m(38, "Group", "2026-06-21", "18:00", -4, "Miami", "Belgium", "IR Iran", "G"),
  m(39, "Group", "2026-06-21", "15:00", -5, "Dallas", "Uruguay", "Cabo Verde", "H"),
  m(40, "Group", "2026-06-21", "18:00", -5, "Houston", "Spain", "Saudi Arabia", "H"),
  m(41, "Group", "2026-06-22", "12:00", -4, "Philadelphia", "Iraq", "Senegal", "I"),
  m(42, "Group", "2026-06-22", "15:00", -4, "Boston", "France", "Norway", "I"),
  m(43, "Group", "2026-06-22", "15:00", -5, "Kansas City", "Jordan", "Algeria", "J"),
  m(44, "Group", "2026-06-22", "19:00", -6, "Mexico City", "Argentina", "Austria", "J"),
  m(45, "Group", "2026-06-23", "12:00", -4, "Miami", "Congo DR", "Uzbekistan", "K"),
  m(46, "Group", "2026-06-23", "15:00", -5, "Houston", "Portugal", "Colombia", "K"),
  m(47, "Group", "2026-06-23", "15:00", -5, "Dallas", "Panama", "Croatia", "L"),
  m(48, "Group", "2026-06-23", "18:00", -7, "San Francisco Bay Area", "England", "Ghana", "L"),
  m(49, "Group", "2026-06-24", "15:00", -6, "Guadalajara", "South Africa", "Korea Republic", "A"),
  m(50, "Group", "2026-06-24", "16:00", -6, "Monterrey", "Czechia", "Mexico", "A"),
  m(51, "Group", "2026-06-24", "18:00", -7, "Vancouver", "Canada", "Switzerland", "B"),
  m(52, "Group", "2026-06-24", "18:00", -7, "Seattle", "Bosnia and Herzegovina", "Qatar", "B"),
  m(53, "Group", "2026-06-25", "15:00", -4, "Miami", "Scotland", "Brazil", "C"),
  m(54, "Group", "2026-06-25", "15:00", -4, "Atlanta", "Morocco", "Haiti", "C"),
  m(55, "Group", "2026-06-25", "18:00", -5, "Kansas City", "Paraguay", "Australia", "D"),
  m(56, "Group", "2026-06-25", "18:00", -5, "Dallas", "Türkiye", "USA", "D"),
  m(57, "Group", "2026-06-26", "15:00", -4, "Boston", "Ecuador", "Curaçao", "E"),
  m(58, "Group", "2026-06-26", "15:00", -4, "Philadelphia", "Germany", "Côte d'Ivoire", "E"),
  m(59, "Group", "2026-06-26", "17:00", -6, "Guadalajara", "Japan", "Tunisia", "F"),
  m(60, "Group", "2026-06-26", "17:00", -6, "Monterrey", "Sweden", "Netherlands", "F"),
  m(61, "Group", "2026-06-27", "15:00", -4, "MetLife Stadium", "New Zealand", "Belgium", "G"),
  m(62, "Group", "2026-06-27", "15:00", -4, "Toronto", "Egypt", "IR Iran", "G"),
  m(63, "Group", "2026-06-27", "18:00", -7, "San Francisco Bay Area", "Uruguay", "Spain", "H"),
  m(64, "Group", "2026-06-27", "18:00", -7, "Los Angeles", "Cabo Verde", "Saudi Arabia", "H"),
  m(65, "Group", "2026-06-28", "15:00", -4, "Miami", "Iraq", "France", "I"),
  m(66, "Group", "2026-06-28", "15:00", -4, "Atlanta", "Senegal", "Norway", "I"),
  m(67, "Group", "2026-06-28", "16:00", -5, "Dallas", "Jordan", "Argentina", "J"),
  m(68, "Group", "2026-06-28", "16:00", -5, "Kansas City", "Algeria", "Austria", "J"),
  m(69, "Group", "2026-06-29", "15:00", -4, "Boston", "Congo DR", "Portugal", "K"),
  m(70, "Group", "2026-06-29", "15:00", -4, "MetLife Stadium", "Uzbekistan", "Colombia", "K"),
  m(71, "Group", "2026-06-29", "18:00", -4, "Philadelphia", "Panama", "England", "L"),
  m(72, "Group", "2026-06-29", "15:00", -4, "Toronto", "Croatia", "Ghana", "L"),
  m(73, "Round of 32", "2026-06-28", "15:00", -7, "Los Angeles", "Group A runners-up", "Group B runners-up"),
  m(74, "Round of 32", "2026-06-29", "12:00", -4, "Boston", "Group E winners", "Third place Group A/B/C/D/F"),
  m(75, "Round of 32", "2026-06-29", "16:30", -6, "Monterrey", "Group F winners", "Group C runners-up"),
  m(76, "Round of 32", "2026-06-29", "15:00", -5, "Houston", "Group C winners", "Group F runners-up"),
  m(77, "Round of 32", "2026-06-30", "15:00", -4, "MetLife Stadium", "Group I winners", "Third place Group C/D/F/G/H"),
  m(78, "Round of 32", "2026-06-30", "18:00", -5, "Dallas", "Group E runners-up", "Group I runners-up"),
  m(79, "Round of 32", "2026-06-30", "16:00", -6, "Mexico City", "Group A winners", "Third place Group C/E/F/H/I"),
  m(80, "Round of 32", "2026-07-01", "15:00", -4, "Atlanta", "Group L winners", "Third place Group E/H/I/J/K"),
  m(81, "Round of 32", "2026-07-01", "15:00", -7, "San Francisco Bay Area", "Group D winners", "Third place Group B/E/F/I/J"),
  m(82, "Round of 32", "2026-07-01", "21:00", -7, "Seattle", "Group G winners", "Third place Group A/E/H/I/J"),
  m(83, "Round of 32", "2026-07-02", "18:00", -7, "Los Angeles", "Group K runners-up", "Group L runners-up"),
  m(84, "Round of 32", "2026-07-02", "15:00", -4, "Toronto", "Group H winners", "Group J runners-up"),
  m(85, "Round of 32", "2026-07-02", "17:00", -6, "Guadalajara", "Group B winners", "Third place Group E/F/G/I/J"),
  m(86, "Round of 32", "2026-07-03", "15:00", -4, "Miami", "Group J winners", "Group H runners-up"),
  m(87, "Round of 32", "2026-07-03", "15:00", -5, "Kansas City", "Group K winners", "Third place Group D/E/I/J/L"),
  m(88, "Round of 32", "2026-07-03", "18:00", -5, "Dallas", "Group D runners-up", "Group G runners-up"),
  m(89, "Round of 16", "2026-07-04", "15:00", -4, "Philadelphia", "Winner Match 74", "Winner Match 73"),
  m(90, "Round of 16", "2026-07-04", "18:00", -5, "Houston", "Winner Match 75", "Winner Match 76"),
  m(91, "Round of 16", "2026-07-05", "12:00", -4, "MetLife Stadium", "Winner Match 79", "Winner Match 80"),
  m(92, "Round of 16", "2026-07-05", "16:00", -6, "Mexico City", "Winner Match 77", "Winner Match 78"),
  m(93, "Round of 16", "2026-07-06", "15:00", -5, "Dallas", "Winner Match 83", "Winner Match 84"),
  m(94, "Round of 16", "2026-07-06", "15:00", -7, "Seattle", "Winner Match 81", "Winner Match 82"),
  m(95, "Round of 16", "2026-07-07", "15:00", -4, "Atlanta", "Winner Match 85", "Winner Match 86"),
  m(96, "Round of 16", "2026-07-07", "18:00", -7, "Vancouver", "Winner Match 87", "Winner Match 88"),
  m(97, "Quarter-final", "2026-07-09", "15:00", -4, "Boston", "Winner Match 89", "Winner Match 90"),
  m(98, "Quarter-final", "2026-07-10", "18:00", -7, "Los Angeles", "Winner Match 91", "Winner Match 92"),
  m(99, "Quarter-final", "2026-07-11", "12:00", -4, "Miami", "Winner Match 93", "Winner Match 94"),
  m(100, "Quarter-final", "2026-07-11", "15:00", -5, "Kansas City", "Winner Match 95", "Winner Match 96"),
  m(101, "Semi-final", "2026-07-14", "20:00", -4, "Dallas", "Winner Match 97", "Winner Match 98"),
  m(102, "Semi-final", "2026-07-15", "20:00", -4, "Atlanta", "Winner Match 99", "Winner Match 100"),
  m(103, "Third place", "2026-07-18", "17:00", -4, "Miami", "Loser Match 101", "Loser Match 102"),
  m(104, "Final", "2026-07-19", "15:00", -4, "MetLife Stadium", "Winner Match 101", "Winner Match 102")
];
