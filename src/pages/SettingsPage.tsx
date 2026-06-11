import { getSelectableTeams } from "../data/teamOptions";
import { saveProfile } from "../profile/profileStore";
import type { SleepTolerance, UserProfile, WatchDepth } from "../types";

interface SettingsPageProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}

export function SettingsPage({ profile, onProfileChange }: SettingsPageProps) {
  const teams = getSelectableTeams();

  function updateProfile(nextProfile: UserProfile) {
    saveProfile(nextProfile);
    onProfileChange(nextProfile);
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="mt-1 text-sm text-white/60">调整你的主队、观赛偏好和提醒设置。</p>
      </div>

      <label className="block rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <span className="text-sm font-semibold">主队</span>
        <select
          value={profile.favoriteTeam}
          onChange={(event) => updateProfile({ ...profile, favoriteTeam: event.target.value })}
          className="mt-3 w-full rounded-md border border-white/10 bg-pitch px-3 py-2 text-sm text-white outline-none"
        >
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </label>

      <label className="block rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <span className="text-sm font-semibold">熬夜接受度</span>
        <select
          value={profile.sleepTolerance}
          onChange={(event) => updateProfile({ ...profile, sleepTolerance: event.target.value as SleepTolerance })}
          className="mt-3 w-full rounded-md border border-white/10 bg-pitch px-3 py-2 text-sm text-white outline-none"
        >
          <option value="none">不熬夜</option>
          <option value="some">可以少量熬夜</option>
          <option value="high">世界杯模式</option>
        </select>
      </label>

      <label className="block rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <span className="text-sm font-semibold">观赛深度</span>
        <select
          value={profile.watchDepth}
          onChange={(event) => updateProfile({ ...profile, watchDepth: event.target.value as WatchDepth })}
          className="mt-3 w-full rounded-md border border-white/10 bg-pitch px-3 py-2 text-sm text-white outline-none"
        >
          <option value="casual">普通球迷</option>
          <option value="regular">常看球</option>
          <option value="tactical">战术细节</option>
        </select>
      </label>
    </section>
  );
}
