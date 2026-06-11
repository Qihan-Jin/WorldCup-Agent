import { FixtureCard } from "../components/FixtureCard";
import { getTeamTournamentSchedule } from "../data/teamSchedule";
import type { Match, UserProfile } from "../types";

interface PlanPageProps {
  profile: UserProfile;
  matches: Match[];
  onOpenMatch: (matchId: string) => void;
  onReminder: (match: Match) => void;
}

export function PlanPage({ profile, matches, onOpenMatch, onReminder }: PlanPageProps) {
  const teamSchedule = getTeamTournamentSchedule(profile.favoriteTeam, matches);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">主队路径</h1>
        <p className="mt-1 text-sm text-white/60">
          {profile.favoriteTeam} · {teamSchedule.group ?? "-"} 组 · 全部小组赛和可能的淘汰赛席位。
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">小组赛</h2>
        {teamSchedule.groupMatches.length > 0 ? (
          teamSchedule.groupMatches.map((match) => (
            <FixtureCard key={match.id} match={match} onOpen={() => onOpenMatch(match.id)} onReminder={() => onReminder(match)} />
          ))
        ) : (
          <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-white/55">没有找到该队的小组赛。</p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">可能的淘汰赛路径</h2>
        {teamSchedule.knockoutPath.map((match) => (
          <FixtureCard key={match.id} match={match} onOpen={() => onOpenMatch(match.id)} onReminder={() => onReminder(match)} />
        ))}
      </div>
    </section>
  );
}
