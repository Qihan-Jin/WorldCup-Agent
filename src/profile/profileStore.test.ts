import { beforeEach, describe, expect, it } from "vitest";
import { defaultProfile, loadProfile, saveProfile } from "./profileStore";

describe("profileStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a default profile when no profile exists", () => {
    expect(loadProfile()).toEqual(defaultProfile);
  });

  it("saves and loads a user profile", () => {
    saveProfile({ ...defaultProfile, favoriteTeam: "Japan", socialViewing: true });

    expect(loadProfile().favoriteTeam).toBe("Japan");
    expect(loadProfile().socialViewing).toBe(true);
  });

  it("returns a default profile when stored profile JSON is invalid", () => {
    localStorage.setItem("matchpilot.profile", "{invalid");

    expect(loadProfile()).toEqual(defaultProfile);
  });
});
