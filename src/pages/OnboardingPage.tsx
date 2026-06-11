import { saveProfile } from "../profile/profileStore";
import { getSelectableTeams } from "../data/teamOptions";
import type { UserProfile } from "../types";

interface OnboardingPageProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}

export function OnboardingPage({ profile, onProfileChange }: OnboardingPageProps) {
  const teams = getSelectableTeams();

  function chooseTeam(team: string) {
    const nextProfile = { ...profile, favoriteTeam: team };
    saveProfile(nextProfile);
    onProfileChange(nextProfile);
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">选择你的主队</h1>
      <p className="mt-2 text-sm text-white/65">选择一个世界杯主队，MatchPilot 会围绕它生成赛程和提醒。</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {teams.map((team) => (
          <button
            key={team}
            type="button"
            onClick={() => chooseTeam(team)}
            className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-left font-semibold text-white"
          >
            {team}
          </button>
        ))}
      </div>
    </section>
  );
}
