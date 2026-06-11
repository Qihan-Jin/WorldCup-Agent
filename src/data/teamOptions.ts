import { worldCupTeams } from "./worldCupTeams";

export function getSelectableTeams(): string[] {
  return [...worldCupTeams];
}
