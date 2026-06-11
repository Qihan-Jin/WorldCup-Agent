import { createFixtureRepository } from "./fixtures/fixtureRepository";
import { staticFixtureProvider } from "./fixtures/staticFixtureProvider";

const defaultFixtureRepository = createFixtureRepository(staticFixtureProvider);

export const getAllMatches = defaultFixtureRepository.getAllMatches;
export const getFixtureDataSource = defaultFixtureRepository.getFixtureDataSource;
export const getMatchById = defaultFixtureRepository.getMatchById;
export const getMatchesForTeam = defaultFixtureRepository.getMatchesForTeam;
