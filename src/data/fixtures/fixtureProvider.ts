import type { FixtureDataSource, Match } from "../../types";

export interface FixtureProvider {
  id: string;
  getMatches(): Match[];
  getDataSource(): FixtureDataSource;
}
