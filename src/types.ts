export type MatchStage =
  | "Group"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third place"
  | "Final";

export type WatchDepth = "casual" | "regular" | "tactical";

export type SleepTolerance = "none" | "some" | "high";

export type ViewingPriority = "must-watch" | "recommended" | "highlights" | "skip";

export interface Match {
  id: string;
  matchNumber?: number;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  kickoffLocal?: string;
  venue: string;
  city?: string;
  stage: MatchStage;
  group?: string;
  storylineTags: string[];
  popularity: number;
  qualificationImpact: number;
}

export interface FixtureDataSource {
  provider: string;
  coverage: "verified-sample" | "full-static" | "live-api";
  updatedAt: string;
  sourceUrl: string;
  sourceLabel: string;
  matchCount: number;
  reliabilityNote: string;
}

export interface UserProfile {
  favoriteTeam: string;
  otherTeams: string[];
  sleepTolerance: SleepTolerance;
  watchDepth: WatchDepth;
  socialViewing: boolean;
  reminderMinutes: number;
}

export interface ScoredMatch {
  match: Match;
  score: number;
  reasons: string[];
  priority: ViewingPriority;
}

export interface ViewingPlan {
  summary: string;
  groups: Record<ViewingPriority, ScoredMatch[]>;
}

export interface Reminder {
  id: string;
  matchId: string;
  minutesBefore: number;
  triggerAtUtc: string;
  delivered: boolean;
}
