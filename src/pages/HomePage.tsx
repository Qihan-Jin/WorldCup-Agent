import { FixtureCard } from "../components/FixtureCard";
import { getTeamTournamentSchedule } from "../data/teamSchedule";
import type { Match, UserProfile } from "../types";

interface HomePageProps {
  profile: UserProfile;
  matches: Match[];
  onOpenMatch: (matchId: string) => void;
  onReminder: (match: Match) => void;
}

export function HomePage({ profile, matches, onOpenMatch, onReminder }: HomePageProps) {
  const teamSchedule = getTeamTournamentSchedule(profile.favoriteTeam, matches);
  const nextMatch = teamSchedule.groupMatches[0];

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{profile.favoriteTeam} 赛程</h1>
        <p className="mt-1 text-sm text-white/60">
          {teamSchedule.group ?? "-"} 组 · 3 场小组赛，以及该小组可能进入的淘汰赛路径。
        </p>
      </div>

      {nextMatch ? (
        <div className="rounded-lg bg-lime p-4 text-pitch">
          <p className="text-xs font-bold uppercase">下一场小组赛</p>
          <h2 className="mt-1 text-xl font-black">
            {nextMatch.homeTeam} vs {nextMatch.awayTeam}
          </h2>
          <p className="mt-1 text-sm">{new Date(nextMatch.kickoffUtc).toLocaleString()}</p>
        </div>
      ) : (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
          当前 2026 世界杯赛程数据没有覆盖这支球队。
        </p>
      )}

      <div className="space-y-3">
        <h2 className="text-base font-semibold">小组赛</h2>
        {teamSchedule.groupMatches.map((match) => (
          <FixtureCard key={match.id} match={match} onOpen={() => onOpenMatch(match.id)} onReminder={() => onReminder(match)} />
        ))}
      </div>
    </section>
  );
}
