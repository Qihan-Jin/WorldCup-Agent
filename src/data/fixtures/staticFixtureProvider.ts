import { fixtureDataSource, fixtureSampleMatches } from "../fixtureSample";
import type { FixtureProvider } from "./fixtureProvider";

export const staticFixtureProvider: FixtureProvider = {
  id: "static-fifa-full-schedule",
  getMatches: () => fixtureSampleMatches,
  getDataSource: () => ({
    ...fixtureDataSource,
    matchCount: fixtureSampleMatches.length
  })
};
