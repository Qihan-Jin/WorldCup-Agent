import type { UserProfile } from "../types";

const PROFILE_STORAGE_KEY = "matchpilot.profile";

export const defaultProfile: UserProfile = {
  favoriteTeam: "Argentina",
  otherTeams: ["Japan"],
  sleepTolerance: "some",
  watchDepth: "casual",
  socialViewing: true,
  reminderMinutes: 30,
};

export function loadProfile(): UserProfile {
  const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!storedProfile) {
    return defaultProfile;
  }

  try {
    const parsedProfile = JSON.parse(storedProfile);

    if (!parsedProfile || typeof parsedProfile !== "object" || Array.isArray(parsedProfile)) {
      return defaultProfile;
    }

    return { ...defaultProfile, ...parsedProfile };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
